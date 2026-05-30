'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import VWLogo from '@/components/VWLogo'

const navLinks = [
  { href: '/', label: 'Trang chủ' },
  { href: '/models', label: 'Dòng xe' },
  { href: '/tinh-toan-vay', label: 'Tính toán vay' },
  { href: '/tin-tuc', label: 'Tin tức' },
  { href: '/le-ban-giao', label: 'Lễ bàn giao' },
  { href: '/lien-he', label: 'Liên hệ' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const isAdminPage = pathname.startsWith('/admin')
  const isHome = pathname === '/'

  // Transparent-to-solid chỉ áp dụng ở trang chủ; các trang khác luôn solid
  const transparent = isHome && !scrolled

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    // Reset scroll state khi đổi trang để tránh flash
    setScrolled(window.scrollY > 20)
  }, [pathname])

  if (isAdminPage) return null

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        transparent
          ? 'bg-transparent'
          : 'bg-white/95 backdrop-blur border-b border-neutral-200 shadow-sm'
      )}
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between max-w-7xl">
        <Link href="/" className="flex items-center gap-2.5">
          <VWLogo
            size={32}
            className={cn('transition-colors', transparent ? 'text-white' : 'text-black')}
          />
          <span
            className={cn(
              'text-sm font-semibold tracking-[0.15em] uppercase transition-colors',
              transparent ? 'text-white' : 'text-black'
            )}
          >
            Volkswagen An Phú
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative py-1 text-sm font-medium tracking-wide transition-colors duration-200 hover:opacity-60',
                  transparent ? 'text-white' : 'text-black'
                )}
              >
                {link.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className={cn(
                      'absolute left-0 -bottom-0.5 h-[2px] w-full',
                      transparent ? 'bg-white' : 'bg-black'
                    )}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <a
            href="tel:0981058232"
            className={cn(
              'flex items-center gap-1.5 text-sm font-medium transition-colors hover:opacity-70',
              transparent ? 'text-white' : 'text-black'
            )}
          >
            <Phone size={14} strokeWidth={2.5} />
            098 105 8232
          </a>
          <Link href="/dang-ky-lai-thu">
            <Button
              variant={transparent ? 'outline' : 'default'}
              size="sm"
              className={cn(
                'rounded-lg tracking-wide text-xs uppercase font-semibold transition-all',
                transparent && 'border-white text-white hover:bg-white hover:text-black bg-transparent'
              )}
            >
              Đăng ký lái thử
            </Button>
          </Link>
        </div>

        <button
          className={cn('md:hidden transition-colors', transparent ? 'text-white' : 'text-black')}
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
                <Button className="w-full rounded-lg uppercase text-xs tracking-wide font-semibold">
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
