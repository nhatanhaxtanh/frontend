/**
 * Dải video chạy hết chiều ngang màn hình, đặt ngay trên mục "Chất lượng không thỏa hiệp".
 *
 * Thuần trang trí: tự phát, tự lặp, không tiếng và khách không tương tác được.
 * Không dùng hook nên để nguyên server component, không phải nạp thêm JS xuống client.
 */
export default function ShowcaseVideo() {
  return (
    <section aria-hidden="true" className="w-full bg-neutral-950 overflow-hidden leading-none">
      <video
        src="/videos/id-era-9x.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
        tabIndex={-1}
        className="w-full aspect-video max-h-[70vh] object-cover object-center pointer-events-none select-none"
      />
    </section>
  )
}
