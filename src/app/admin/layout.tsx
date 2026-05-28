'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { authApi } from '@/lib/api'
import { LayoutDashboard, Car, ClipboardList, Settings, LogOut, Menu, X, Newspaper, MonitorPlay, Sun, Moon } from 'lucide-react'
import VWLogo from '@/components/VWLogo'
import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/sonner'

const navItems = [
  { href: '/admin', label: 'Tổng quan', icon: LayoutDashboard, exact: true },
  { href: '/admin/models', label: 'Dòng xe', icon: Car },
  { href: '/admin/test-drives', label: 'Đăng ký lái thử', icon: ClipboardList },
  { href: '/admin/news', label: 'Tin tức', icon: Newspaper },
  { href: '/admin/hero', label: 'Hero Banner', icon: MonitorPlay },
  { href: '/admin/settings', label: 'Cài đặt', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [adminUser, setAdminUser] = useState('')
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('admin_dark') === '1'
    setDark(saved)
    if (saved) document.documentElement.classList.add('dark')
    return () => document.documentElement.classList.remove('dark')
  }, [])

  const toggleDark = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('admin_dark', next ? '1' : '0')
  }

  useEffect(() => {
    if (pathname === '/admin/login') {
      setReady(true)
      return
    }
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.replace('/admin/login')
      return
    }
    authApi.me().then(() => {
      setAdminUser(localStorage.getItem('admin_user') || 'Admin')
      setReady(true)
    }).catch(() => {
      localStorage.removeItem('admin_token')
      router.replace('/admin/login')
    })
  }, [router, pathname])

  const logout = useCallback(() => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    router.push('/admin/login')
  }, [router])

  if (!ready) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (pathname === '/admin/login') return <>{children}<Toaster richColors position="top-right" /></>

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-neutral-950 flex flex-col transition-transform duration-300',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-800">
          <Link href="/admin" className="flex items-center gap-2">
            <VWLogo size={26} className="text-white" />
            <span className="text-white font-semibold tracking-[0.12em] uppercase text-xs">Admin</span>
          </Link>
          <button className="lg:hidden text-neutral-400" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded transition-colors',
                  active
                    ? 'bg-white text-black'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                )}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-neutral-800">
          <div className="px-3 py-2 text-xs text-neutral-500 mb-2">{adminUser}</div>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-400 hover:text-white w-full rounded hover:bg-neutral-800 transition-colors"
          >
            <LogOut size={18} /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="h-16 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center px-6 gap-4 sticky top-0 z-20">
          <button className="lg:hidden text-neutral-600" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
          <div className="flex-1" />
          <Link href="/" target="_blank" className="text-xs text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
            Xem trang web →
          </Link>
          <button
            onClick={toggleDark}
            className="p-2 rounded text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>

      <Toaster richColors position="top-right" />
    </div>
  )
}
