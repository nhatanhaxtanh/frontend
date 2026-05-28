'use client'

import { useState } from 'react'
import { Phone } from 'lucide-react'

const PHONE = '0981058232'
const PHONE_DISPLAY = '098 105 8232'

function ZaloIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
      <rect width="48" height="48" rx="10" fill="white" fillOpacity="0" />
      <path
        d="M8 13.5C8 10.46 10.46 8 13.5 8h21C37.54 8 40 10.46 40 13.5v21C40 37.54 37.54 40 34.5 40h-21C10.46 40 8 37.54 8 34.5v-21z"
        fill="white"
        fillOpacity="0.15"
      />
      <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="20" fontWeight="800" fontFamily="Arial, sans-serif">
        Z
      </text>
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
          className="relative flex items-center justify-center w-13 h-13 rounded-full shadow-lg transition-transform duration-200 hover:scale-110 active:scale-95"
          style={{ width: 52, height: 52, backgroundColor: '#0068FF' }}
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
