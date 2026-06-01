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
                  507C Võ Nguyên Giáp, An Khánh, Thủ Đức, TP.HCM
                </p>
              </div>
            </div>
            <a
              href="https://maps.google.com/maps?q=507C+V%C3%B5+Nguy%C3%AAn+Gi%C3%A1p%2C+An+Kh%C3%A1nh%2C+Th%E1%BB%A7+%C4%90%E1%BB%A9c%2C+TP.HCM"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-sm font-semibold uppercase tracking-widest border border-black px-5 py-2.5 hover:bg-black hover:text-white transition-colors duration-200"
            >
              Mở Google Maps
            </a>
          </div>

          <div className="lg:col-span-2 h-[420px] overflow-hidden border border-neutral-200">
            <iframe
              src="https://maps.google.com/maps?q=507C+V%C3%B5+Nguy%C3%AAn+Gi%C3%A1p%2C+An+Kh%C3%A1nh%2C+Th%E1%BB%A7+%C4%90%E1%BB%A9c%2C+TP.HCM&output=embed&hl=vi"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Volkswagen An Phú — 507C Võ Nguyên Giáp"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
