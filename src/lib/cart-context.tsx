import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react'

export interface CartItem {
  id: string
  name: string
  price: number
  image_url: string
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: { id: string; name: string; price: number; image_url: string }) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const isInitializedRef = useRef(false)

  useEffect(() => {
    const savedCart = window.localStorage.getItem('cart')
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart)
        if (Array.isArray(parsed)) {
          const validItems = parsed.filter(
            (item): item is CartItem =>
              typeof item === 'object' &&
              item !== null &&
              typeof item.id === 'string' &&
              typeof item.name === 'string' &&
              typeof item.price === 'number' &&
              typeof item.image_url === 'string' &&
              typeof item.quantity === 'number'
          )
          setItems(validItems)
        }
      } catch (error) {
        console.error('Error al leer el carrito desde localStorage:', error)
      }
    }
    isInitializedRef.current = true
  }, [])

  useEffect(() => {
    if (!isInitializedRef.current) return
    window.localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addItem = (product: { id: string; name: string; price: number; image_url: string }) => {
    setItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id)
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      } else {
        return [...prev, { ...product, quantity: 1 }]
      }
    })
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider')
  }
  return context
}
