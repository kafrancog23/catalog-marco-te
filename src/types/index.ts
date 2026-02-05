export interface Product {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type ProductCategory =
  | 'Almendras'
  | 'Nueces'
  | 'Maní'
  | 'Semillas'
  | 'Cereales'
  | 'Mix'
  | 'Otros';

export const CATEGORIES: ProductCategory[] = [
  'Almendras',
  'Nueces',
  'Maní',
  'Semillas',
  'Cereales',
  'Mix',
  'Otros',
];
