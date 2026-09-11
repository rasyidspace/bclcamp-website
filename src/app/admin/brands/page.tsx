import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { DeleteButton } from "../components/DeleteButton"
import { deleteBrand } from "@/app/actions/admin"

export default async function AdminBrandsPage() {
  const supabase = await createClient()
  
  const { data: brands } = await supabase
    .from('brands')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Brands</h1>
          <p className="text-muted-foreground mt-1">Manage product brands.</p>
        </div>
        <Link 
          href="/admin/brands/create" 
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          Add Brand
        </Link>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Slug</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {brands && brands.length > 0 ? brands.map((brand: any) => (
              <tr key={brand.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 font-medium">{brand.name}</td>
                <td className="px-6 py-4 text-muted-foreground">{brand.slug}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <Link href={`/admin/brands/${brand.id}`} className="text-sm font-medium text-primary hover:underline">Edit</Link>
                    <DeleteButton id={brand.id} onDelete={deleteBrand} entityName="brand" />
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                  No brands found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
