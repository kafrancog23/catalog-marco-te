import { cn } from '@/lib/cn'
import Icon from './Icon'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
  icon?: string
}

export default function Input({ label, hint, error, icon, className, ...props }: InputProps) {
  return (
    <label className="flex flex-col gap-1.5">
      {label && (
        <span className="font-mono-label text-ink-700 font-medium">
          {label}
        </span>
      )}
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3.5 text-ink-500 pointer-events-none">
            <Icon name={icon} size={16} />
          </span>
        )}
        <input
          {...props}
          className={cn(
            'w-full py-3 px-3.5 bg-cream-50 rounded-lg',
            'font-sans text-sm text-ink-900',
            'border outline-none transition-colors duration-150',
            'focus:border-ink-900',
            error ? 'border-terracota' : 'border-cream-300',
            icon && 'pl-10',
            className,
          )}
        />
      </div>
      {hint && !error && <span className="font-sans text-xs text-ink-500">{hint}</span>}
      {error && <span className="font-sans text-xs text-terracota-dk">{error}</span>}
    </label>
  )
}
