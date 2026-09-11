import { createClient } from "@/lib/supabase/server"
import EditProductForm from "./EditProductForm"
import { notFound } from "next/navigation"

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient()

  const [productRes, brandsRes, categoriesRes] = await Promise.all([
    supabase.from('products').select('*').eq('id', id).single(),
    supabase.from('brands').select('*').order('name'),
    supabase.from('categories').select('*').order('name')
  ])

  if (!productRes.data) {
    notFound()
  }

  return (
    <EditProductForm 
      product={productRes.data}
      brands={brandsRes.data || []} 
      categories={categoriesRes.data || []} 
    />
  )
}
