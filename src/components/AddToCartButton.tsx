import { useCart } from '@/lib/cart-context'
import { useState, useRef, useEffect } from 'react'
import Icon from '@/components/ui/Icon'

interface AddToCartButtonProps {
  product: {
    id: string
    name: string
    price: number
    image_url: string
  }
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    addItem(product)
    setAdded(true)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setAdded(false), 2000)
  }

  return (
    <button
      onClick={handleClick}
      aria-label="Agregar al carrito"
      className={`w-[42px] h-[42px] rounded-pill border cursor-pointer inline-flex items-center justify-center transition-all duration-200 ${
        added
          ? 'bg-olive text-cream-50 border-olive'
          : 'bg-transparent text-ink-900 border-ink-900 hover:bg-ink-900 hover:text-cream-50'
      }`}
    >
      <Icon name={added ? 'check' : 'plus'} size={16} />
    </button>
  )
}
