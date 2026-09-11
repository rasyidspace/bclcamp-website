import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/shared/ProductGallery";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

import Link from "next/link";
import { formatRupiah } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default async function ShopProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!product) {
    notFound();
  }

  const imageUrl = product.image?.startsWith('http') ? product.image : '/tent/tc-product-diafort.webp';
  const images = [imageUrl, imageUrl, imageUrl, imageUrl]; // We can update this when we have multiple images

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12 md:py-24">
      {/* Breadcrumb simple */}
      <div className="text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:text-foreground">Shop</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
        {/* Left: Gallery */}
        <div className="w-full">
          <ProductGallery images={images} />
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col pt-4">
          <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">{product.brand}</p>
          <h1 className="text-3xl md:text-4xl font-heading font-medium tracking-tight mb-4">{product.name}</h1>
          
          <div className="text-2xl font-medium mb-6">
            {formatRupiah(product.price)}
          </div>

          <p className="text-lg text-muted-foreground mb-8 whitespace-pre-wrap">
            {product.description}
          </p>

          <div className="space-y-4 mb-10">
            <Link href="/checkout" className="w-full block">
              <Button size="lg" className="w-full rounded-none h-14 text-base">
                Add to Cart
              </Button>
            </Link>
            
            {(product.type === "rent" || product.type === "both") && product.rental_price && (
              <div className="pt-4 border-t text-center">
                <p className="text-sm text-muted-foreground mb-3">Also available for rent</p>
                <Link href={`/rental/${product.slug}`} className="w-full block">
                  <Button size="lg" variant="outline" className="w-full rounded-none h-14 text-base">
                    Rent from {formatRupiah(product.rental_price)} / day
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <Accordion className="w-full" defaultValue={["shipping"]}>
            <AccordionItem value="shipping">
              <AccordionTrigger className="font-heading text-lg">Shipping & Returns</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground pt-2">
                  Free standard shipping on all orders over Rp 500.000. We offer a 30-day return policy for unused gear in its original packaging.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
