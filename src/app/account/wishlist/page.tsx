export default function WishlistPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">Wishlist</h1>
        <p className="text-muted-foreground mt-1">Items you've saved for later.</p>
      </div>

      <div className="rounded-lg border border-dashed p-12 text-center flex flex-col items-center justify-center">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <span className="text-2xl">❤️</span>
        </div>
        <h3 className="text-lg font-medium">Your wishlist is empty</h3>
        <p className="text-muted-foreground mb-6 max-w-sm mt-1">
          Save your favorite camping gear here to quickly find them later.
        </p>
        <a href="/shop" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
          Discover Gear
        </a>
      </div>
    </div>
  )
}
