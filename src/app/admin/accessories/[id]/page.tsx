import { createClient } from "@/lib/supabase/server"
import EditAccessoryForm from "./EditAccessoryForm"
import { notFound } from "next/navigation"

export default async function EditAccessoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient()
  
  const { data: accessory } = await supabase
    .from('accessories')
    .select('*')
    .eq('id', id)
    .single()

  if (!accessory) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">Edit Accessory</h1>
        <p className="text-muted-foreground mt-1">Update rental accessory details.</p>
      </div>

      <EditAccessoryForm accessory={accessory} />
    </div>
  )
}
