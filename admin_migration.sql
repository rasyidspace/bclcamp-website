-- Admin Migration Script (Run this in Supabase SQL Editor)

-- 1. Create user_roles table
CREATE TABLE user_roles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on user_roles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own role" ON user_roles FOR SELECT USING (auth.uid() = id);

-- Trigger to automatically create a role for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_roles (id, role)
  VALUES (new.id, 'customer');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists to prevent errors on rerun
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insert existing users as customers if any exist
INSERT INTO public.user_roles (id, role)
SELECT id, 'customer' FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 2. Create is_admin function to simplify RLS
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM user_roles WHERE id = auth.uid() AND role = 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Add Admin RLS Policies to existing tables
-- Products
CREATE POLICY "Admins manage products" ON products FOR ALL USING (is_admin());

-- Categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Admins manage categories" ON categories FOR ALL USING (is_admin());

-- Brands
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read brands" ON brands FOR SELECT USING (true);
CREATE POLICY "Admins manage brands" ON brands FOR ALL USING (is_admin());

-- Rentals
CREATE POLICY "Admins manage rentals" ON rentals FOR ALL USING (is_admin());

-- Rental Items
CREATE POLICY "Admins manage rental_items" ON rental_items FOR ALL USING (is_admin());

-- Payments
CREATE POLICY "Admins manage payments" ON payments FOR ALL USING (is_admin());

-- 4. How to make yourself an admin:
-- Run this query after you register an account, replacing the email with your actual email:
-- UPDATE user_roles SET role = 'admin' WHERE id = (SELECT id FROM auth.users WHERE email = 'your-email@example.com');
