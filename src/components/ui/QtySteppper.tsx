import Icon from './Icon'

interface QtyStepperProps {
  value: number
  onChange: (value: number) => void
  min?: number
}

export default function QtySteppper({ value, onChange, min = 1 }: QtyStepperProps) {
  return (
    <div className="inline-flex items-center border border-cream-300 rounded-pill bg-cream-50">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-[34px] h-[34px] bg-transparent border-none cursor-pointer text-ink-700 inline-flex items-center justify-center"
      >
        <Icon name="minus" size={14} />
      </button>
      <span className="font-mono text-sm min-w-[28px] text-center text-ink-900">
        {value}
      </span>
      <button
        onClick={() => onChange(value + 1)}
        className="w-[34px] h-[34px] bg-transparent border-none cursor-pointer text-ink-700 inline-flex items-center justify-center"
      >
        <Icon name="plus" size={14} />
      </button>
    </div>
  )
}
