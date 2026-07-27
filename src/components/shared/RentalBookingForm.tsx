"use client";

import { useState, useMemo } from "react";
import { Product } from "@/lib/mockData";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";
import Link from "next/link";

interface RentalBookingFormProps {
  product: Product;
}

export function RentalBookingForm({ product }: RentalBookingFormProps) {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const duration = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Set hours to 0 to avoid timezone issues when selecting dates
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    
    const differenceInTime = end.getTime() - start.getTime();
    const diffInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    
    // Minimum 1 day rental if start and end are the same
    if (diffInDays === 0) return 1;
    return diffInDays > 0 ? diffInDays : 0;
  }, [startDate, endDate]);

  const estimatedCost = duration * (product.rentalPrice || 0);

  return (
    <div className="bg-muted/30 p-6 border border-border mb-10 space-y-6">
      <h3 className="font-heading font-medium text-lg">Booking Details</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start-date">Start Date</Label>
          <Input 
            type="date" 
            id="start-date" 
            className="bg-background" 
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              // Reset end date if it's before the new start date
              if (endDate && new Date(e.target.value) > new Date(endDate)) {
                setEndDate("");
              }
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end-date">End Date</Label>
          <Input 
            type="date" 
            id="end-date" 
            className="bg-background"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate || undefined}
          />
        </div>
      </div>
      
      <div className="flex justify-between items-center py-4 border-t border-b border-border">
        <span className="font-medium text-muted-foreground">Total Duration</span>
        <span className="font-medium">{duration} {duration === 1 ? 'Day' : 'Days'}</span>
      </div>
      
      <div className="flex justify-between items-center text-lg font-medium">
        <span>Estimated Cost</span>
        <span>{formatRupiah(estimatedCost)}</span>
      </div>
      
      <Link href="/checkout" className="w-full block mt-4" onClick={(e) => { if(duration <= 0) e.preventDefault(); }}>
        <Button 
          size="lg" 
          className="w-full rounded-none h-14 text-base hover:bg-background hover:text-foreground border border-foreground transition-colors"
          disabled={duration <= 0}
        >
          Book Now
        </Button>
      </Link>
      
      {product.type === "both" && (
        <div className="pt-4 text-center">
          <Link href={`/shop/${product.slug}`} className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">
            Or buy it new for {formatRupiah(product.price)}
          </Link>
        </div>
      )}
    </div>
  );
}
