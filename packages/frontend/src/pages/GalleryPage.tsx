import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { useContent } from '@/lib/content';
import { GALLERY_DEFAULT, GALLERY_TAGS, GalleryContent } from '@/lib/site-content';
import { Instagram, X, Camera, ExternalLink } from 'lucide-react';

interface InstaPost {
  id: string;
  caption: string;
  permalink: string;
  imageUrl: string;
}

interface GalleryItem {
  url: string;
  caption: string;
  tag: string;
  permalink: string;
}

const INSTAGRAM_LIMIT = 60;

export function GalleryPage() {
  const page = useContent<GalleryContent>('gallery', GALLERY_DEFAULT);
  const [activeTag, setActiveTag] = useState<string>('All');
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  const { data: ig } = useQuery({
    queryKey: ['instagram'],
    queryFn: () => apiRequest<{ username: string; profilePictureUrl: string; posts: InstaPost[] }>('/social/instagram'),
  });

  // Combine admin-tagged photos with the live Instagram feed.
  const manual: GalleryItem[] = (page.images || []).map((m) => ({ url: m.url, caption: m.caption, tag: m.tag, permalink: '' }));
  const insta: GalleryItem[] = (ig?.posts || [])
    .slice(0, INSTAGRAM_LIMIT)
    .map((p) => ({ url: p.imageUrl, caption: p.caption, tag: 'General', permalink: p.permalink }));
  const items = [...manual, ...insta];

  const usedTags = GALLERY_TAGS.filter((t) => items.some((i) => i.tag === t));
  const filtered = activeTag === 'All' ? items : items.filter((i) => i.tag === activeTag);

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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="flex justify-center mb-4">
            <Camera className="w-10 h-10 text-amber animate-pulse" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-4 text-white drop-shadow-2xl">{page.heroTitle}</h1>
          <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto mb-6">{page.heroSubtitle}</p>
          {page.instagramUrl && (
            <a
              href={page.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white rounded-full px-6 py-3 font-medium transition-colors"
            >
              <Instagram className="w-5 h-5" />
              {ig?.username ? `@${ig.username}` : 'Follow us on Instagram'}
            </a>
          )}
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-gradient-to-b from-warm-white to-white py-16 min-h-[40vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <Camera className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Photos are coming soon. Check back shortly!</p>
            </div>
          ) : (
            <>
              {usedTags.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mb-10">
                  {['All', ...usedTags].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setActiveTag(tag)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        activeTag === tag
                          ? 'bg-crimson text-white shadow-md'
                          : 'bg-white text-gray-600 border border-gray-200 hover:border-crimson/40 hover:text-crimson'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {filtered.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setLightbox(img)}
                    className="group relative aspect-square overflow-hidden rounded-2xl bg-gray-100 shadow-sm hover:shadow-xl transition-all"
                  >
                    <img
                      src={img.url}
                      alt={img.caption || 'Gallery image'}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      {img.caption && <p className="text-white text-xs font-medium drop-shadow line-clamp-2">{img.caption}</p>}
                    </div>
                    {img.tag && img.tag !== 'General' && (
                      <span className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
                        {img.tag.replace(/\s*\(.*\)/, '')}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

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
            <img src={lightbox.url} alt={lightbox.caption || 'Gallery image'} className="max-w-full max-h-[70vh] rounded-xl object-contain" />
            {lightbox.caption && <p className="text-white/90 text-center mt-3 max-w-2xl text-sm whitespace-pre-line line-clamp-4">{lightbox.caption}</p>}
            {lightbox.permalink && (
              <a
                href={lightbox.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white mt-3 text-sm"
              >
                <ExternalLink className="w-4 h-4" /> View on Instagram
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
