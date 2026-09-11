import { createClient } from "@/lib/supabase/server"

export default async function AdminRentalsPage() {
  const supabase = await createClient()
  
  const { data: rentals } = await supabase
    .from('rentals')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Rentals</h1>
          <p className="text-muted-foreground mt-1">Manage customer rental orders and statuses.</p>
        </div>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="px-6 py-4 font-medium">Rental ID</th>
              <th className="px-6 py-4 font-medium">Dates</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Total Amount</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rentals && rentals.length > 0 ? rentals.map((rental: any) => (
              <tr key={rental.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 font-medium">{rental.rental_code}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span>{new Date(rental.start_date).toLocaleDateString()} to</span>
                    <span>{new Date(rental.end_date).toLocaleDateString()}</span>
                  </div>
                </td>
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
                <td className="px-6 py-4 text-right">
                  <form action="/api/admin/update-rental" method="POST" className="inline-flex items-center gap-2">
                    <input type="hidden" name="rental_id" value={rental.id} />
                    <select name="status" defaultValue={rental.rental_status} className="h-8 rounded-md border border-input bg-background px-2 text-xs">
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="returned">Returned</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <button type="submit" className="text-xs font-medium text-primary hover:underline">Update</button>
                  </form>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                  No rental orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
