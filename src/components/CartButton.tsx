import { useCart } from '@/lib/cart-context'
import { useState } from 'react'
import CartDrawer from '@/components/CartDrawer'
import Icon from '@/components/ui/Icon'

export default function CartButton() {
  const { totalItems } = useCart()
  const [showDrawer, setShowDrawer] = useState(false)

  return (
    <>
      <button
        onClick={() => setShowDrawer(true)}
        className="relative px-4 py-2 rounded-pill border border-ink-900 bg-ink-900 text-cream-50 font-sans text-[13px] font-medium cursor-pointer inline-flex items-center gap-2 transition-all hover:opacity-90"
        aria-label={`Carrito de compras, ${totalItems} items`}
      >
        <Icon name="bag" size={15} />
        Carrito
        <span
          className="font-mono text-[11px] px-1.5 py-px rounded-pill min-w-[18px] text-center text-ink-900"
          style={{ background: totalItems ? 'var(--color-mustard)' : 'transparent' }}
        >
          {totalItems}
        </span>
      </button>

      {showDrawer && <CartDrawer onClose={() => setShowDrawer(false)} />}
    </>
  )
}
