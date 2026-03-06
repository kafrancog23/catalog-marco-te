'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'

interface DeleteButtonProps {
  productId: string
  productName: string
}

export default function DeleteButton({ productId, productName }: DeleteButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setDeleting(true)
    
    try {
      const supabase = createClient()
      const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single()

      if (fetchError) throw fetchError

      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

      if (deleteError) throw deleteError

      if (product?.image_url) {
        try {
          const match = product.image_url.match(/\/public\/(.+)/)
          if (match && match[1]) {
            const fullPath = match[1]
            const filePath = fullPath.replace('products-images/', '')
            
            const { data: removeData, error: removeError } = await supabase.storage
              .from('products-images')
              .remove([filePath])

            if (removeError) {
              throw removeError
            }
          }
        } catch (storageError) {
          throw storageError
        }
      }
      router.refresh()
      setShowConfirm(false)
    } catch (err: unknown) {
      alert('Error al eliminar: ' + (err instanceof Error ? err.message : 'Error desconocido'))
      setDeleting(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="px-3 py-1 text-sm text-red-600 hover:text-red-800 font-medium"
      >
        Eliminar
      </button>

      {/* Modal de confirmación */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-2">¿Eliminar producto?</h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que quieres eliminar <span className="font-semibold">&quot;{productName}&quot;</span>? 
              Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
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