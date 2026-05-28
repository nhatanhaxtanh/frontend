'use client'

import { useState } from 'react'
import { Phone } from 'lucide-react'

const PHONE = '0981058232'
const PHONE_DISPLAY = '098 105 8232'
const FACEBOOK_URL = 'https://facebook.com'
const TWITTER_URL = 'https://x.com'

function FacebookIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="white">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function TwitterIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="white">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
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
    icon: <FacebookIcon />,
  },
  {
    key: 'twitter',
    label: 'Twitter / X',
    href: TWITTER_URL,
    color: '#000000',
    icon: <TwitterIcon />,
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
