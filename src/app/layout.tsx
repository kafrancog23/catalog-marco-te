import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Marco Te - Frutos Secos y Cereales',
    template: '%s | Marco Te',
  },
  description:
    'Empresa familiar dedicada a la comercialización de frutos secos y cereales de la mejor calidad. Almendras, nueces, maní, semillas y más.',
  keywords: [
    'frutos secos',
    'cereales',
    'almendras',
    'nueces',
    'maní',
    'semillas',
    'Colombia',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
