'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import Image from 'next/image'

interface LightboxProps {
  images: string[]
  index: number
  onClose: () => void
  onChange: (i: number) => void
}

export default function Lightbox({ images, index, onClose, onChange }: LightboxProps) {
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const dragging = useRef(false)
  const dragStart = useRef({ mx: 0, my: 0, ox: 0, oy: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setScale(1)
    setOffset({ x: 0, y: 0 })
  }, [index])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key === 'ArrowLeft') onChange((index - 1 + images.length) % images.length)
      if (e.key === 'ArrowRight') onChange((index + 1) % images.length)
      if (e.key === '+' || e.key === '=') setScale(s => Math.min(s + 0.5, 5))
      if (e.key === '-') setScale(s => { const n = Math.max(s - 0.5, 1); if (n === 1) setOffset({ x: 0, y: 0 }); return n })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, images.length, onClose, onChange])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      setScale(s => {
        const next = Math.max(1, Math.min(5, s + (e.deltaY < 0 ? 0.3 : -0.3)))
        if (next === 1) setOffset({ x: 0, y: 0 })
        return next
      })
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  const zoomIn = () => setScale(s => Math.min(s + 0.5, 5))
  const zoomOut = () => setScale(s => { const n = Math.max(s - 0.5, 1); if (n === 1) setOffset({ x: 0, y: 0 }); return n })
  const reset = () => { setScale(1); setOffset({ x: 0, y: 0 }) }

  const onMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return
    dragging.current = true
    dragStart.current = { mx: e.clientX, my: e.clientY, ox: offset.x, oy: offset.y }
  }
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current) return
    setOffset({
      x: dragStart.current.ox + (e.clientX - dragStart.current.mx),
      y: dragStart.current.oy + (e.clientY - dragStart.current.my),
    })
  }
  const onMouseUp = () => { dragging.current = false }

  const prev = () => onChange((index - 1 + images.length) % images.length)
  const next = () => onChange((index + 1) % images.length)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-black/96 flex flex-col select-none"
      onClick={onClose}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-5 py-3 shrink-0 bg-black/40"
        onClick={e => e.stopPropagation()}
      >
        <span className="text-neutral-500 text-sm tabular-nums">
          {index + 1} / {images.length}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={zoomOut}
            className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"
            title="Thu nhỏ (−)"
          >
            <ZoomOut size={16} />
          </button>
          <span className="text-white/50 text-xs w-12 text-center tabular-nums">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={zoomIn}
            className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"
            title="Phóng to (+)"
          >
            <ZoomIn size={16} />
          </button>
          {scale > 1 && (
            <button
              onClick={reset}
              className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 rounded transition-colors ml-0.5"
              title="Đặt lại"
            >
              <RotateCcw size={14} />
            </button>
          )}
          <div className="w-px h-5 bg-white/10 mx-2" />
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"
            title="Đóng (Esc)"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Image area */}
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center relative overflow-hidden"
        onClick={e => e.stopPropagation()}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        style={{ cursor: scale > 1 ? (dragging.current ? 'grabbing' : 'grab') : 'default' }}
      >
        {/* Prev button */}
        {images.length > 1 && (
          <button
            onClick={e => { e.stopPropagation(); prev() }}
            className="absolute left-4 z-10 w-10 h-10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronLeft size={28} />
          </button>
        )}

        {/* Image with zoom/pan transform */}
        <motion.div
          style={{
            width: '90vw',
            height: '80vh',
            position: 'relative',
            transform: `scale(${scale}) translate(${offset.x / scale}px, ${offset.y / scale}px)`,
            transition: dragging.current ? 'none' : 'transform 0.15s ease',
            transformOrigin: 'center center',
          }}
        >
          <Image
            key={images[index]}
            src={images[index]}
            alt=""
            fill
            className="object-contain"
            sizes="100vw"
            draggable={false}
            priority
          />
        </motion.div>

        {/* Next button */}
        {images.length > 1 && (
          <button
            onClick={e => { e.stopPropagation(); next() }}
            className="absolute right-4 z-10 w-10 h-10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronRight size={28} />
          </button>
        )}
      </div>

      {/* Bottom hint */}
      <div className="py-3 text-center shrink-0" onClick={e => e.stopPropagation()}>
        <p className="text-neutral-600 text-xs">
          Cuộn chuột để phóng to · Kéo để di chuyển khi phóng to · ← → để chuyển ảnh
        </p>
      </div>
    </motion.div>
  )
}
