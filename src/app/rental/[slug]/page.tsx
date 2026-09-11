import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/shared/ProductGallery";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

import Link from "next/link";
import { formatRupiah } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import { RentalBookingForm } from "@/components/shared/RentalBookingForm";

export default async function RentalProductPage({ params }: { params: Promise<{ slug: string }> }) {
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
        <Link href="/rental" className="hover:text-foreground">Rental</Link>
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
          <div className="inline-flex mb-4">
            <span className="bg-muted px-3 py-1 text-xs font-medium tracking-widest uppercase">Rental Service</span>
          </div>
          <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">{product.brand}</p>
          <h1 className="text-3xl md:text-4xl font-heading font-medium tracking-tight mb-4">{product.name}</h1>
          
          <div className="text-2xl font-medium mb-6">
            {formatRupiah(product.rental_price || 0)} <span className="text-base text-muted-foreground font-normal">/ day</span>
          </div>

          <p className="text-lg text-muted-foreground mb-8 whitespace-pre-wrap">
            {product.description}
          </p>

          <div className="space-y-4 mb-10">
          <RentalBookingForm product={{...product, rentalPrice: product.rental_price}} />
            
            {(product.type === "buy" || product.type === "both") && product.price && (
              <div className="pt-4 border-t text-center">
                <p className="text-sm text-muted-foreground mb-3">Fall in love with it? Buy your own.</p>
                <Link href={`/shop/${product.slug}`} className="w-full block">
                  <Button size="lg" variant="outline" className="w-full rounded-none h-14 text-base">
                    Buy for {formatRupiah(product.price)}
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <Accordion className="w-full" defaultValue={["terms"]}>
            <AccordionItem value="terms">
              <AccordionTrigger className="font-heading text-lg">Rental Terms</AccordionTrigger>
              <AccordionContent>
                <ul className="text-muted-foreground pt-2 space-y-2 list-disc pl-4">
                  <li>Minimum rental period is 2 days.</li>
                  <li>Gear must be returned clean and dry.</li>
                  <li>A deposit of {formatRupiah((product.price || 0) * 0.3)} is required.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
