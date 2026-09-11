"use client";

import { useState, useMemo, useEffect } from "react";
// Temporarily using any for Product until fully migrating DB types, but assuming it matches DB
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";
import Link from "next/link";
import { checkProductAvailability } from "@/app/actions/rental";
import { Loader2 } from "lucide-react";

interface RentalBookingFormProps {
  product: any;
}

export function RentalBookingForm({ product }: RentalBookingFormProps) {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [availability, setAvailability] = useState<number | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const duration = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    
    const differenceInTime = end.getTime() - start.getTime();
    const diffInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    
    return diffInDays > 0 ? diffInDays : 0;
  }, [startDate, endDate]);

  useEffect(() => {
    async function checkAvail() {
      if (startDate && endDate && duration > 0) {
        setIsChecking(true);
        try {
          const avail = await checkProductAvailability(product.id, startDate, endDate);
          setAvailability(avail);
        } catch (e) {
          console.error(e);
          setAvailability(0);
        } finally {
          setIsChecking(false);
        }
      } else {
        setAvailability(null);
      }
    }
    
    // Simple debounce to prevent excessive calls
    const timeout = setTimeout(() => {
      checkAvail();
    }, 300);
    
    return () => clearTimeout(timeout);
  }, [startDate, endDate, duration, product.id]);

  const estimatedCost = duration * (product.rentalPrice || 0);
  const canBook = duration > 0 && availability !== null && availability > 0;

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
              if (endDate && new Date(e.target.value) >= new Date(endDate)) {
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
            min={startDate ? new Date(new Date(startDate).getTime() + 86400000).toISOString().split('T')[0] : undefined}
          />
        </div>
      </div>
      
      <div className="flex justify-between items-center py-4 border-t border-b border-border">
        <span className="font-medium text-muted-foreground">Total Duration</span>
        <span className="font-medium">{duration} {duration === 1 ? 'Day' : 'Days'}</span>
      </div>

      {availability !== null && duration > 0 && (
        <div className="flex justify-between items-center pb-4 border-b border-border">
          <span className="font-medium text-muted-foreground">Availability</span>
          <span className={`font-medium ${availability > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {isChecking ? <Loader2 className="w-4 h-4 animate-spin" /> : availability > 0 ? `${availability} Available` : 'Fully Booked'}
          </span>
        </div>
      )}
      
      <div className="flex justify-between items-center text-lg font-medium">
        <span>Estimated Cost</span>
        <span>{formatRupiah(estimatedCost)}</span>
      </div>
      
      <Link href="/checkout" className="w-full block mt-4" onClick={(e) => { if(!canBook) e.preventDefault(); }}>
        <Button 
          size="lg" 
          className="w-full rounded-none h-14 text-base hover:bg-background hover:text-foreground border border-foreground transition-colors disabled:opacity-50"
          disabled={!canBook || isChecking}
        >
          {isChecking ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : canBook ? 'Book Now' : 'Not Available'}
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
