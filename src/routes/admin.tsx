import { createFileRoute, Outlet, redirect, useLocation } from '@tanstack/react-router'
import { supabase } from '@/lib/supabase'
import AdminSidebar from '@/components/layout/AdminSidebar'

export const Route = createFileRoute('/admin')({
  beforeLoad: async ({ location }) => {
    if (location.pathname === '/admin/login') return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw redirect({ to: '/admin/login' })
      }
    } catch (e) {
      if (e instanceof Response || (e && typeof e === 'object' && 'to' in e)) throw e
      throw redirect({ to: '/admin/login' })
    }
  },
  component: AdminLayout,
})

function AdminLayout() {
  const location = useLocation()
  const isLogin = location.pathname === '/admin/login'

  if (isLogin) return <Outlet />

  return (
    <div className="min-h-screen flex bg-cream-100">
      <AdminSidebar />
      <main className="flex-1 p-8 px-10">
        <Outlet />
      </main>
    </div>
  )
}
