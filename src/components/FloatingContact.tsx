'use client'

import { useState } from 'react'
import { Phone } from 'lucide-react'
import Image from 'next/image'

const PHONE = '0981058232'
const PHONE_DISPLAY = '098 105 8232'

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
          <Image src="/images/zalo-icon.png" alt="Zalo" width={52} height={52} className="rounded-full" />
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
