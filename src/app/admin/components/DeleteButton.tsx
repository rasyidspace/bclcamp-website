"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface DeleteButtonProps {
  id: string;
  onDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
  entityName?: string;
}

export function DeleteButton({ id, onDelete, entityName = "item" }: DeleteButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete this ${entityName}? This action cannot be undone.`)) {
      return
    }

    setLoading(true)
    try {
      const res = await onDelete(id)
      if (res && res.error) {
        alert(`Error deleting: ${res.error}`)
      } else {
        router.refresh()
      }
    } catch (err: any) {
      alert(`Error deleting: ${err.message || "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      className="text-sm font-medium text-destructive hover:underline disabled:opacity-50"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  )
}
