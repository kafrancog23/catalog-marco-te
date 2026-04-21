import { cn } from '@/lib/cn'

interface ChipProps {
  active?: boolean
  onClick?: () => void
  children: React.ReactNode
  count?: number
}

export default function Chip({ active, onClick, children, count }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 px-3.5 py-2 rounded-pill',
        'font-sans text-[13px] font-medium whitespace-nowrap',
        'border cursor-pointer transition-all duration-150',
        active
          ? 'bg-ink-900 text-cream-50 border-ink-900'
          : 'bg-transparent text-ink-700 border-cream-300 hover:border-ink-500',
      )}
    >
      <span>{children}</span>
      {count != null && (
        <span className={cn('font-mono text-[11px]', active ? 'opacity-70' : 'opacity-55')}>
          {count}
        </span>
      )}
    </button>
  )
}
