'use client'

import { useEffect } from 'react'
import { animate, motion, useMotionValue, useTransform, useReducedMotion } from 'framer-motion'

interface Props {
  /** Giá trị cuối — cũng là giá trị render lúc SSR để HTML luôn có số thật. */
  to: number
  /** Thời lượng chạy số, tính bằng giây. */
  duration?: number
  className?: string
}

/**
 * Chạy số từ 0 lên `to` mỗi lần mount, rồi dừng hẳn ở `to`.
 * Chỉ là hiệu ứng trình bày: giá trị hiển thị sau cùng luôn đúng bằng `to`.
 *
 * Dùng motion value thay vì state để số nhảy ngoài vòng render của React —
 * tránh ~80 lần re-render trong 1.4s, và không vướng quy tắc set-state-in-effect.
 */
export default function CountUp({ to, duration = 1.4, className }: Props) {
  const reduceMotion = useReducedMotion()
  const count = useMotionValue(to)
  const display = useTransform(count, (v) => Math.round(v).toLocaleString('vi-VN'))

  useEffect(() => {
    // Người dùng bật giảm chuyển động thì hiện thẳng số cuối.
    if (reduceMotion) {
      count.set(to)
      return
    }

    // Chạy lại mỗi lần mount, kể cả khi điều hướng client-side từ trang khác sang.
    count.set(0)
    const controls = animate(count, to, { duration, ease: 'easeOut' })
    return () => controls.stop()
  }, [to, duration, reduceMotion, count])

  // tabular-nums (đặt ở className) giữ bề rộng chữ số cố định, tránh giật layout.
  return <motion.span className={className}>{display}</motion.span>
}
