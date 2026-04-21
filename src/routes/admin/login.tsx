import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'

export const Route = createFileRoute('/admin/login')({
  component: LoginPage,
})

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate({ to: '/admin' })
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-cream-100 text-ink-900">
      {/* Left editorial panel */}
      <div className="bg-cream-200 border-r border-cream-300 p-12 flex-col justify-between hidden lg:flex">
        <div>
          <div className="font-serif text-[28px] tracking-tight">
            Marco <span className="italic">Té</span>
          </div>
          <div className="font-mono-label text-[10px] text-ink-500 mt-1">
            Panel interno · v2
          </div>
        </div>
        <div>
          <div className="font-serif text-[56px] leading-[0.95] tracking-tight">
            Bienvenido<br />
            <span className="italic text-terracota-dk">de nuevo</span>.
          </div>
          <div className="font-sans text-[15px] text-ink-500 mt-5 max-w-[420px] text-pretty">
            Desde acá gestionas productos, presentaciones y stock. Los cambios aparecen en el catálogo al guardar.
          </div>
        </div>
        <div className="font-mono-label text-ink-500">
          © MARCO TÉ · 2025
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-12">
        <form onSubmit={handleLogin} className="w-full max-w-[360px] flex flex-col gap-5">
          <div>
            <div className="font-mono-label text-ink-500 mb-2">Inicia sesión</div>
            <div className="font-serif text-4xl tracking-tight">Acceso al panel</div>
          </div>

          <Input
            label="Correo"
            type="email"
            icon="user"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com"
            required
          />

          <div className="relative">
            <Input
              label="Contraseña"
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError('') }}
              error={error}
              required
            />
            <button
              type="button"
              onClick={() => setShowPass((s) => !s)}
              className="absolute right-3 top-[34px] bg-transparent border-none text-ink-500 cursor-pointer"
            >
              <Icon name={showPass ? 'eye-off' : 'eye'} size={16} />
            </button>
          </div>

          <Button type="submit" size="lg" className="w-full" iconRight="arrow-r" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar al panel'}
          </Button>

          <Link
            to="/"
            className="bg-transparent border-none font-sans text-[13px] text-ink-500 cursor-pointer underline underline-offset-[3px] mt-2 text-center"
          >
            ← Volver al catálogo
          </Link>
        </form>
      </div>
    </div>
  )
}
