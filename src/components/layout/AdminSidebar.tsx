import { Link, useLocation } from '@tanstack/react-router'
import Icon from '@/components/ui/Icon'
import { supabase } from '@/lib/supabase'

const navItems = [
  { path: '/admin', label: 'Productos', icon: 'package' },
  { path: '/admin/recipes', label: 'Recetas', icon: 'sparkle' },
]

export default function AdminSidebar() {
  const location = useLocation()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/admin/login'
  }

  return (
    <aside className="w-60 border-r border-cream-300 p-6 flex flex-col gap-1 bg-cream-200 min-h-screen">
      <div className="px-2.5 pb-5">
        <div className="font-serif text-[22px] text-ink-900">
          Marco <span className="italic">Té</span>
        </div>
        <div className="font-mono-label text-[10px] text-ink-500 mt-1">Admin</div>
      </div>

      {navItems.map((item) => {
        const isActive = location.pathname === item.path
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-sans cursor-pointer transition-colors ${
              isActive
                ? 'bg-cream-100 text-ink-900 font-medium'
                : 'text-ink-500 hover:text-ink-900'
            }`}
          >
            <Icon name={item.icon} size={16} />
            {item.label}
          </Link>
        )
      })}

      <div className="flex-1" />

      <Link
        to="/"
        className="flex items-center gap-2.5 px-3 py-2.5 text-ink-500 font-sans text-[13px] hover:text-ink-900 transition-colors"
      >
        <Icon name="arrow-ur" size={14} /> Ver catálogo
      </Link>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2.5 px-3 py-2.5 text-ink-500 font-sans text-[13px] hover:text-ink-900 transition-colors bg-transparent border-none cursor-pointer text-left"
      >
        <Icon name="logout" size={14} /> Cerrar sesión
      </button>
    </aside>
  )
}
