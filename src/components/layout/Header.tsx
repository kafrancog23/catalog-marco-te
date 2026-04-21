import { Link } from '@tanstack/react-router'
import CartButton from '@/components/CartButton'

export default function Header() {
  return (
    <header
      className="sticky top-0 z-30 h-16 border-b border-cream-300"
      style={{ background: 'color-mix(in oklab, var(--color-cream-100) 90%, transparent)', backdropFilter: 'blur(10px)' }}
    >
      <div className="max-w-[1400px] mx-auto px-8 h-full flex items-center justify-between gap-6">
        <Link to="/" className="flex items-baseline gap-2.5 no-underline">
          <span className="font-serif text-2xl text-ink-900 tracking-tight">
            Marco <span className="italic">Té</span>
          </span>
          <span className="font-mono-label text-[10px] text-ink-500">
            est. 2009
          </span>
        </Link>

        <nav className="flex gap-7 font-sans text-[13px] text-ink-500">
          <Link to="/" className="text-ink-900 cursor-pointer">Catálogo</Link>
          <Link to="/origen" className="cursor-pointer hover:text-ink-900 transition-colors">Origen</Link>
          <Link to="/tienda" className="cursor-pointer hover:text-ink-900 transition-colors">Recetas</Link>
          <Link to="/admin/login" className="cursor-pointer hover:text-ink-900 transition-colors">Admin</Link>
        </nav>

        <CartButton />
      </div>
    </header>
  )
}
