import { ReactNode } from "react"
import Link from "next/link"
import { Box, Heart, MapPin, Settings, User } from "lucide-react"

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl flex flex-col md:flex-row gap-8">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 shrink-0">
        <div className="sticky top-24 rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold leading-none">My Account</h2>
            </div>
          </div>
          
          <nav className="flex flex-col space-y-1">
            <Link 
              href="/account/orders" 
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground hover:text-foreground"
            >
              <Box className="h-4 w-4" />
              My Orders
            </Link>
            <Link 
              href="/account/wishlist" 
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground hover:text-foreground"
            >
              <Heart className="h-4 w-4" />
              Wishlist
            </Link>
            <Link 
              href="/account/addresses" 
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground hover:text-foreground"
            >
              <MapPin className="h-4 w-4" />
              Address Book
            </Link>
            <Link 
              href="/account/settings" 
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground hover:text-foreground"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
