import { createClient } from "@/lib/supabase/server"
import EditBrandForm from "./EditBrandForm"
import { notFound } from "next/navigation"

export default async function EditBrandPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient()
  
  const { data: brand } = await supabase
    .from('brands')
    .select('*')
    .eq('id', id)
    .single()

  if (!brand) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">Edit Brand</h1>
        <p className="text-muted-foreground mt-1">Update brand details.</p>
      </div>

      <EditBrandForm brand={brand} />
    </div>
  )
}
