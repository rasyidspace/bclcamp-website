import { ReactNode } from "react"
import Link from "next/link"
import { Package, LayoutDashboard, ShoppingCart, Home, LogOut, LayoutList, Tag, Watch } from "lucide-react"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Admin Sidebar */}
      <aside className="w-64 shrink-0 border-r border-border flex flex-col bg-card">
        <div className="p-6 pb-8">
          <h2 className="font-heading font-bold text-xl">Admin BCL Rental</h2>
        </div>
        
        <nav className="flex-1 flex flex-col px-4 space-y-2">
          <Link 
            href="/admin" 
            className="flex items-center gap-3 rounded-md px-4 py-2.5 text-sm font-medium bg-primary text-primary-foreground"
          >
            <LayoutDashboard className="h-4 w-4" />
            Overview
          </Link>
          <Link 
            href="/admin/products" 
            className="flex items-center gap-3 rounded-md px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Package className="h-4 w-4" />
            Products
          </Link>
          <Link 
            href="/admin/rentals" 
            className="flex items-center gap-3 rounded-md px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            Rentals
          </Link>
          <Link 
            href="/admin/categories" 
            className="flex items-center gap-3 rounded-md px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <LayoutList className="h-4 w-4" />
            Categories
          </Link>
          <Link 
            href="/admin/brands" 
            className="flex items-center gap-3 rounded-md px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Tag className="h-4 w-4" />
            Brands
          </Link>
          <Link 
            href="/admin/accessories" 
            className="flex items-center gap-3 rounded-md px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Watch className="h-4 w-4" />
            Accessories
          </Link>
        </nav>

        <div className="p-4 border-t border-border flex flex-col gap-2 mt-auto">
          <Link 
            href="/shop" 
            className="flex items-center gap-3 rounded-md px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4" />
            Back to Store
          </Link>
          <button 
            className="flex items-center gap-3 rounded-md px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full text-left"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Admin Content Area */}
      <main className="flex-1 p-8 bg-zinc-50/50">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
