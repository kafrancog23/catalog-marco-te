import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { extractStoragePath, STORAGE_BUCKET } from '@/lib/storage-utils'
import { useQueryClient } from '@tanstack/react-query'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'

interface DeleteButtonProps {
  productId: string
  productName: string
}

export default function DeleteButton({ productId, productName }: DeleteButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const queryClient = useQueryClient()
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!showConfirm) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setShowConfirm(false); setError('') }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showConfirm])

  const handleDelete = async () => {
    setDeleting(true)
    setError('')

    try {
      const { data: deleted, error: deleteError } = await supabase
        .from('products').delete().eq('id', productId).select('image_url').single()
      if (deleteError) throw deleteError

      const storagePath = deleted?.image_url ? extractStoragePath(deleted.image_url) : null
      if (storagePath) {
        await supabase.storage.from(STORAGE_BUCKET).remove([storagePath]).catch(() => {})
      }

      queryClient.invalidateQueries({ queryKey: ['products'] })
      setShowConfirm(false)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al eliminar')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <button
        onClick={() => { setShowConfirm(true); setError('') }}
        className="p-1.5 text-ink-500 hover:text-terracota-dk transition-colors bg-transparent border-none cursor-pointer"
      >
        <Icon name="trash" size={15} />
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/35 flex items-center justify-center z-50 animate-fade-in"
          role="dialog" aria-modal="true">
          <div ref={modalRef} className="bg-cream-50 rounded-card p-6 max-w-md w-full mx-4 border border-cream-300">
            <h3 className="font-serif text-xl mb-2">¿Eliminar producto?</h3>
            <p className="text-ink-500 font-sans text-sm mb-6">
              ¿Estás seguro de que quieres eliminar <span className="font-semibold text-ink-900">&quot;{productName}&quot;</span>?
              Esta acción no se puede deshacer.
            </p>
            {error && (
              <div role="alert" className="bg-terracota/10 text-terracota-dk p-3 rounded-lg text-sm mb-4">
                {error}
              </div>
            )}
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => { setShowConfirm(false); setError('') }}
                disabled={deleting}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1"
                style={{ background: 'var(--color-terracota)', color: 'var(--color-cream-50)', borderColor: 'var(--color-terracota)' }}
              >
                {deleting ? 'Eliminando...' : 'Eliminar'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
