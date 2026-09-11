"use client"

import { createBrand } from "@/app/actions/admin"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CreateBrandPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      const res = await createBrand(formData)
      if (res && res.error) {
        setError(res.error)
      } else {
        router.push('/admin/brands')
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
        <h1 className="text-3xl font-heading font-bold">Add Brand</h1>
        <p className="text-muted-foreground mt-1">Create a new product brand.</p>
      </div>

      <div className="rounded-lg border bg-card shadow-sm p-6 max-w-xl">
        {error && (
          <div className="mb-6 p-4 rounded-md bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Brand Name</label>
            <input required name="name" type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          </div>
          
          <div className="pt-4 flex justify-end gap-4">
            <a href="/admin/brands" className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
              Cancel
            </a>
            <button disabled={loading} type="submit" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Saving..." : "Save Brand"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
