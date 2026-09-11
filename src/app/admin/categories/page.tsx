import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { DeleteButton } from "../components/DeleteButton"
import { deleteCategory } from "@/app/actions/admin"

export default async function AdminCategoriesPage() {
  const supabase = await createClient()
  
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Categories</h1>
          <p className="text-muted-foreground mt-1">Manage product categories.</p>
        </div>
        <Link 
          href="/admin/categories/create" 
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          Add Category
        </Link>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Slug</th>
              <th className="px-6 py-4 font-medium">Description</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {categories && categories.length > 0 ? categories.map((category: any) => (
              <tr key={category.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 font-medium">{category.name}</td>
                <td className="px-6 py-4 text-muted-foreground">{category.slug}</td>
                <td className="px-6 py-4 text-muted-foreground truncate max-w-xs">{category.description || '-'}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <Link href={`/admin/categories/${category.id}`} className="text-sm font-medium text-primary hover:underline">Edit</Link>
                    <DeleteButton id={category.id} onDelete={deleteCategory} entityName="category" />
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
