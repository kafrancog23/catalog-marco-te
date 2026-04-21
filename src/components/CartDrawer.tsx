import { useCart } from '@/lib/cart-context'
import { useEffect, useState } from 'react'
import Icon from '@/components/ui/Icon'
import Button from '@/components/ui/Button'
import QtySteppper from '@/components/ui/QtySteppper'

interface CartDrawerProps {
  onClose: () => void
}

const fmt$ = (n: number) => '$' + n.toLocaleString('es-CO')
const FREE_SHIP = 80000

export default function CartDrawer({ onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart()
  const [error, setError] = useState<string | null>(null)

  const totalItems = items.reduce((s, i) => s + i.quantity, 0)
  const progress = Math.min(100, (totalPrice / FREE_SHIP) * 100)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = prev
    }
  }, [onClose])

  const handleWhatsAppOrder = () => {
    if (items.length === 0) return
    const phoneNumber = import.meta.env.VITE_WHATSAPP_PHONE
    if (!phoneNumber) {
      setError('No se pudo iniciar el pedido por WhatsApp porque el número de contacto no está configurado.')
      return
    }
    let message = 'Hola, quiero hacer un pedido:\n\n'
    items.forEach((item) => {
      message += `• ${item.quantity}x ${item.name} (${fmt$(item.price * item.quantity)})\n`
    })
    message += `\n*Total: ${fmt$(totalPrice)}*`
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/35 z-[60] animate-fade-in"
      />

      {/* Drawer */}
      <aside className="fixed right-0 top-0 w-full max-w-[480px] h-screen bg-cream-100 text-ink-900 z-[61] flex flex-col border-l border-cream-300 animate-slide-in-right">
        {/* Header */}
        <div className="p-6 px-7 border-b border-cream-300 flex justify-between items-center">
          <div>
            <div className="font-serif text-[28px] tracking-tight">Tu cesta</div>
            <div className="font-mono-label text-ink-500 mt-0.5">
              {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
            </div>
          </div>
          <button onClick={onClose} className="bg-transparent border-none cursor-pointer text-ink-900" aria-label="Cerrar">
            <Icon name="x" size={20} />
          </button>
        </div>

        {/* Free shipping progress */}
        {items.length > 0 && (
          <div className="px-7 py-4 bg-cream-200 border-b border-cream-300">
            <div className="font-sans text-[13px] text-ink-900 mb-2">
              {totalPrice >= FREE_SHIP ? (
                <span>¡Ya tienes <b>envío gratis</b>!</span>
              ) : (
                <span>Te faltan <b>{fmt$(FREE_SHIP - totalPrice)}</b> para envío gratis</span>
              )}
            </div>
            <div className="h-1 bg-cream-300 rounded-pill overflow-hidden">
              <div className="h-full bg-olive rounded-pill transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-auto px-7 py-5 min-h-0">
          {items.length === 0 ? (
            <div className="py-20 text-center">
              <div className="font-serif text-[28px] italic mb-2.5">Tu cesta está en blanco.</div>
              <div className="font-sans text-sm text-ink-500 mb-6">Explora el catálogo y empieza a llenar.</div>
              <Button variant="secondary" onClick={onClose}>Seguir viendo</Button>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-[72px_1fr_auto] gap-3.5 items-start">
                  <div className="w-[72px] h-[72px] rounded-md overflow-hidden bg-cream-200">
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-serif text-[17px] leading-tight">{item.name}</div>
                    <div className="font-mono-label text-ink-500 mt-1">
                      {fmt$(item.price)} c/u
                    </div>
                    <div className="flex items-center gap-3 mt-2.5">
                      <QtySteppper value={item.quantity} onChange={(q) => updateQuantity(item.id, q)} min={0} />
                      <button
                        onClick={() => removeItem(item.id)}
                        className="bg-transparent border-none cursor-pointer text-ink-500 font-sans text-xs underline underline-offset-[3px]"
                      >
                        quitar
                      </button>
                    </div>
                  </div>
                  <div className="font-serif text-[17px] text-ink-900 whitespace-nowrap">
                    {fmt$(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mx-7 bg-terracota/10 border border-terracota/30 text-terracota-dk rounded-lg p-3 flex items-start gap-2">
            <span className="flex-1 text-sm">{error}</span>
            <button onClick={() => setError(null)} className="text-terracota hover:text-terracota-dk font-bold text-lg leading-none bg-transparent border-none cursor-pointer" aria-label="Cerrar error">✕</button>
          </div>
        )}

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-7 py-5 border-t border-cream-300 bg-cream-50">
            <div className="flex justify-between items-baseline mb-1 font-sans text-[13px] text-ink-500">
              <span>Subtotal</span>
              <span>{fmt$(totalPrice)}</span>
            </div>
            <div className="flex justify-between items-baseline mb-4 font-sans text-[13px] text-ink-500">
              <span>Envío</span>
              <span>{totalPrice >= FREE_SHIP ? 'Gratis' : 'Calculado al pedir'}</span>
            </div>
            <div className="flex justify-between items-baseline mb-4 pt-3 border-t border-cream-300">
              <span className="font-sans text-sm">Total</span>
              <span className="font-serif text-[28px] tracking-tight">{fmt$(totalPrice)}</span>
            </div>
            <Button variant="whatsapp" size="lg" icon="wa" className="w-full" onClick={handleWhatsAppOrder}>
              Pedir por WhatsApp
            </Button>
            <div className="flex justify-between mt-2.5">
              <button onClick={clearCart} className="bg-transparent border-none cursor-pointer text-ink-500 font-sans text-xs underline underline-offset-[3px]">
                Vaciar cesta
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
