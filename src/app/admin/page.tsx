import { createClient } from "@/lib/supabase/server"
import { Package, LayoutList, Tag, Users } from "lucide-react"

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  
  const { count: productCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    
  const { count: rentalCount } = await supabase
    .from('rentals')
    .select('*', { count: 'exact', head: true })

  const { data: recentRentals } = await supabase
    .from('rentals')
    .select('*, profiles:user_id(role)')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Admin BCL! Here's an overview of your store.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-xl border bg-card p-6 shadow-sm relative">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-medium text-foreground">Total Products</p>
            <Package className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-4xl font-heading font-bold">{productCount || 0}</p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm relative">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-medium text-foreground">Total Categories</p>
            <LayoutList className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-4xl font-heading font-bold">3</p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm relative">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-medium text-foreground">Total Brands</p>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-4xl font-heading font-bold">5</p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm relative">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-medium text-foreground">Total Users</p>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-4xl font-heading font-bold">4</p>
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-sm font-bold">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="border border-dashed rounded-lg py-24 flex items-center justify-center">
            <p className="text-muted-foreground text-sm">No recent activity to show yet.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
