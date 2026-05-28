'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Lên đầu trang"
      className="fixed bottom-6 left-5 z-50 w-12 h-12 rounded-full bg-neutral-950 text-white flex items-center justify-center shadow-lg hover:bg-neutral-700 active:scale-95 transition-all duration-200"
    >
      <ArrowUp size={20} />
    </button>
  )
}
