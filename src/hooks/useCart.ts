import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '@/types';
import { WHATSAPP_NUMBER, formatPrice } from '@/constants';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  generateWhatsAppMessage: () => string;
  openWhatsApp: () => void;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { product, quantity: 1 }],
          };
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },

      generateWhatsAppMessage: () => {
        const items = get().items;
        const total = get().getTotal();

        if (items.length === 0) return '';

        let message = '¡Hola! Me gustaría hacer el siguiente pedido:\n\n';

        items.forEach((item) => {
          message += `• ${item.product.name} x${item.quantity} - ${formatPrice(
            item.product.price * item.quantity
          )}\n`;
        });

        message += `\n*Total: ${formatPrice(total)}*`;
        message += '\n\n¡Gracias!';

        return encodeURIComponent(message);
      },

      openWhatsApp: () => {
        const message = get().generateWhatsAppMessage();
        if (!message) return;

        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
        window.open(url, '_blank');
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
