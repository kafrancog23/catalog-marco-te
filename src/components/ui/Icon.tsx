interface IconProps {
  name: string
  size?: number
  stroke?: number
  className?: string
}

export default function Icon({ name, size = 18, stroke = 1.6, className }: IconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: stroke,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
  }

  switch (name) {
    case 'bag':
      return <svg {...common}><path d="M5 7h14l-1 13H6L5 7Z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/></svg>
    case 'search':
      return <svg {...common}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
    case 'plus':
      return <svg {...common}><path d="M12 5v14M5 12h14"/></svg>
    case 'minus':
      return <svg {...common}><path d="M5 12h14"/></svg>
    case 'x':
      return <svg {...common}><path d="M6 6l12 12M18 6 6 18"/></svg>
    case 'check':
      return <svg {...common}><path d="m5 12 5 5 9-12"/></svg>
    case 'arrow-r':
      return <svg {...common}><path d="M5 12h14M13 6l6 6-6 6"/></svg>
    case 'arrow-ur':
      return <svg {...common}><path d="M7 17 17 7M8 7h9v9"/></svg>
    case 'grid':
      return <svg {...common}><rect x="4" y="4" width="7" height="7"/><rect x="13" y="4" width="7" height="7"/><rect x="4" y="13" width="7" height="7"/><rect x="13" y="13" width="7" height="7"/></svg>
    case 'rows':
      return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
    case 'edit':
      return <svg {...common}><path d="M4 20h4L20 8l-4-4L4 16v4Z"/></svg>
    case 'trash':
      return <svg {...common}><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>
    case 'eye':
      return <svg {...common}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>
    case 'eye-off':
      return <svg {...common}><path d="m3 3 18 18M10.6 6.2A10 10 0 0 1 22 12s-1 2-3 4"/><path d="M6 6 2 12s3.5 7 10 7a10 10 0 0 0 4-.8"/></svg>
    case 'upload':
      return <svg {...common}><path d="M12 16V4m-5 5 5-5 5 5M4 20h16"/></svg>
    case 'user':
      return <svg {...common}><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/></svg>
    case 'logout':
      return <svg {...common}><path d="M10 4H5v16h5M16 8l4 4-4 4M10 12h10"/></svg>
    case 'package':
      return <svg {...common}><path d="M4 8 12 4l8 4v8l-8 4-8-4V8Z"/><path d="M4 8l8 4 8-4M12 12v8"/></svg>
    case 'scale':
      return <svg {...common}><path d="M12 3v18M5 8h14l-2 6a5 5 0 0 1-10 0l-2-6Z"/></svg>
    case 'sparkle':
      return <svg {...common}><path d="M12 3v6M12 15v6M3 12h6M15 12h6"/></svg>
    case 'wa':
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className}>
          <path d="M17.5 14.4c-.3-.1-1.8-.9-2-.967-.3-.1-.5-.15-.7.15-.2.3-.8 1-1 1.2-.2.2-.3.2-.6.07-.3-.15-1.3-.46-2.4-1.47-.9-.79-1.5-1.76-1.7-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35m-5.42 7.4h-.004a9.87 9.87 0 01-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 012.89 6.99c-.003 5.45-4.44 9.88-9.89 9.88m8.41-18.3A11.82 11.82 0 0012.05 0C5.5 0 .16 5.34.157 11.89c0 2.1.55 4.14 1.59 5.95L.057 24l6.3-1.65a11.88 11.88 0 005.68 1.45h.005c6.55 0 11.89-5.34 11.89-11.89a11.82 11.82 0 00-3.48-8.41Z"/>
        </svg>
      )
    default:
      return null
  }
}
