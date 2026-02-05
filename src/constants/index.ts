// WhatsApp business number (format: country code + number, no spaces or symbols)
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '57XXXXXXXXXX';

// Company information
export const COMPANY = {
  name: 'Marco Te',
  tagline: 'Frutos Secos y Cereales de Calidad',
  description: 'Empresa familiar dedicada a la comercialización de frutos secos y cereales de la mejor calidad.',
};

// Currency formatting for Colombian Pesos
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};
