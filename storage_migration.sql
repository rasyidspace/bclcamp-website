-- Storage and Schema Migration Script (Run this in Supabase SQL Editor)

-- 1. Update the products table to support multiple additional images
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS additional_images TEXT[] DEFAULT '{}';

-- 2. Create the Storage Bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Storage RLS Policies
-- Note: RLS is already enabled by default on storage.objects in Supabase.

-- Allow public to read/download images
CREATE POLICY "Public Read Product Images" ON storage.objects 
FOR SELECT USING (bucket_id = 'product-images');

-- Allow admins to upload/insert images
CREATE POLICY "Admin Insert Product Images" ON storage.objects 
FOR INSERT WITH CHECK (
  bucket_id = 'product-images' 
  AND public.is_admin()
);

-- Allow admins to update images
CREATE POLICY "Admin Update Product Images" ON storage.objects 
FOR UPDATE USING (
  bucket_id = 'product-images' 
  AND public.is_admin()
);

-- Allow admins to delete images
CREATE POLICY "Admin Delete Product Images" ON storage.objects 
FOR DELETE USING (
  bucket_id = 'product-images' 
  AND public.is_admin()
);
