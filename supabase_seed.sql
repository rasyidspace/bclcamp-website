-- Seed Data for BCL Camp (Run this in Supabase SQL Editor)

-- 1. Insert Categories
INSERT INTO categories (name, slug, description) VALUES
('Backpack', 'backpack', 'Ultralight backpacks for thru-hiking and weekend trips'),
('Shelter', 'shelter', 'Tents, tarps, and hammocks'),
('Sleeping', 'sleeping', 'Sleeping bags, quilts, and pads'),
('Cooking', 'cooking', 'Stoves, cooksets, and water filters'),
('Apparel', 'apparel', 'Outdoor clothing and rain gear'),
('Accessories', 'accessories', 'Trekking poles, repair kits, and small gear')
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert Brands
INSERT INTO brands (name, slug) VALUES
('SOTO', 'soto'),
('GSI Outdoors', 'gsi-outdoors'),
('Gear Aid', 'gear-aid'),
('Heroclip', 'heroclip'),
('Hyperlite Mountain Gear', 'hyperlite-mountain-gear'),
('Grand Trunk', 'grand-trunk'),
('Big Agnes', 'big-agnes'),
('Vipole', 'vipole')
ON CONFLICT (slug) DO NOTHING;

-- 3. Insert Products
INSERT INTO products (slug, name, brand, category, price, rental_price, image, type, description, stock) VALUES
('soto-windmaster', 'WindMaster Stove', 'SOTO', 'cooking', 1200000, 120000, '/images/products/soto-windmaster.jpg', 'both', 'Highly efficient micro regulator stove that defies the wind.', 10),
('gsi-pinnacle-dualist', 'Pinnacle Dualist Cookset', 'GSI Outdoors', 'cooking', 1500000, 150000, '/images/products/gsi-pinnacle-dualist.jpg', 'both', 'Complete, compact cooking and eating solution for two.', 15),
('gear-aid-tenacious-tape', 'Tenacious Tape', 'Gear Aid', 'accessories', 150000, NULL, '/images/products/gear-aid-tenacious-tape.jpg', 'buy', 'Ultra-strong repair tape for fixing rips, holes and gashes in outdoor gear.', 50),
('heroclip-medium', 'Medium Hybrid Gear Clip', 'Heroclip', 'accessories', 350000, NULL, '/images/products/heroclip-medium.jpg', 'buy', 'Versatile 3-in-1 clip, hook, and carabiner to hang gear anywhere.', 30),
('hmg-ultamid-2', 'Ultamid 2', 'Hyperlite Mountain Gear', 'shelter', 12500000, 1250000, '/images/products/hmg-ultamid-2.jpg', 'both', 'The UltaMid 2 is a lightweight, durable, and highly weather-resistant pyramid shelter.', 5),
('grand-trunk-skeeter-beeter', 'Skeeter Beeter Pro', 'Grand Trunk', 'shelter', 1800000, 180000, '/images/products/grand-trunk-skeeter-beeter.jpg', 'both', 'Roomy parachute nylon hammock with attached mosquito netting.', 20),
('big-agnes-copper-spur-ul2', 'Copper Spur HV UL2', 'Big Agnes', 'shelter', 8500000, 850000, '/images/products/big-agnes-copper-spur-ul2.jpg', 'both', 'Award-winning, full-featured ultralight backpacking tent.', 8),
('vipole-carbon-ql', 'Carbon QL Trekking Poles', 'Vipole', 'accessories', 2200000, 220000, '/images/products/vipole-carbon-ql.jpg', 'both', 'Ultra-lightweight 100% carbon trekking poles with quick lock system.', 12)
ON CONFLICT (slug) DO UPDATE SET 
  price = EXCLUDED.price, 
  rental_price = EXCLUDED.rental_price, 
  stock = EXCLUDED.stock;

-- 4. Insert Some Shared Accessories
INSERT INTO accessories (name, description, price_per_day, stock, image) VALUES
('Extra Tent Pegs (Set of 4)', 'Ultralight titanium pegs', 10000, 100, NULL),
('Repair Kit', 'Basic patch kit and seam sealer', 5000, 50, NULL),
('Headlamp', 'Rechargeable LED headlamp', 25000, 30, NULL);
