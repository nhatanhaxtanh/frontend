/**
 * Số khách đã đăng ký lái thử một dòng xe — đếm từ bảng test_drive_requests,
 * dùng làm tín hiệu quan tâm ngoài trang công khai.
 */
export function interestLabel(count: number): string {
  return `Đã có ${count} khách đăng ký trải nghiệm`
}
