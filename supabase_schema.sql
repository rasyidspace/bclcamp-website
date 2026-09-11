-- Supabase Schema for BCL Camp Rentals

-- 1. Enums
CREATE TYPE product_type AS ENUM ('buy', 'rent', 'both');
CREATE TYPE rental_status AS ENUM ('pending', 'confirmed', 'ongoing', 'returned', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('unpaid', 'pending', 'paid', 'failed', 'refunded');

-- 2. Tables
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE brands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  brand TEXT,
  category TEXT,
  price NUMERIC NOT NULL CHECK (price >= 0),
  rental_price NUMERIC CHECK (rental_price >= 0),
  image TEXT NOT NULL,
  type product_type NOT NULL,
  description TEXT,
  specifications JSONB,
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE accessories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price_per_day NUMERIC NOT NULL CHECK (price_per_day >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  image TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE rentals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  rental_code TEXT NOT NULL UNIQUE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_days INTEGER NOT NULL CHECK (total_days >= 1),
  subtotal_products NUMERIC NOT NULL CHECK (subtotal_products >= 0),
  subtotal_accessories NUMERIC NOT NULL CHECK (subtotal_accessories >= 0),
  discount NUMERIC NOT NULL DEFAULT 0 CHECK (discount >= 0),
  grand_total NUMERIC NOT NULL CHECK (grand_total >= 0),
  rental_status rental_status NOT NULL DEFAULT 'pending',
  payment_status payment_status NOT NULL DEFAULT 'unpaid',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_dates CHECK (end_date > start_date)
);

CREATE TABLE rental_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rental_id UUID REFERENCES rentals(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_per_day NUMERIC NOT NULL CHECK (price_per_day >= 0),
  total_price NUMERIC NOT NULL CHECK (total_price >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE rental_accessories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rental_id UUID REFERENCES rentals(id) ON DELETE CASCADE,
  accessory_id UUID REFERENCES accessories(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_per_day NUMERIC NOT NULL CHECK (price_per_day >= 0),
  total_price NUMERIC NOT NULL CHECK (total_price >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rental_id UUID REFERENCES rentals(id) ON DELETE CASCADE,
  transaction_id TEXT,
  payment_method TEXT,
  amount NUMERIC NOT NULL CHECK (amount >= 0),
  status payment_status NOT NULL DEFAULT 'pending',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Availability Functions
CREATE OR REPLACE FUNCTION get_product_availability(
  p_product_id UUID,
  p_start_date DATE,
  p_end_date DATE
) RETURNS INTEGER AS $$
DECLARE
  v_stock INTEGER;
  v_reserved INTEGER;
BEGIN
  SELECT stock INTO v_stock FROM products WHERE id = p_product_id;
  IF NOT FOUND THEN RETURN 0; END IF;

  SELECT COALESCE(SUM(ri.quantity), 0) INTO v_reserved
  FROM rental_items ri
  JOIN rentals r ON ri.rental_id = r.id
  WHERE ri.product_id = p_product_id
    AND r.rental_status IN ('pending', 'confirmed', 'ongoing')
    AND r.start_date < p_end_date
    AND r.end_date > p_start_date;

  RETURN v_stock - v_reserved;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_accessory_availability(
  p_accessory_id UUID,
  p_start_date DATE,
  p_end_date DATE
) RETURNS INTEGER AS $$
DECLARE
  v_stock INTEGER;
  v_reserved INTEGER;
BEGIN
  SELECT stock INTO v_stock FROM accessories WHERE id = p_accessory_id;
  IF NOT FOUND THEN RETURN 0; END IF;

  SELECT COALESCE(SUM(ra.quantity), 0) INTO v_reserved
  FROM rental_accessories ra
  JOIN rentals r ON ra.rental_id = r.id
  WHERE ra.accessory_id = p_accessory_id
    AND r.rental_status IN ('pending', 'confirmed', 'ongoing')
    AND r.start_date < p_end_date
    AND r.end_date > p_start_date;

  RETURN v_stock - v_reserved;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 4. Atomic Checkout RPC
CREATE OR REPLACE FUNCTION checkout_rental_json(
  p_user_id UUID,
  p_start_date DATE,
  p_end_date DATE,
  p_items JSONB,
  p_accessories JSONB
) RETURNS UUID AS $$
DECLARE
  v_rental_id UUID;
  v_rental_code TEXT;
  v_total_days INTEGER;
  v_subtotal_products NUMERIC := 0;
  v_subtotal_accessories NUMERIC := 0;
  v_grand_total NUMERIC := 0;
  
  v_item JSONB;
  v_acc JSONB;
  
  v_product record;
  v_accessory record;
  
  v_available INTEGER;
BEGIN
  v_total_days := p_end_date - p_start_date;
  IF v_total_days <= 0 THEN
    RAISE EXCEPTION 'Invalid rental dates';
  END IF;

  v_rental_code := 'RNT-' || TO_CHAR(NOW(), 'YYYYMMDDHH24MISS') || '-' || SUBSTRING(p_user_id::TEXT FROM 1 FOR 4);

  INSERT INTO rentals (user_id, rental_code, start_date, end_date, total_days, subtotal_products, subtotal_accessories, grand_total, rental_status, payment_status)
  VALUES (p_user_id, v_rental_code, p_start_date, p_end_date, v_total_days, 0, 0, 0, 'pending', 'unpaid')
  RETURNING id INTO v_rental_id;

  -- Process products
  IF p_items IS NOT NULL AND jsonb_array_length(p_items) > 0 THEN
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
      -- Lock product row to prevent concurrent checkouts of the same product
      SELECT * INTO v_product FROM products WHERE id = (v_item->>'product_id')::UUID FOR UPDATE;
      IF NOT FOUND THEN RAISE EXCEPTION 'Product not found'; END IF;
      
      v_available := get_product_availability((v_item->>'product_id')::UUID, p_start_date, p_end_date);
      IF v_available < (v_item->>'quantity')::INTEGER THEN
        RAISE EXCEPTION 'Product % is not available in requested quantity. Available: %', v_product.name, v_available;
      END IF;
      
      INSERT INTO rental_items (rental_id, product_id, quantity, price_per_day, total_price)
      VALUES (
        v_rental_id, 
        (v_item->>'product_id')::UUID, 
        (v_item->>'quantity')::INTEGER, 
        v_product.rental_price, 
        v_product.rental_price * (v_item->>'quantity')::INTEGER * v_total_days
      );
      
      v_subtotal_products := v_subtotal_products + (v_product.rental_price * (v_item->>'quantity')::INTEGER * v_total_days);
    END LOOP;
  END IF;

  -- Process accessories
  IF p_accessories IS NOT NULL AND jsonb_array_length(p_accessories) > 0 THEN
    FOR v_acc IN SELECT * FROM jsonb_array_elements(p_accessories) LOOP
      SELECT * INTO v_accessory FROM accessories WHERE id = (v_acc->>'accessory_id')::UUID FOR UPDATE;
      IF NOT FOUND THEN RAISE EXCEPTION 'Accessory not found'; END IF;
      
      v_available := get_accessory_availability((v_acc->>'accessory_id')::UUID, p_start_date, p_end_date);
      IF v_available < (v_acc->>'quantity')::INTEGER THEN
        RAISE EXCEPTION 'Accessory % is not available in requested quantity. Available: %', v_accessory.name, v_available;
      END IF;
      
      INSERT INTO rental_accessories (rental_id, accessory_id, quantity, price_per_day, total_price)
      VALUES (
        v_rental_id, 
        (v_acc->>'accessory_id')::UUID, 
        (v_acc->>'quantity')::INTEGER, 
        v_accessory.price_per_day, 
        v_accessory.price_per_day * (v_acc->>'quantity')::INTEGER * v_total_days
      );
      
      v_subtotal_accessories := v_subtotal_accessories + (v_accessory.price_per_day * (v_acc->>'quantity')::INTEGER * v_total_days);
    END LOOP;
  END IF;

  -- Update totals
  v_grand_total := v_subtotal_products + v_subtotal_accessories;
  
  UPDATE rentals
  SET subtotal_products = v_subtotal_products,
      subtotal_accessories = v_subtotal_accessories,
      grand_total = v_grand_total
  WHERE id = v_rental_id;

  INSERT INTO payments (rental_id, amount, status, payment_method)
  VALUES (v_rental_id, v_grand_total, 'unpaid', 'manual');

  RETURN v_rental_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. RLS Policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE accessories ENABLE ROW LEVEL SECURITY;
ALTER TABLE rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE rental_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE rental_accessories ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read products" ON products FOR SELECT USING (status = 'active');
CREATE POLICY "Public read accessories" ON accessories FOR SELECT USING (status = 'active');

CREATE POLICY "Users view own rentals" ON rentals FOR SELECT USING (auth.uid() = user_id);
-- Insert via RPC bypasses RLS for the tables if SECURITY DEFINER is set, but let's add just in case
CREATE POLICY "Users view own items" ON rental_items FOR SELECT USING (EXISTS (SELECT 1 FROM rentals r WHERE r.id = rental_id AND r.user_id = auth.uid()));
CREATE POLICY "Users view own accs" ON rental_accessories FOR SELECT USING (EXISTS (SELECT 1 FROM rentals r WHERE r.id = rental_id AND r.user_id = auth.uid()));
CREATE POLICY "Users view own payments" ON payments FOR SELECT USING (EXISTS (SELECT 1 FROM rentals r WHERE r.id = rental_id AND r.user_id = auth.uid()));
