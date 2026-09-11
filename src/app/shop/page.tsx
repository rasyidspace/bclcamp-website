import { ProductFilters } from "@/components/shared/ProductFilters";
import { ProductCard } from "@/components/shared/ProductCard";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Shop Gear | Backcountry Light",
  description: "Shop our premium collection of ultralight outdoor gear.",
};

export default async function ShopPage() {
  const supabase = await createClient();
  const { data: shopProducts } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .in('type', ['buy', 'both'])
    .order('created_at', { ascending: false });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12 md:py-24">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-heading font-medium tracking-tight mb-4">Shop Gear</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Carefully curated ultralight equipment for your next adventure.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <ProductFilters />
        
        <div className="flex-1">
          <div className="hidden lg:flex items-center justify-between mb-8 pb-4 border-b">
            <span className="text-sm text-muted-foreground">{shopProducts?.length || 0} Results</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <select className="text-sm border-none bg-transparent outline-none font-medium text-foreground cursor-pointer">
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12">
            {shopProducts?.map((product: any) => (
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
          
          <div className="mt-16 text-center">
            <Button variant="outline" size="lg" className="px-12 rounded-none">
              Load More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
