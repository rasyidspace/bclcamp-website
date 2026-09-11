import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/shared/ProductCard";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .limit(4);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero */}
      <section className="relative min-h-[90svh] w-full bg-muted flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <Image
          src="/tent/tc-hero-lifestyle.webp"
          alt="Backcountry Light Hero"
          fill
          priority
          className="object-cover object-center z-0"
        />
        
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-medium tracking-tight text-white balance-text drop-shadow-md">
            Lightweight gear for heavier adventures.
          </h1>
          <p className="mt-8 md:mt-6 text-lg md:text-xl text-white/90 max-w-2xl balance-text drop-shadow">
            Premium outdoor retail and rental equipment specializing in ultralight backpacking, hiking, and camping.
          </p>
          <div className="mt-12 md:mt-10 flex flex-col sm:flex-row gap-6 md:gap-4 items-center justify-center">
            <Button size="lg" className="rounded-none px-8 font-medium bg-white text-black hover:bg-white/90" render={<Link href="/shop" />}>
              Shop Gear
            </Button>
            <Button size="lg" variant="outline" className="rounded-none px-8 font-medium text-white border-white hover:bg-white hover:text-black bg-black/20 backdrop-blur-sm" render={<Link href="/rental" />}>
              Rent Gear
            </Button>
          </div>
          <div className="mt-20 md:mt-16 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:gap-8 text-xs md:text-sm font-medium text-white/80 uppercase tracking-widest drop-shadow-sm">
            <span>Premium Quality</span>
            <span className="hidden md:inline">•</span>
            <span>Expert Curated</span>
            <span className="hidden md:inline">•</span>
            <span>Ultralight</span>
          </div>
        </div>
      </section>

      {/* 2. Featured Categories */}
      <section className="py-24 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-3xl font-heading font-medium">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {[
            { name: "Backpack", image: "/tent/tc-product-ognis-dome.webp" },
            { name: "Shelter", image: "/tent/tc-product-diafort.webp" },
            { name: "Sleeping", image: "/tent/tc-product-tenbi.webp" },
            { name: "Cooking", image: "/tent/tc-product-wingfort.webp" },
            { name: "Accessories", image: "/tent/tc-philosophy-diafort.webp" }
          ].map((cat) => (
            <Link key={cat.name} href={`/shop?category=${cat.name.toLowerCase()}`} className="group block">
              <div className="aspect-square bg-muted relative overflow-hidden mb-4">
                <Image src={cat.image} alt={cat.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <h3 className="font-heading font-medium text-center group-hover:underline underline-offset-4">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Products */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-heading font-medium">Featured Gear</h2>
            <Link href="/shop" className="text-sm font-medium hover:underline underline-offset-4 hidden sm:block">
              View All Products
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12">
            {featuredProducts?.map((product: any) => (
              <ProductCard 
                key={product.id}
                id={product.id}
                name={product.name}
                brand={product.brand}
                price={product.price}
                rentalPrice={product.rental_price}
                image={product.image?.startsWith('http') ? product.image : '/tent/tc-product-diafort.webp'}
                type={product.type}
                href={`/shop/${product.slug}`}
              />
            ))}
          </div>
          <div className="mt-12 text-center sm:hidden">
            <Button variant="outline" className="rounded-none w-full" render={<Link href="/shop" />}>
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* 4. Rental Highlight */}
      <section className="py-24 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/3] bg-muted overflow-hidden">
            <Image src="/tent/tc-collection-shelters.jpg" alt="Rental Service" fill className="object-cover" />
          </div>
          <div className="flex flex-col items-start max-w-lg">
            <span className="text-sm font-bold tracking-widest uppercase text-muted-foreground mb-4">Rental Service</span>
            <h2 className="text-4xl font-heading font-medium leading-tight mb-6">
              Experience the best gear without the commitment.
            </h2>
            <p className="text-muted-foreground mb-10 text-lg">
              We offer a curated selection of premium ultralight equipment for your next adventure. Rent individual items or complete packages tailored to your trip.
            </p>
            <div className="grid grid-cols-2 gap-8 w-full mb-10">
              <div>
                <h4 className="font-heading font-medium text-xl mb-2">Packages</h4>
                <p className="text-sm text-muted-foreground">Complete setups for weekend warriors to thru-hikers.</p>
              </div>
              <div>
                <h4 className="font-heading font-medium text-xl mb-2">A La Carte</h4>
                <p className="text-sm text-muted-foreground">Fill in the gaps in your own kit with individual rentals.</p>
              </div>
            </div>
            <Button size="lg" className="rounded-none" render={<Link href="/rental" />}>
              Explore Rental
            </Button>
          </div>
        </div>
      </section>

      {/* 5. Featured Brands */}
      <section className="py-24 bg-foreground text-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
          <h2 className="text-xl font-medium tracking-widest uppercase mb-16 opacity-80">Premium Partners</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8 items-center justify-items-center opacity-70">
            {[
              { name: "SOTO", filename: "soto-logo.png", className: "scale-90" },
              { name: "GSI Outdoors", filename: "gsi-outdoors.webp", className: "scale-100" },
              { name: "Gear Aid", filename: "gear-aid.webp", className: "scale-110" },
              { name: "Heroclip", filename: "heroclip.webp", className: "scale-75" },
              { name: "Hyperlite Mountain Gear", filename: "hyperlite.png", className: "scale-125" },
              { name: "Grand Trunk", filename: "grand-trunk-logo.webp", className: "scale-100" },
              { name: "Big Agnes", filename: "big-agnes.webp", className: "scale-110" },
              { name: "Vipole", filename: "vipole.png", className: "scale-100" }
            ].map((brand) => (
              <BrandLogo key={brand.filename} name={brand.name} filename={brand.filename} className={brand.className} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Why Choose Us */}
      <section className="py-24 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          <div>
            <div className="w-12 h-12 border border-foreground flex items-center justify-center mb-6 mx-auto md:mx-0">
              <span className="font-heading font-bold text-xl">01</span>
            </div>
            <h3 className="font-heading font-medium text-xl mb-4">Premium Brands</h3>
            <p className="text-muted-foreground">We carefully curate our inventory to include only the highest quality, proven equipment from industry-leading manufacturers.</p>
          </div>
          <div>
             <div className="w-12 h-12 border border-foreground flex items-center justify-center mb-6 mx-auto md:mx-0">
              <span className="font-heading font-bold text-xl">02</span>
            </div>
            <h3 className="font-heading font-medium text-xl mb-4">Rental Service</h3>
            <p className="text-muted-foreground">Try before you buy, or just rent for that one special trip. Our flexible rental system makes premium gear accessible.</p>
          </div>
          <div>
             <div className="w-12 h-12 border border-foreground flex items-center justify-center mb-6 mx-auto md:mx-0">
              <span className="font-heading font-bold text-xl">03</span>
            </div>
            <h3 className="font-heading font-medium text-xl mb-4">Outdoor Expertise</h3>
            <p className="text-muted-foreground">Founded by experienced thru-hikers and guides, we offer authentic advice to help you select exactly what you need.</p>
          </div>
        </div>
      </section>

      {/* 7. Newsletter */}
      <section className="py-24 bg-muted/50 border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl text-center">
          <h2 className="text-3xl font-heading font-medium mb-4">Join the Dispatch</h2>
          <p className="text-muted-foreground mb-8">Sign up for gear reviews, trip reports, and exclusive offers. We respect your inbox.</p>
          <form className="flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              placeholder="Email address" 
              className="flex-1 bg-background border border-border px-4 py-3 outline-none focus:border-foreground transition-colors"
              required
            />
            <Button size="lg" type="submit" className="rounded-none">Subscribe</Button>
          </form>
        </div>
      </section>
    </div>
  );
}
