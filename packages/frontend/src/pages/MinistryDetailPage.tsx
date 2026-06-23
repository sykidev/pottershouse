import { useState } from 'react';
import { useRoute, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { useContent } from '@/lib/content';
import { MINISTRIES_DEFAULT, MinistriesContent, ministrySlug } from '@/lib/site-content';
import {
  Book, Music, Baby, Users, Heart, HandHeart, Sparkles,
  ArrowLeft, ArrowRight, Camera, X, LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = { Book, Music, Baby, Users, Heart, HandHeart, Sparkles };

interface GalleryRow {
  id: number;
  imageUrl: string;
  caption: string;
  tag: string;
  permalink: string | null;
}

export function MinistryDetailPage() {
  const [, params] = useRoute('/ministries/:slug');
  const slug = params?.slug;

  const page = useContent<MinistriesContent>('ministries', MINISTRIES_DEFAULT);

  // Approved gallery images come from our DB; we show the ones tagged for this
  // ministry (the tag is identical to the ministry title).
  const { data: allPhotos } = useQuery({
    queryKey: ['gallery'],
    queryFn: () => apiRequest<GalleryRow[]>('/gallery'),
  });

  const [lightbox, setLightbox] = useState<GalleryRow | null>(null);

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
  const photos = (allPhotos || []).filter((img) => img.tag === ministry.title);

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
        <div className="absolute top-16 right-10 w-40 h-40 bg-amber/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-purple-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link href="/ministries">
            <a className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> All Ministries
            </a>
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="w-20 h-20 bg-white/15 rounded-3xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
              <Icon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white drop-shadow-2xl">{ministry.title}</h1>
          </div>
        </div>
      </section>

      {/* About this ministry */}
      <section className="bg-gradient-to-b from-warm-white to-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-0.5 bg-gradient-to-r from-crimson to-transparent" />
            <span className="text-crimson font-semibold text-sm uppercase tracking-wider">About</span>
          </div>
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

      {/* Photo gallery — only shown when images are tagged for this ministry */}
      {photos.length > 0 && (
        <section className="bg-gradient-to-b from-white to-gray-50 py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="flex justify-center items-center gap-2 mb-4">
                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-crimson" />
                <Camera className="w-6 h-6 text-crimson" />
                <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-crimson" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mb-2">Photo Gallery</h2>
              <p className="text-gray-600">Moments from {ministry.title}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {photos.map((img) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setLightbox(img)}
                  className="group relative aspect-square overflow-hidden rounded-2xl bg-gray-100 shadow-sm hover:shadow-xl transition-all"
                >
                  <img
                    src={img.imageUrl}
                    alt={img.caption || ministry.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    {img.caption && <p className="text-white text-xs font-medium drop-shadow line-clamp-2">{img.caption}</p>}
                  </div>
                </button>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/gallery">
                <a className="inline-flex items-center gap-2 text-crimson font-semibold hover:underline">
                  View full gallery <ArrowRight className="w-4 h-4" />
                </a>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <button
            type="button"
            aria-label="Close"
            className="absolute top-5 right-5 z-10 w-11 h-11 bg-white/15 hover:bg-white/25 rounded-full flex items-center justify-center text-white transition-colors"
            onClick={() => setLightbox(null)}
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative z-10 max-w-3xl max-h-[85vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.imageUrl} alt={lightbox.caption || ministry.title} className="max-w-full max-h-[70vh] rounded-xl object-contain" />
            {lightbox.caption && <p className="text-white/90 text-center mt-3 max-w-2xl text-sm whitespace-pre-line line-clamp-4">{lightbox.caption}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
