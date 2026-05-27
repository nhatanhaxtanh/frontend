'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Trang chủ' },
  { href: '/models', label: 'Dòng xe' },
  { href: '/lien-he', label: 'Liên hệ' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const isAdminPage = pathname.startsWith('/admin')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  if (isAdminPage) return null

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'bg-white/95 backdrop-blur border-b border-neutral-200 shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between max-w-7xl">
        <Link href="/" className="flex items-center gap-2">
          <span
            className={cn(
              'text-xl font-bold tracking-widest uppercase transition-colors',
              scrolled ? 'text-black' : 'text-white'
            )}
          >
            VW Sài Gòn
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium tracking-wide transition-all duration-200 hover:opacity-70',
                pathname === link.href ? 'underline underline-offset-4' : '',
                scrolled ? 'text-black' : 'text-white'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex">
          <Link href="/dang-ky-lai-thu">
            <Button
              variant={scrolled ? 'default' : 'outline'}
              size="sm"
              className={cn(
                'rounded-none tracking-wide text-xs uppercase font-semibold transition-all',
                !scrolled && 'border-white text-white hover:bg-white hover:text-black bg-transparent'
              )}
            >
              Đăng ký lái thử
            </Button>
          </Link>
        </div>

        <button
          className={cn('md:hidden transition-colors', scrolled ? 'text-black' : 'text-white')}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-neutral-200"
          >
            <nav className="container mx-auto px-6 py-6 flex flex-col gap-4 max-w-7xl">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-sm font-medium tracking-wide text-black hover:opacity-60 transition-opacity py-1',
                    pathname === link.href && 'font-bold'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/dang-ky-lai-thu" className="mt-2">
                <Button className="w-full rounded-none uppercase text-xs tracking-wide font-semibold">
                  Đăng ký lái thử
                </Button>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
