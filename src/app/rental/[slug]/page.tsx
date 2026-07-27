import { notFound } from "next/navigation";
import { PRODUCTS } from "@/lib/mockData";
import { ProductGallery } from "@/components/shared/ProductGallery";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatRupiah } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RentalBookingForm } from "@/components/shared/RentalBookingForm";

export default async function RentalProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug && (p.type === "rent" || p.type === "both"));

  if (!product) {
    notFound();
  }

  const images = [product.image, product.image, product.image, product.image];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12 md:py-24">
      <div className="text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/rental" className="hover:text-foreground">Rental</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
        <div className="w-full">
          <ProductGallery images={images} />
        </div>

        <div className="flex flex-col pt-4">
          <div className="inline-flex mb-4">
            <span className="bg-muted px-3 py-1 text-xs font-medium tracking-widest uppercase">Rental Service</span>
          </div>
          <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">{product.brand}</p>
          <h1 className="text-3xl md:text-4xl font-heading font-medium tracking-tight mb-4">{product.name}</h1>
          
          <div className="flex items-end gap-3 mb-6">
            <div className="text-3xl font-medium">
              {formatRupiah(product.rentalPrice || 0)}
            </div>
            <div className="text-muted-foreground mb-1">/ day</div>
          </div>
          
          <div className="text-sm text-muted-foreground mb-8 bg-muted/50 p-4 border border-border">
            Deposit required: <span className="font-medium text-foreground">{formatRupiah(product.price * 0.3)}</span> (refundable)
          </div>

          <p className="text-lg text-muted-foreground mb-8">
            {product.description}
          </p>

          <RentalBookingForm product={product} />

          <Accordion className="w-full" defaultValue={["specifications"]}>
            <AccordionItem value="specifications">
              <AccordionTrigger className="font-heading text-lg">Specifications</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b last:border-0 border-border/50">
                      <span className="text-muted-foreground">{key}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="rental-policy">
              <AccordionTrigger className="font-heading text-lg">Rental Policy</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground pt-2">
                  Gear must be returned reasonably clean and dry. Normal wear and tear is expected, but excessive damage may result in forfeiture of deposit. Cancellations up to 72 hours before the start date receive a full refund.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
