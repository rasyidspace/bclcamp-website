import { createClient } from "@/lib/supabase/server"

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch actual rentals/orders from database
  const { data: rentals, error } = await supabase
    .from('rentals')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">My Orders</h1>
        <p className="text-muted-foreground mt-1">View and manage your rental orders.</p>
      </div>

      {rentals && rentals.length > 0 ? (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rentals.map((rental: any) => (
                <tr key={rental.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-medium">{rental.rental_code}</td>
                  <td className="px-6 py-4">{new Date(rental.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      rental.rental_status === 'completed' || rental.rental_status === 'returned' ? 'bg-green-100 text-green-800' : 
                      rental.rental_status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {rental.rental_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">Rp {rental.grand_total.toLocaleString('id-ID')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-12 text-center flex flex-col items-center justify-center">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <span className="text-2xl">📦</span>
          </div>
          <h3 className="text-lg font-medium">No orders yet</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mt-1">
            You haven't rented any equipment yet. Browse our catalog to start your next adventure!
          </p>
          <a href="/shop" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
            Start Browsing
          </a>
        </div>
      )}
    </div>
  )
}
