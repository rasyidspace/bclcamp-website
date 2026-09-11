'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function checkProductAvailability(productId: string, startDate: string, endDate: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase.rpc('get_product_availability', {
    p_product_id: productId,
    p_start_date: startDate,
    p_end_date: endDate
  })

  if (error) {
    console.error('Error checking availability:', error)
    throw new Error('Failed to check availability')
  }

  return data as number
}

interface RentalItemInput {
  product_id: string
  quantity: number
}

interface RentalAccessoryInput {
  accessory_id: string
  quantity: number
}

export async function submitRentalCheckout(
  startDate: string,
  endDate: string,
  items: RentalItemInput[],
  accessories: RentalAccessoryInput[]
) {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    throw new Error('You must be logged in to checkout')
  }

  // Call the RPC function for atomic checkout
  const { data: rentalId, error } = await supabase.rpc('checkout_rental_json', {
    p_user_id: user.id,
    p_start_date: startDate,
    p_end_date: endDate,
    p_items: items,
    p_accessories: accessories
  })

  if (error) {
    console.error('Checkout error:', error)
    // Try to extract a friendly message if it's our custom exception
    throw new Error(error.message || 'Failed to process checkout due to availability or server error')
  }

  revalidatePath('/account/rentals')
  
  return { success: true, rentalId }
}
