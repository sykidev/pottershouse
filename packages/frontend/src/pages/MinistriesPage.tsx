import { Link } from 'wouter';
import { useContent } from '@/lib/content';
import { MINISTRIES_DEFAULT, MinistriesContent, ministrySlug } from '@/lib/site-content';
import { Book, Music, Baby, Users, Heart, HandHeart, Sparkles, ArrowRight, LucideIcon } from 'lucide-react';

// Icon names an admin can type for a ministry card.
const ICONS: Record<string, LucideIcon> = { Book, Music, Baby, Users, Heart, HandHeart, Sparkles };

// Card color themes cycled across the ministry list.
const PALETTE = [
  { color: 'from-blue-600 to-blue-800', bgColor: 'bg-blue-600/10', hoverColor: 'hover:border-blue-600/30' },
  { color: 'from-purple-600 to-purple-800', bgColor: 'bg-purple-600/10', hoverColor: 'hover:border-purple-600/30' },
  { color: 'from-pink-600 to-pink-800', bgColor: 'bg-pink-600/10', hoverColor: 'hover:border-pink-600/30' },
  { color: 'from-amber to-amber-700', bgColor: 'bg-amber/10', hoverColor: 'hover:border-amber/30' },
  { color: 'from-green-600 to-green-800', bgColor: 'bg-green-600/10', hoverColor: 'hover:border-green-600/30' },
  { color: 'from-crimson to-crimson-800', bgColor: 'bg-crimson/10', hoverColor: 'hover:border-crimson/30' },
];

export function MinistriesPage() {
  const page = useContent<MinistriesContent>('ministries', MINISTRIES_DEFAULT);

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

      {/* Ministries & Groups */}
      <section className="bg-gradient-to-b from-warm-white to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex justify-center items-center gap-2 mb-4">
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-crimson" />
              <Heart className="w-6 h-6 text-crimson" />
              <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-crimson" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-3">{page.ministriesHeading}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{page.ministriesSubtitle}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {page.ministries.map((ministry, index) => {
              const Icon = ICONS[ministry.icon] || Heart;
              const theme = PALETTE[index % PALETTE.length];
              return (
                <Link key={index} href={`/ministries/${ministrySlug(ministry.title)}`}>
                  <a
                    className={`group relative block bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-transparent ${theme.hoverColor} overflow-hidden`}
                  >
                    <div className={`absolute inset-0 ${theme.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    <div className="relative z-10 flex flex-col h-full">
                      <div className={`w-16 h-16 bg-gradient-to-br ${theme.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-crimson transition-colors">{ministry.title}</h3>
                      <p className="text-gray-700 leading-relaxed line-clamp-3 mb-6">{ministry.description}</p>
                      <span className="mt-auto inline-flex items-center gap-2 text-crimson font-semibold text-sm">
                        More Info
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-tl from-crimson/10 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500" />
                  </a>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
