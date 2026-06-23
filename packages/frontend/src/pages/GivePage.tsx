import { useContent } from '@/lib/content';
import { GIVE_DEFAULT, GiveContent } from '@/lib/site-content';
import { HandHeart, Building2, Landmark, Sparkles, Phone, Instagram, Facebook, Send, Radio, Globe, LucideIcon } from 'lucide-react';

const SOCIAL_ICONS: Record<string, LucideIcon> = {
  Instagram,
  Facebook,
  Telegram: Send,
  Mixlr: Radio,
};

export function GivePage() {
  const page = useContent<GiveContent>('give', GIVE_DEFAULT);

  return (
    <div>
      {/* Hero */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-crimson via-crimson-800 to-purple-900">
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
            <HandHeart className="w-12 h-12 text-amber animate-pulse" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-4 text-white drop-shadow-2xl">{page.heroTitle}</h1>
          <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">{page.heroSubtitle}</p>
        </div>
      </section>

      {/* Intro + Ways to give */}
      <section className="bg-gradient-to-b from-warm-white to-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {page.intro && (
            <div className="text-center mb-12 max-w-3xl mx-auto">
              <div className="flex justify-center items-center gap-2 mb-4">
                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-crimson" />
                <Sparkles className="w-6 h-6 text-crimson" />
                <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-crimson" />
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">{page.intro}</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {page.ways.map((way, index) => {
              const Icon = way.currency.toUpperCase() === 'USD' ? Landmark : index % 2 === 0 ? HandHeart : Building2;
              return (
                <div
                  key={index}
                  className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-crimson/20 overflow-hidden"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-crimson to-purple-700 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{way.heading}</h3>
                      <span className="inline-block bg-amber/15 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full mt-1">
                        {way.currency}
                      </span>
                    </div>
                  </div>

                  <dl className="space-y-3 text-sm">
                    <Row label="Account Name" value={way.accountName} />
                    <Row label="Account Number" value={way.accountNumber} mono />
                    <Row label="Bank" value={way.bank} />
                    {way.swift && <Row label="Swift Code" value={way.swift} mono />}
                  </dl>

                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-tl from-crimson/10 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500" />
                </div>
              );
            })}
          </div>

          {/* Contact / more info */}
          {(page.contactText || page.phones.length > 0 || page.social.length > 0) && (
            <div className="mt-12 bg-gradient-to-br from-royal-900 to-purple-900 rounded-3xl p-8 md:p-10 text-center text-white shadow-xl">
              <h3 className="text-2xl font-serif font-bold mb-3">{page.contactHeading}</h3>
              <p className="text-white/85 max-w-2xl mx-auto mb-6">{page.contactText}</p>

              {page.phones.length > 0 && (
                <div className="flex flex-wrap justify-center gap-3 mb-6">
                  {page.phones.map((phone) => (
                    <a
                      key={phone}
                      href={`tel:${phone.replace(/[^+\d]/g, '')}`}
                      className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors rounded-full px-5 py-2.5 font-medium"
                    >
                      <Phone className="w-4 h-4 text-gold-400" />
                      {phone}
                    </a>
                  ))}
                </div>
              )}

              {page.social.length > 0 && (
                <div className="flex flex-wrap justify-center gap-3">
                  {page.social.map((s) => {
                    const Icon = SOCIAL_ICONS[s.label] || Globe;
                    return (
                      <a
                        key={s.label}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white/10 hover:bg-gold-500 hover:text-white transition-colors rounded-full px-5 py-2.5 font-medium"
                      >
                        <Icon className="w-4 h-4" />
                        {s.label}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between items-baseline gap-4 border-b border-gray-100 pb-2">
      <dt className="text-gray-500 flex-shrink-0">{label}</dt>
      <dd className={`text-gray-900 font-semibold text-right min-w-0 ${mono ? 'font-mono tracking-wide break-all' : 'break-words'}`}>{value}</dd>
    </div>
  );
}
