import { createClient } from "@/lib/supabase/server"
import ProductForm from "./ProductForm"

export default async function CreateProductPage() {
  const supabase = await createClient()

  const [brandsRes, categoriesRes] = await Promise.all([
    supabase.from('brands').select('*').order('name'),
    supabase.from('categories').select('*').order('name')
  ])

  return (
    <ProductForm 
      brands={brandsRes.data || []} 
      categories={categoriesRes.data || []} 
    />
  )
}
