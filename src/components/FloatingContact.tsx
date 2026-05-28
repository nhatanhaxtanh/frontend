'use client'

import { useState } from 'react'
import { Phone } from 'lucide-react'

const PHONE = '0981058232'
const PHONE_DISPLAY = '098 105 8232'

function ZaloIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="52" height="52">
      <rect width="64" height="64" rx="32" fill="#0068FF" />
      <g fill="white">
        <path d="M14 22h14.5l-15 19.5H32v-3.5H17.8L33 19H14v3z" />
        <path d="M35 19v23h3.5V28l8.5 14H50V19h-3.5v13.5L38.5 19H35z" />
        <circle cx="44" cy="44" r="2.5" fill="white" opacity="0" />
      </g>
    </svg>
  )
}

export default function FloatingContact() {
  const [phoneHovered, setPhoneHovered] = useState(false)
  const [zaloHovered, setZaloHovered] = useState(false)

  return (
    <div className="fixed bottom-6 right-5 z-50 flex flex-col items-end gap-3">
      {/* Zalo */}
      <div className="flex items-center gap-2">
        {zaloHovered && (
          <div className="bg-white text-neutral-800 text-sm font-medium px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap animate-in fade-in slide-in-from-right-2 duration-150">
            Chat Zalo
          </div>
        )}
        <a
          href={`https://zalo.me/${PHONE}`}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setZaloHovered(true)}
          onMouseLeave={() => setZaloHovered(false)}
          aria-label="Chat Zalo"
          className="relative flex items-center justify-center rounded-full shadow-lg transition-transform duration-200 hover:scale-110 active:scale-95 overflow-hidden"
          style={{ width: 52, height: 52 }}
        >
          <span className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ backgroundColor: '#0068FF' }} />
          <ZaloIcon />
        </a>
      </div>

      {/* Hotline */}
      <div className="flex items-center gap-2">
        {phoneHovered && (
          <div className="bg-white text-neutral-800 text-sm font-medium px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap animate-in fade-in slide-in-from-right-2 duration-150">
            {PHONE_DISPLAY}
          </div>
        )}
        <a
          href={`tel:${PHONE}`}
          onMouseEnter={() => setPhoneHovered(true)}
          onMouseLeave={() => setPhoneHovered(false)}
          aria-label={`Gọi hotline ${PHONE_DISPLAY}`}
          className="relative flex items-center justify-center rounded-full shadow-lg transition-transform duration-200 hover:scale-110 active:scale-95 bg-green-500"
          style={{ width: 52, height: 52 }}
        >
          <span className="absolute inset-0 rounded-full animate-ping opacity-30 bg-green-500" />
          <Phone size={22} className="text-white" strokeWidth={2.5} />
        </a>
      </div>
    </div>
  )
}
