import { Gift } from 'lucide-react'

/**
 * Tách phần ưu đãi khỏi mô tả ngắn: đoạn viết HOA sau dấu "—" hoặc "-" cuối cùng
 * (vd "MPV executive — ƯU ĐÃI GIẢM 100% LỆ PHÍ TRƯỚC BẠ.") được hiển thị thành nhãn nổi bật.
 */
export function splitHighlight(text: string): { body: string; highlight: string | null } {
  const match = text.match(/^(.*\S)\s+[—–-]\s+([^—–]+?)\.?\s*$/)
  if (!match) return { body: text, highlight: null }
  const tail = match[2]
  const isUpper = /\p{L}/u.test(tail) && tail === tail.toLocaleUpperCase('vi')
  return isUpper ? { body: match[1], highlight: tail } : { body: text, highlight: null }
}

interface Props {
  text?: string
  className?: string
  /** Class cho phần mô tả thường (vd line-clamp). */
  bodyClassName?: string
}

export default function ShortDescription({ text, className, bodyClassName }: Props) {
  if (!text) return null
  const { body, highlight } = splitHighlight(text)
  return (
    <div className={className}>
      <p className={bodyClassName}>{body}</p>
      {highlight && (
        <span className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 bg-red-600 text-white text-xs font-bold uppercase tracking-wide leading-snug">
          <Gift size={13} className="shrink-0" />
          {highlight}
        </span>
      )}
    </div>
  )
}
