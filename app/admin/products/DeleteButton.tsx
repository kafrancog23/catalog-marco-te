'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase-client'
import { extractStoragePath, STORAGE_BUCKET } from '@/lib/storage-utils'
import { useRouter } from 'next/navigation'

interface DeleteButtonProps {
  productId: string
  productName: string
}

export default function DeleteButton({ productId, productName }: DeleteButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!showConfirm) {
      triggerRef.current?.focus()
      return
    }

    cancelRef.current?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setShowConfirm(false); setError(''); return }

      if (e.key === 'Tab' && modalRef.current) {
        const focusableSelectors = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        const focusableElements = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(focusableSelectors)
        )
        if (focusableElements.length === 0) return
        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement?.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement?.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showConfirm])

  const handleDelete = async () => {
    setDeleting(true)
    setError('')

    try {
      const supabase = createClient()
      const { data: deleted, error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)
        .select('image_url')
        .single()

      if (deleteError) throw deleteError

      const storagePath = deleted?.image_url
        ? extractStoragePath(deleted.image_url)
        : null

      if (storagePath) {
        const { error: removeError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .remove([storagePath])

        if (removeError) {
          console.warn('No se pudo eliminar la imagen del storage:', removeError)
        }
      }

      router.refresh()
      setShowConfirm(false)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error desconocido al eliminar')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        onClick={() => { setShowConfirm(true); setError('') }}
        className="px-3 py-1 text-sm text-red-600 hover:text-red-800 font-medium"
      >
        Eliminar
      </button>

      {showConfirm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`delete-title-${productId}`}
          aria-describedby={`delete-desc-${productId}`}
        >
          <div ref={modalRef} className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 id={`delete-title-${productId}`} className="text-lg font-bold mb-2">
              ¿Eliminar producto?
            </h3>
            <p id={`delete-desc-${productId}`} className="text-gray-600 mb-6">
              ¿Estás seguro de que quieres eliminar <span className="font-semibold">&quot;{productName}&quot;</span>?
              Esta acción no se puede deshacer.
            </p>
            {error && (
              <div role="alert" className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
                {error}
              </div>
            )}
            <div className="flex gap-3">
              <button
                ref={cancelRef}
                onClick={() => { setShowConfirm(false); setError('') }}
                disabled={deleting}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-400"
              >
                {deleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}