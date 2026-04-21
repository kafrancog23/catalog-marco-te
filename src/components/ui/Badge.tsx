import { cn } from '@/lib/cn'

interface BadgeProps {
  children: React.ReactNode
  tone?: 'active' | 'inactive' | 'mustard' | 'olive' | 'terracota' | 'neutral'
  className?: string
}

const toneClasses = {
  active: 'bg-olive/25 text-olive-dk',
  inactive: 'bg-cream-200 text-ink-500',
  mustard: 'bg-mustard/35 text-ink-900',
  olive: 'bg-olive/20 text-olive-dk',
  terracota: 'bg-terracota/20 text-terracota-dk',
  neutral: 'bg-cream-200 text-ink-700',
}

export default function Badge({ children, tone = 'neutral', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-pill',
        'font-sans text-[11px] font-medium uppercase tracking-wide',
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
