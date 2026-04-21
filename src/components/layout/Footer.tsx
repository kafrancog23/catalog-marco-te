export default function Footer() {
  return (
    <footer className="border-t border-cream-300 py-10 px-8 max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 font-sans text-[13px] text-ink-500">
        <div>
          <div className="font-serif text-[22px] italic text-ink-900">Marco Té</div>
          <div className="mt-2 text-xs">Frutos secos y cereales · 2009</div>
        </div>
        <div>
          <div className="text-ink-900 mb-2.5 font-medium">Ubicación</div>
          <div>Bogotá, Colombia</div>
          <div>Venta por catálogo</div>
        </div>
        <div>
          <div className="text-ink-900 mb-2.5 font-medium">Pedidos</div>
          <div>WhatsApp +57 313 211 6608</div>
          <div>mayuyisgr@hotmail.com</div>
        </div>
        <div className="lg:text-right font-mono-label leading-relaxed">
          © 2025 · MARCO TÉ<br/>
          COMERCIALIZADORA
        </div>
      </div>
    </footer>
  )
}
