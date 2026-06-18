import { useRoute, Link } from 'wouter';
import { useContent } from '@/lib/content';
import {
  MINISTRIES_DEFAULT, MinistriesContent, GALLERY_DEFAULT, GalleryContent, ministrySlug,
} from '@/lib/site-content';
import { Book, Music, Baby, Users, Heart, HandHeart, Sparkles, ArrowLeft, ArrowRight, LucideIcon } from 'lucide-react';

const ICONS: Record<string, LucideIcon> = { Book, Music, Baby, Users, Heart, HandHeart, Sparkles };

export function MinistryDetailPage() {
  const [, params] = useRoute('/ministries/:slug');
  const slug = params?.slug;

  const page = useContent<MinistriesContent>('ministries', MINISTRIES_DEFAULT);
  const gallery = useContent<GalleryContent>('gallery', GALLERY_DEFAULT);

  const ministry = page.ministries.find((m) => ministrySlug(m.title) === slug);

  if (!ministry) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">Ministry not found</h1>
        <Link href="/ministries">
          <a className="text-crimson font-semibold hover:underline">← Back to Ministries</a>
        </Link>
      </div>
    );
  }

  const Icon = ICONS[ministry.icon] || Heart;
  const photos = (gallery.images || []).filter((img) => img.tag === ministry.title);

  return (
    <div>
      {/* Hero */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-royal-900 via-crimson to-purple-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }} />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link href="/ministries">
            <a className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> All Ministries
            </a>
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="w-20 h-20 bg-white/15 rounded-3xl flex items-center justify-center flex-shrink-0">
              <Icon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white drop-shadow-2xl">{ministry.title}</h1>
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="bg-gradient-to-b from-warm-white to-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 md:p-10">
            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">{ministry.description}</p>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link href="/visit">
              <a className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-crimson to-crimson-800 text-white px-8 py-4 rounded-2xl font-semibold hover:scale-105 transition-transform shadow-lg">
                Join Us This Week
                <ArrowRight className="w-5 h-5" />
              </a>
            </Link>
            <Link href="/give">
              <a className="inline-flex items-center justify-center gap-2 bg-white border-2 border-crimson/20 text-crimson px-8 py-4 rounded-2xl font-semibold hover:border-crimson/40 transition-colors">
                Support This Ministry
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Photos tagged for this ministry */}
      {photos.length > 0 && (
        <section className="bg-gradient-to-b from-white to-gray-50 py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mb-8 text-center">Photos</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {photos.map((img, i) => (
                <div key={i} className="aspect-square overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
                  <img src={img.url} alt={img.caption || ministry.title} loading="lazy" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/gallery">
                <a className="text-crimson font-semibold hover:underline">View full gallery →</a>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
