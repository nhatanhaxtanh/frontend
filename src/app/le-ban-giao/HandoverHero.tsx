'use client'

import { motion } from 'framer-motion'

export default function HandoverHero() {
  return (
    <div className="bg-neutral-950 py-24 px-6">
      <div className="container mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="text-xs tracking-[0.25em] text-neutral-500 uppercase">Volkswagen An Phú</span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mt-2">Lễ Bàn Giao</h1>
        </motion.div>
      </div>
    </div>
  )
}
