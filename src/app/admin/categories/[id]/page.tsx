import { createClient } from "@/lib/supabase/server"
import EditCategoryForm from "./EditCategoryForm"
import { notFound } from "next/navigation"

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!category) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">Edit Category</h1>
        <p className="text-muted-foreground mt-1">Update category details.</p>
      </div>

      <EditCategoryForm category={category} />
    </div>
  )
}
