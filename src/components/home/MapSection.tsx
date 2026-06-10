import { MapPin } from 'lucide-react'

export default function MapSection() {
  return (
    <section className="bg-white">
      <div className="container mx-auto px-6 py-16 max-w-7xl">
        <div className="mb-8">
          <span className="text-xs tracking-[0.25em] text-neutral-400 uppercase">Vị trí</span>
          <h2 className="text-3xl md:text-4xl font-bold text-black mt-2">Tìm đường đến chúng tôi</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-neutral-100 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin size={18} className="text-neutral-600" />
              </div>
              <div>
                <p className="text-xs text-neutral-400 uppercase tracking-widest mb-1">Địa chỉ showroom</p>
                <p className="text-black font-medium leading-relaxed">
                  5 Đường Số 3, An Khánh, Thủ Đức, TP.HCM
                </p>
              </div>
            </div>
            <a
              href="https://www.google.com/maps/place/Volkswagen+An+Ph%C3%BA+(Flagship)/@10.8088033,106.7526711,581m/data=!3m1!1e3!4m6!3m5!1s0x317527956ba0b2ab:0x5ff339e4ae3e781a!8m2!3d10.8087952!4d106.7547279!16s%2Fg%2F11npmfh7j3?entry=ttu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-sm font-semibold uppercase tracking-widest border border-black px-5 py-2.5 hover:bg-black hover:text-white transition-colors duration-200"
            >
              Mở Google Maps
            </a>
          </div>

          <div className="lg:col-span-2 h-[420px] overflow-hidden border border-neutral-200">
            <iframe
              src="https://maps.google.com/maps?q=10.8087952,106.7547279&output=embed&hl=vi"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Volkswagen An Phú — 5 Đường Số 3, An Khánh"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
