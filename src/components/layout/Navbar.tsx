import Link from "next/link";
import Image from "next/image";
import { User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchDialog } from "@/components/layout/SearchDialog";
import { CartSidebar } from "@/components/layout/CartSidebar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { UserNav } from "@/components/layout/UserNav";
import { Suspense } from "react";
// HMR trigger

export default async function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/bcl-icon.svg" alt="Backcountry Light" width={32} height={32} className="md:hidden" />
              <span className="hidden md:block text-xl font-heading font-semibold tracking-tight">
                BACKCOUNTRY LIGHT
              </span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/shop" className="transition-colors hover:text-foreground/80">Shop</Link>
            <Link href="/rental" className="transition-colors hover:text-foreground/80">Rental</Link>
            <Link href="/brands" className="transition-colors hover:text-foreground/80">Brands</Link>
            <Link href="/journal" className="transition-colors hover:text-foreground/80">Journal</Link>
            <Link href="/about" className="transition-colors hover:text-foreground/80">About</Link>
          </nav>
          
          <div className="flex items-center gap-0 md:gap-2">
            <SearchDialog />
            <CartSidebar />
            <Suspense fallback={<Button variant="ghost" size="icon" aria-label="Loading"><User className="h-5 w-5 opacity-50" /></Button>}>
              <UserNav />
            </Suspense>
            <Sheet>
              <SheetTrigger render={
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu" />
              }>
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="left" className="w-full max-w-[300px] p-6">
                <SheetHeader className="text-left border-b pb-4 mb-4">
                  <SheetTitle className="font-heading font-black tracking-tight text-xl">
                    BACKCOUNTRY LIGHT
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-6 text-lg font-medium mt-4">
                  <SheetClose render={<Link href="/shop" className="transition-colors hover:text-foreground/80 text-left" />}>
                    Shop
                  </SheetClose>
                  <SheetClose render={<Link href="/rental" className="transition-colors hover:text-foreground/80 text-left" />}>
                    Rental
                  </SheetClose>
                  <SheetClose render={<Link href="/brands" className="transition-colors hover:text-foreground/80 text-left" />}>
                    Brands
                  </SheetClose>
                  <SheetClose render={<Link href="/journal" className="transition-colors hover:text-foreground/80 text-left" />}>
                    Journal
                  </SheetClose>
                  <SheetClose render={<Link href="/about" className="transition-colors hover:text-foreground/80 text-left" />}>
                    About
                  </SheetClose>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
