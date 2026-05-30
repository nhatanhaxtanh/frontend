'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Phone } from 'lucide-react'

const PHONE = '0981058232'
const PHONE_DISPLAY = '098 105 8232'
const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=61576384566535'

function FacebookIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="white">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}


type ButtonItem = {
  key: string
  label: string
  href: string
  color: string
  ping?: boolean
  icon: React.ReactNode
}


const buttons: ButtonItem[] = [
  {
    key: 'facebook',
    label: 'Facebook',
    href: FACEBOOK_URL,
    color: '#1877F2',
    ping: true,
    icon: <FacebookIcon />,
  },
  {
    key: 'zalo',
    label: 'Chat Zalo',
    href: `https://zalo.me/${PHONE}`,
    color: '#0068FF',
    ping: true,
    icon: <span className="text-white font-bold text-sm tracking-wide">Zalo</span>,
  },
  {
    key: 'phone',
    label: PHONE_DISPLAY,
    href: `tel:${PHONE}`,
    color: '#22c55e',
    ping: true,
    icon: <Phone size={22} className="text-white" strokeWidth={2.5} />,
  },
]

export default function FloatingContact() {
  const [hovered, setHovered] = useState<string | null>(null)
  const pathname = usePathname()

  if (pathname.startsWith('/admin')) return null

  return (
    <div className="fixed bottom-6 right-5 z-50 flex flex-col items-end gap-3">
      {buttons.map((btn) => (
        <div key={btn.key} className="flex items-center gap-2">
          {hovered === btn.key && (
            <div className="bg-white text-neutral-800 text-sm font-medium px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap animate-in fade-in slide-in-from-right-2 duration-150">
              {btn.label}
            </div>
          )}
          <a
            href={btn.href}
            target={btn.href.startsWith('http') ? '_blank' : undefined}
            rel={btn.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            onMouseEnter={() => setHovered(btn.key)}
            onMouseLeave={() => setHovered(null)}
            aria-label={btn.label}
            className="relative flex items-center justify-center rounded-full shadow-lg transition-transform duration-200 hover:scale-110 active:scale-95"
            style={{ width: 52, height: 52, backgroundColor: btn.color }}
          >
            {btn.ping && (
              <span
                className="absolute inset-0 rounded-full animate-ping opacity-30"
                style={{ backgroundColor: btn.color }}
              />
            )}
            {btn.icon}
          </a>
        </div>
      ))}
    </div>
  )
}
