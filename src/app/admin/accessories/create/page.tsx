"use client"

import { createAccessory } from "@/app/actions/admin"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CreateAccessoryPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    
    // Validate File Size (Max 2MB)
    const MAX_SIZE = 2 * 1024 * 1024
    const thumbnail = formData.get('thumbnail') as File
    if (thumbnail && thumbnail.size > MAX_SIZE) {
      setError("Image exceeds the 2MB size limit.")
      setLoading(false)
      return
    }

    try {
      const res = await createAccessory(formData)
      if (res && res.error) {
        setError(res.error)
      } else {
        router.push('/admin/accessories')
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">Add Accessory</h1>
        <p className="text-muted-foreground mt-1">Create a new rental accessory.</p>
      </div>

      <div className="rounded-lg border bg-card shadow-sm p-6 max-w-2xl">
        {error && (
          <div className="mb-6 p-4 rounded-md bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium leading-none">Accessory Name</label>
              <input required name="name" type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Price per Day (Rp)</label>
              <input required name="price_per_day" type="number" min="0" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Stock Quantity</label>
              <input required name="stock" type="number" min="0" defaultValue="0" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>

            <div className="space-y-2 col-span-2 p-4 border rounded-md bg-muted/30">
              <h3 className="font-medium text-sm mb-4">Accessory Image</h3>
              <label className="text-sm font-medium leading-none block">Image (Required)</label>
              <input required name="thumbnail" type="file" accept="image/*" className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              <p className="text-xs text-muted-foreground mt-2">Max 2MB.</p>
            </div>

            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium leading-none">Description</label>
              <textarea name="description" rows={4} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"></textarea>
            </div>
          </div>
          
          <div className="pt-4 border-t flex justify-end gap-4">
            <a href="/admin/accessories" className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
              Cancel
            </a>
            <button disabled={loading} type="submit" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Saving..." : "Save Accessory"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
