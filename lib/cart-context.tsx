'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

// Tipo de un producto en el carrito
export interface CartItem {
  id: string
  name: string
  price: number
  image_url: string
  quantity: number
}

// Tipo del contexto
interface CartContextType {
  items: CartItem[]
  addItem: (product: { id: string; name: string; price: number; image_url: string }) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

// Crear el contexto
const CartContext = createContext<CartContextType | undefined>(undefined)

// Provider que envuelve la aplicación
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const savedCart = typeof window !== 'undefined' ? window.localStorage.getItem('cart') : null
    return savedCart ? JSON.parse(savedCart) : []
  })

  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  // Agregar producto al carrito
  const addItem = (product: { id: string; name: string; price: number; image_url: string }) => {
    setItems((prev) => {
      // Verificar si el producto ya está en el carrito
      const existingItem = prev.find((item) => item.id === product.id)

      if (existingItem) {
        // Si ya existe, aumentar cantidad
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        // Si no existe, agregarlo con cantidad 1
        return [...prev, { ...product, quantity: 1 }]
      }
    })
  }

  // Eliminar producto del carrito
  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  // Actualizar cantidad de un producto
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }

    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    )
  }

  // Vaciar el carrito
  const clearCart = () => {
    setItems([])
  }

  // Calcular total de items
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  // Calcular precio total
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// Hook para usar el carrito en cualquier componente
export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider')
  }
  return context
}