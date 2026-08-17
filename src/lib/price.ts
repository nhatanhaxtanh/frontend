/** Nhãn đứng trước con số giá: xe chưa công bố giá chính thức thì ghi "Giá dự kiến". */
export function pricePrefix(priceEstimated?: boolean): string {
  return priceEstimated ? 'Giá dự kiến' : 'Từ'
}

export const ESTIMATED_PRICE_NOTE =
  'Giá dự kiến, chưa phải giá công bố chính thức. Vui lòng liên hệ để được báo giá mới nhất.'
