export default function AddressesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Address Book</h1>
          <p className="text-muted-foreground mt-1">Manage your delivery addresses.</p>
        </div>
        <button className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
          Add New Address
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 rounded-bl-lg bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
            Default
          </div>
          <h3 className="font-semibold text-lg mb-1">Rasyid Tarmizi</h3>
          <p className="text-sm text-muted-foreground mb-4">+62 812-3456-7890</p>
          <p className="text-sm leading-relaxed mb-6">
            Jl. Camping Ground No. 123<br />
            Kecamatan Gunung Sindur<br />
            Bogor, Jawa Barat 16340
          </p>
          <div className="flex gap-3">
            <button className="text-sm font-medium text-primary hover:underline">Edit</button>
            <button className="text-sm font-medium text-destructive hover:underline">Delete</button>
          </div>
        </div>
      </div>
    </div>
  )
}
