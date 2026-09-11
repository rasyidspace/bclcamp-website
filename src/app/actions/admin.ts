'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function verifyAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return false

  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('id', user.id)
    .single()

  return roleData?.role === 'admin'
}

export async function createProduct(formData: FormData) {
  const isAdmin = await verifyAdmin()
  if (!isAdmin) throw new Error('Unauthorized')

  const supabase = await createClient()

  const name = formData.get('name') as string
  const brand = formData.get('brand') as string
  const category = formData.get('category') as string
  const type = formData.get('type') as 'buy' | 'rent' | 'both'
  const price = parseFloat(formData.get('price') as string)
  const rental_price = formData.get('rental_price') ? parseFloat(formData.get('rental_price') as string) : null
  const stock = parseInt(formData.get('stock') as string)
  const description = formData.get('description') as string

  // Auto-generate slug from name
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

  // 1. Handle Thumbnail Upload
  const thumbnailFile = formData.get('thumbnail') as File | null
  let imageUrl = '/images/products/placeholder.jpg'

  if (thumbnailFile && thumbnailFile.size > 0) {
    const fileExt = thumbnailFile.name.split('.').pop()
    const fileName = `${slug}-thumbnail-${crypto.randomUUID()}.${fileExt}`
    
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, thumbnailFile)

    if (uploadError) {
      console.error('Error uploading thumbnail:', uploadError)
      return { success: false, error: 'Failed to upload thumbnail image' }
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName)
      
    imageUrl = publicUrl
  }

  // 2. Handle Additional Images Upload
  const additionalImageFiles = formData.getAll('additional_images') as File[]
  const additionalImageUrls: string[] = []

  for (const file of additionalImageFiles) {
    if (file && file.size > 0) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${slug}-extra-${crypto.randomUUID()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file)

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName)
        additionalImageUrls.push(publicUrl)
      }
    }
  }

  const { error } = await supabase
    .from('products')
    .insert({
      slug,
      name,
      brand,
      category,
      type,
      price,
      rental_price,
      stock,
      image: imageUrl,
      additional_images: additionalImageUrls,
      description
    })

  if (error) {
    console.error('Error creating product:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/products')
  revalidatePath('/shop')
  return { success: true }
}

export async function updateRentalStatus(rentalId: string, newStatus: string) {
  const isAdmin = await verifyAdmin()
  if (!isAdmin) throw new Error('Unauthorized')

  const supabase = await createClient()

  const { error } = await supabase
    .from('rentals')
    .update({ rental_status: newStatus })
    .eq('id', rentalId)

  if (error) {
    console.error('Error updating rental:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/rentals')
  return { success: true }
}

// --- Categories ---
export async function createCategory(formData: FormData) {
  const isAdmin = await verifyAdmin()
  if (!isAdmin) throw new Error('Unauthorized')

  const supabase = await createClient()
  const name = formData.get('name') as string
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
  const description = formData.get('description') as string

  const { error } = await supabase.from('categories').insert({ name, slug, description })
  if (error) return { success: false, error: error.message }
  
  revalidatePath('/admin/categories')
  return { success: true }
}

export async function deleteCategory(id: string) {
  const isAdmin = await verifyAdmin()
  if (!isAdmin) throw new Error('Unauthorized')
  const supabase = await createClient()
  
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  
  revalidatePath('/admin/categories')
  return { success: true }
}

// --- Brands ---
export async function createBrand(formData: FormData) {
  const isAdmin = await verifyAdmin()
  if (!isAdmin) throw new Error('Unauthorized')

  const supabase = await createClient()
  const name = formData.get('name') as string
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

  const { error } = await supabase.from('brands').insert({ name, slug })
  if (error) return { success: false, error: error.message }
  
  revalidatePath('/admin/brands')
  return { success: true }
}

export async function deleteBrand(id: string) {
  const isAdmin = await verifyAdmin()
  if (!isAdmin) throw new Error('Unauthorized')
  const supabase = await createClient()
  
  const { error } = await supabase.from('brands').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  
  revalidatePath('/admin/brands')
  return { success: true }
}

// --- Accessories ---
export async function createAccessory(formData: FormData) {
  const isAdmin = await verifyAdmin()
  if (!isAdmin) throw new Error('Unauthorized')

  const supabase = await createClient()
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price_per_day = parseFloat(formData.get('price_per_day') as string)
  const stock = parseInt(formData.get('stock') as string)

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

  const thumbnailFile = formData.get('thumbnail') as File | null
  let imageUrl = '/images/products/placeholder.jpg'

  if (thumbnailFile && thumbnailFile.size > 0) {
    const fileExt = thumbnailFile.name.split('.').pop()
    const fileName = `${slug}-acc-${crypto.randomUUID()}.${fileExt}`
    
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, thumbnailFile)

    if (uploadError) return { success: false, error: 'Failed to upload image' }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName)
      
    imageUrl = publicUrl
  }

  const { error } = await supabase.from('accessories').insert({
    name, description, price_per_day, stock, image: imageUrl
  })
  
  if (error) return { success: false, error: error.message }
  
  revalidatePath('/admin/accessories')
  return { success: true }
}

export async function deleteAccessory(id: string) {
  const isAdmin = await verifyAdmin()
  if (!isAdmin) throw new Error('Unauthorized')
  const supabase = await createClient()
  
  const { error } = await supabase.from('accessories').update({ status: 'archived' }).eq('id', id)
  if (error) return { success: false, error: error.message }
  
  revalidatePath('/admin/accessories')
  return { success: true }
}

export async function updateAccessory(id: string, formData: FormData) {
  const isAdmin = await verifyAdmin()
  if (!isAdmin) throw new Error('Unauthorized')

  const supabase = await createClient()
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price_per_day = parseFloat(formData.get('price_per_day') as string)
  const stock = parseInt(formData.get('stock') as string)

  const thumbnailFile = formData.get('thumbnail') as File | null
  
  const updates: any = { name, description, price_per_day, stock }

  if (thumbnailFile && thumbnailFile.size > 0) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    const fileExt = thumbnailFile.name.split('.').pop()
    const fileName = `${slug}-acc-${crypto.randomUUID()}.${fileExt}`
    
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, thumbnailFile)

    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName)
      updates.image = publicUrl
    }
  }

  const { error } = await supabase.from('accessories').update(updates).eq('id', id)
  if (error) return { success: false, error: error.message }
  
  revalidatePath('/admin/accessories')
  return { success: true }
}

export async function updateCategory(id: string, formData: FormData) {
  const isAdmin = await verifyAdmin()
  if (!isAdmin) throw new Error('Unauthorized')
  const supabase = await createClient()
  
  const name = formData.get('name') as string
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
  const description = formData.get('description') as string

  const { error } = await supabase.from('categories').update({ name, slug, description }).eq('id', id)
  if (error) return { success: false, error: error.message }
  
  revalidatePath('/admin/categories')
  return { success: true }
}

export async function updateBrand(id: string, formData: FormData) {
  const isAdmin = await verifyAdmin()
  if (!isAdmin) throw new Error('Unauthorized')
  const supabase = await createClient()
  
  const name = formData.get('name') as string
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

  const { error } = await supabase.from('brands').update({ name, slug }).eq('id', id)
  if (error) return { success: false, error: error.message }
  
  revalidatePath('/admin/brands')
  return { success: true }
}

export async function updateProduct(id: string, formData: FormData) {
  const isAdmin = await verifyAdmin()
  if (!isAdmin) throw new Error('Unauthorized')
  const supabase = await createClient()
  
  const name = formData.get('name') as string
  const brand = formData.get('brand') as string
  const category = formData.get('category') as string
  const type = formData.get('type') as 'buy' | 'rent' | 'both'
  const price = parseFloat(formData.get('price') as string)
  const rental_price = formData.get('rental_price') ? parseFloat(formData.get('rental_price') as string) : null
  const stock = parseInt(formData.get('stock') as string)
  const description = formData.get('description') as string

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
  const updates: any = { name, slug, brand, category, type, price, rental_price, stock, description }

  const thumbnailFile = formData.get('thumbnail') as File | null
  if (thumbnailFile && thumbnailFile.size > 0) {
    const fileExt = thumbnailFile.name.split('.').pop()
    const fileName = `${slug}-thumbnail-${crypto.randomUUID()}.${fileExt}`
    const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, thumbnailFile)
    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName)
      updates.image = publicUrl
    }
  }

  const { error } = await supabase.from('products').update(updates).eq('id', id)
  if (error) return { success: false, error: error.message }
  
  revalidatePath('/admin/products')
  return { success: true }
}

export async function deleteProduct(id: string) {
  const isAdmin = await verifyAdmin()
  if (!isAdmin) throw new Error('Unauthorized')
  const supabase = await createClient()
  
  const { error } = await supabase.from('products').update({ status: 'archived' }).eq('id', id)
  if (error) return { success: false, error: error.message }
  
  revalidatePath('/admin/products')
  return { success: true }
}
