# Marco Te - Catálogo Web

Plataforma web de catálogo digital para empresa familiar dedicada a la comercialización de frutos secos y cereales.

## Stack Tecnológico

- **Framework**: Next.js 14+ (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Base de datos**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **Estado**: Zustand (carrito)

## Configuración Inicial

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Copia `.env.example` a `.env.local` y completa las credenciales:

```bash
cp .env.example .env.local
```

### 3. Configurar Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Ejecuta el SQL para crear la tabla `products` (ver sección SQL abajo)
3. Crea el bucket `product-images` en Storage
4. Copia las credenciales a `.env.local`

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## SQL para Supabase

```sql
-- Tabla de productos
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  price INTEGER NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_is_active ON products(is_active);

-- Políticas RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Productos públicos visibles" ON products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins pueden insertar" ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins pueden actualizar" ON products
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins pueden eliminar" ON products
  FOR DELETE USING (auth.role() = 'authenticated');

-- Datos de ejemplo
INSERT INTO products (name, description, category, price, is_active) VALUES
  ('Almendras Enteras Premium', 'Almendras californianas tostadas sin sal', 'Almendras', 18000, true),
  ('Nueces de Castilla', 'Nueces peladas de primera calidad', 'Nueces', 22000, true),
  ('Maní Tostado con Sal', 'Maní crocante ligeramente salado', 'Maní', 8000, true),
  ('Mix Energético', 'Mezcla de almendras, nueces, arándanos y semillas', 'Mix', 25000, true),
  ('Semillas de Girasol', 'Semillas peladas, ricas en vitamina E', 'Semillas', 9000, true),
  ('Avena en Hojuelas', 'Avena integral para desayunos saludables', 'Cereales', 6000, true),
  ('Marañones Tostados', 'Marañones tostados con sal marina', 'Nueces', 28000, true),
  ('Mix Tropical', 'Piña, mango, papaya deshidratados con coco', 'Mix', 15000, true);
```

## Estructura del Proyecto

```
src/
├── app/
│   ├── (public)/         # Rutas públicas (clientes)
│   │   ├── page.tsx      # Home
│   │   ├── catalogo/     # Catálogo de productos
│   │   └── layout.tsx    # Layout con Header/Footer
│   ├── admin/            # Panel administrativo
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Estilos globales
├── components/
│   ├── ui/               # Componentes UI reutilizables
│   ├── public/           # Componentes área pública
│   └── admin/            # Componentes panel admin
├── lib/
│   ├── supabase/         # Clientes Supabase
│   └── utils.ts          # Utilidades
├── hooks/                # Custom hooks (carrito, etc.)
├── types/                # TypeScript types
└── constants/            # Constantes del proyecto
```

## Deploy

El proyecto está preparado para deploy en Vercel:

```bash
npm run build
```

## Licencia

Proyecto privado - Marco Te
