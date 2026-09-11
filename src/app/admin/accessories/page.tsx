import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { DeleteButton } from "../components/DeleteButton"
import { deleteAccessory } from "@/app/actions/admin"

export default async function AdminAccessoriesPage() {
  const supabase = await createClient()
  
  const { data: accessories } = await supabase
    .from('accessories')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Accessories</h1>
          <p className="text-muted-foreground mt-1">Manage rental accessories.</p>
        </div>
        <Link 
          href="/admin/accessories/create" 
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          Add Accessory
        </Link>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="px-6 py-4 font-medium">Image</th>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium text-right">Price/Day</th>
              <th className="px-6 py-4 font-medium text-center">Stock</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {accessories && accessories.length > 0 ? accessories.map((acc: any) => (
              <tr key={acc.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4">
                  <img src={acc.image || '/images/products/placeholder.jpg'} alt={acc.name} className="h-10 w-10 object-cover rounded-md border" />
                </td>
                <td className="px-6 py-4 font-medium">
                  <div className="flex flex-col">
                    <span>{acc.name}</span>
                    <span className="text-xs text-muted-foreground truncate max-w-[200px]">{acc.description}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">Rp {acc.price_per_day.toLocaleString('id-ID')}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    acc.stock > 5 ? 'bg-green-100 text-green-800' : 
                    acc.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {acc.stock}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <Link href={`/admin/accessories/${acc.id}`} className="text-sm font-medium text-primary hover:underline">Edit</Link>
                    <DeleteButton id={acc.id} onDelete={deleteAccessory} entityName="accessory" />
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                  No accessories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
