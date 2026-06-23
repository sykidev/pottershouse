import { useContent } from '@/lib/content';
import { VISIT_DEFAULT, VisitContent } from '@/lib/site-content';
import { MapPin, Phone, Mail, Clock, Sparkles } from 'lucide-react';

export function VisitPage() {
  const page = useContent<VisitContent>('visit', VISIT_DEFAULT);
  const primaryPhone = page.phones.find(Boolean);

  return (
    <div>
      {/* Hero */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-blue-900 via-crimson to-purple-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }} />
        </div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-amber/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="flex justify-center mb-4">
            <Sparkles className="w-10 h-10 text-amber animate-pulse" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-4 text-white drop-shadow-2xl">{page.heroTitle}</h1>
          <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">{page.heroSubtitle}</p>
        </div>
      </section>

      {/* Church info + service schedule */}
      <section className="bg-gradient-to-b from-warm-white to-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            {/* Church info */}
            <div className="bg-gradient-to-br from-royal-900 to-purple-900 rounded-3xl p-8 text-white shadow-xl">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-6">Plan Your Visit</h2>
              <p className="text-2xl font-semibold mb-4">{page.churchName}</p>
              <div className="flex items-start gap-3 mb-2">
                <MapPin className="w-6 h-6 text-gold-400 flex-shrink-0 mt-1" />
                <p className="text-white/90">{page.address}</p>
              </div>
              {page.postalCode && (
                <p className="text-white/70 text-sm pl-9 mb-2">Postal Code: {page.postalCode}</p>
              )}
              {page.phones.filter(Boolean).map((phone) => (
                <div key={phone} className="flex items-center gap-3 mt-3">
                  <Phone className="w-5 h-5 text-gold-400 flex-shrink-0" />
                  <a href={`tel:${phone.replace(/[^+\d]/g, '')}`} className="text-white/90 hover:text-white transition-colors">
                    {phone}
                  </a>
                </div>
              ))}
              {page.email && (
                <div className="flex items-center gap-3 mt-3">
                  <Mail className="w-5 h-5 text-gold-400 flex-shrink-0" />
                  <a href={`mailto:${page.email}`} className="text-white/90 hover:text-white transition-colors">
                    {page.email}
                  </a>
                </div>
              )}
            </div>

            {/* Service schedule */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Clock className="w-6 h-6 text-crimson" />
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">{page.servicesHeading}</h2>
              </div>
              <div className="space-y-3">
                {page.services.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-4 bg-warm-white rounded-2xl p-5 border border-gray-100 shadow-sm"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900">{s.day}</p>
                      <p className="text-gray-600 text-sm">{s.name}</p>
                    </div>
                    <span className="inline-block bg-crimson/10 text-crimson font-semibold px-4 py-1.5 rounded-full text-sm text-right flex-shrink-0">
                      {s.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 overflow-hidden bg-gradient-to-br from-crimson via-crimson-800 to-purple-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)',
            backgroundSize: '50px 50px',
          }} />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-8 text-white drop-shadow-2xl">{page.ctaHeading}</h2>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {primaryPhone && (
              <a
                href={`tel:${primaryPhone.replace(/[^+\d]/g, '')}`}
                className="inline-flex items-center justify-center gap-3 bg-white text-crimson px-8 py-4 rounded-2xl font-semibold hover:bg-white/90 transition-all duration-300 hover:scale-105 shadow-2xl group"
              >
                <div className="w-10 h-10 bg-crimson/10 rounded-xl flex items-center justify-center group-hover:bg-crimson/20 transition-colors">
                  <Phone className="w-5 h-5 text-crimson" />
                </div>
                Call Us
              </a>
            )}
            {page.email && (
              <a
                href={`mailto:${page.email}`}
                className="inline-flex items-center justify-center gap-3 bg-white text-crimson px-8 py-4 rounded-2xl font-semibold hover:bg-white/90 transition-all duration-300 hover:scale-105 shadow-2xl group"
              >
                <div className="w-10 h-10 bg-crimson/10 rounded-xl flex items-center justify-center group-hover:bg-crimson/20 transition-colors">
                  <Mail className="w-5 h-5 text-crimson" />
                </div>
                Email Us
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
