'use server'

import { createClient } from '@/lib/supabase/server'
import { Product } from '@/lib/mockData'

function mapProduct(row: any): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    price: row.price,
    rentalPrice: row.rental_price,
    image: row.image,
    type: row.type,
    category: row.category,
    description: row.description,
    specifications: row.specifications,
  }
}

export async function getProducts(categorySlug?: string): Promise<Product[]> {
  const supabase = await createClient()

  let query = supabase
    .from('products')
    .select('*')
    .eq('status', 'active')

  if (categorySlug) {
    query = query.eq('category', categorySlug)
  }

  const { data, error } = await query

  if (error || !data) {
    console.error('Error fetching products:', error)
    return []
  }

  return data.map(mapProduct)
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .eq('slug', slug)
    .single()

  if (error || !data) {
    return null
  }

  return mapProduct(data)
}

export async function getCategories(): Promise<string[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('categories')
    .select('name')
    .order('name')

  if (error || !data) {
    return []
  }

  return data.map(c => c.name)
}
