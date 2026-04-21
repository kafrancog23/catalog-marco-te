import { cn } from '@/lib/cn'
import Icon from './Icon'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'mustard' | 'whatsapp' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  icon?: string
  iconRight?: string
}

const variantClasses = {
  primary: 'bg-ink-900 text-cream-50 border-transparent hover:opacity-90',
  secondary: 'bg-transparent text-ink-900 border-ink-900 hover:bg-cream-200',
  ghost: 'bg-transparent text-ink-700 border-transparent hover:bg-cream-200',
  mustard: 'bg-mustard text-ink-900 border-transparent hover:opacity-90',
  whatsapp: 'bg-whatsapp text-white border-transparent hover:opacity-90',
  danger: 'bg-transparent text-terracota-dk border-cream-300 hover:bg-cream-200',
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-[13px] min-h-[32px]',
  md: 'px-4 py-2.5 text-sm min-h-[40px]',
  lg: 'px-6 py-3.5 text-[15px] min-h-[52px]',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const iconSize = size === 'sm' ? 14 : 16

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-sans font-medium tracking-tight',
        'border rounded-pill cursor-pointer transition-all duration-150',
        'hover:-translate-y-px disabled:opacity-45 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {icon && <Icon name={icon} size={iconSize} />}
      {children}
      {iconRight && <Icon name={iconRight} size={iconSize} />}
    </button>
  )
}
