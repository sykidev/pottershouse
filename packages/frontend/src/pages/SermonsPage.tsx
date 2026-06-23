import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { GALLERY_TAGS } from '@/lib/site-content';
import { Youtube, Play, X } from 'lucide-react';
import { SkeletonGrid } from '@/components/SkeletonLoader';
import { Pagination } from '@/components/Pagination';

const PAGE_SIZE = 6;

interface Sermon {
  id: number;
  title: string;
  speaker: string;
  date: string;
  description: string;
  videoUrl: string;
  imageUrl: string | null;
  tag: string;
  createdAt: string;
}

interface ContentData {
  youtubeChannelId?: string;
}

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|live\/|v\/))([\w-]{11})/);
  return m ? m[1] : null;
}

export function SermonsPage() {
  const [playing, setPlaying] = useState<Sermon | null>(null);
  const [activeTag, setActiveTag] = useState<string>('All');
  const [page, setPage] = useState(1);

  const { data: sermons, isLoading } = useQuery({
    queryKey: ['sermons'],
    queryFn: () => apiRequest<Sermon[]>('/sermons'),
  });

  const { data: contentData } = useQuery({
    queryKey: ['content', 'sermons'],
    queryFn: () => apiRequest<{ data: ContentData }>('/content/sermons'),
  });

  const youtubeChannelId = contentData?.data?.youtubeChannelId;

  // Tag filtering reuses the gallery tag set; only show tags that have sermons.
  // 'General' is the catch-all tag — identical to the "All" filter, so omit it here.
  const usedTags = GALLERY_TAGS.filter((t) => t !== 'General' && sermons?.some((s) => s.tag === t));
  const filtered = activeTag === 'All' ? sermons ?? [] : (sermons ?? []).filter((s) => s.tag === activeTag);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const currentPage = Math.min(page, Math.max(1, totalPages));
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  if (isLoading) {
    return (
      <div>
        <section className="bg-crimson text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                <Youtube className="w-8 h-8" />
              </div>
            </div>
            <h1 className="text-5xl font-serif font-bold mb-4">Sermons</h1>
            <p className="text-lg text-white/90">Watch and grow in faith through our latest messages.</p>
          </div>
        </section>
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SkeletonGrid count={6} />
          </div>
        </section>
      </div>
    );
  }

  const playingId = playing ? getYouTubeId(playing.videoUrl) : null;

  return (
    <div>
      {/* Hero */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-red-900 via-crimson to-purple-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }} />
        </div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-red-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-red-600/20 backdrop-blur-sm rounded-3xl flex items-center justify-center border-2 border-white/20">
              <Youtube className="w-10 h-10 text-white drop-shadow-lg" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-4 text-white drop-shadow-2xl">Sermons</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Watch and grow in faith through our latest messages.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 bg-gradient-to-b from-warm-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!sermons || sermons.length === 0 ? (
            <div className="text-center py-16">
              <div className="flex justify-center mb-6">
                <div className="w-28 h-28 bg-gray-100 rounded-full flex items-center justify-center">
                  <Youtube className="w-14 h-14 text-gray-300" />
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mb-3">No sermons yet</h2>
              <p className="text-gray-600 max-w-md mx-auto">Check back soon — messages will appear here.</p>
            </div>
          ) : (
            <>
              {usedTags.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mb-10">
                  {['All', ...usedTags].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => { setActiveTag(t); setPage(1); }}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        activeTag === t
                          ? 'bg-crimson text-white shadow'
                          : 'bg-white text-gray-600 border border-gray-200 hover:text-crimson hover:border-crimson'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {paged.map((sermon) => (
                <div
                  key={sermon.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col"
                >
                  <button
                    type="button"
                    onClick={() => setPlaying(sermon)}
                    className="relative h-48 bg-gray-300 group text-left"
                    style={{
                      backgroundImage: sermon.imageUrl
                        ? `url(${sermon.imageUrl})`
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <div className="w-16 h-16 bg-crimson rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-7 h-7 text-white ml-1" fill="currentColor" />
                      </div>
                    </div>
                    <div className="absolute bottom-3 left-3 text-white text-sm font-medium drop-shadow">
                      {new Date(sermon.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </button>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-serif font-bold text-gray-900 mb-2 line-clamp-2">{sermon.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{sermon.speaker}</p>
                    <p className="text-gray-700 text-sm line-clamp-2 mb-4">{sermon.description}</p>
                    <div className="flex gap-2 mt-auto">
                      <button
                        type="button"
                        onClick={() => setPlaying(sermon)}
                        className="flex-1 text-center bg-crimson text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-crimson-800 transition"
                      >
                        Watch
                      </button>
                      <a
                        href={sermon.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium hover:border-crimson hover:text-crimson transition"
                      >
                        YouTube
                      </a>
                    </div>
                  </div>
                </div>
              ))}
              </div>
              {filtered.length === 0 && (
                <p className="text-center text-gray-500 py-12">No sermons in this category yet.</p>
              )}
              <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />
            </>
          )}

          {youtubeChannelId && sermons && sermons.length > 0 && (
            <div className="text-center mt-12">
              <a
                href={`https://youtube.com/channel/${youtubeChannelId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-full font-medium hover:bg-red-700 transition"
              >
                <Youtube className="w-5 h-5" />
                Subscribe on YouTube
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Embedded player */}
      {playing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setPlaying(null)}>
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />
          <button
            type="button"
            aria-label="Close"
            onClick={() => setPlaying(null)}
            className="absolute top-5 right-5 z-10 w-11 h-11 bg-white/15 hover:bg-white/25 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative z-10 w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-black shadow-2xl">
              {playingId ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${playingId}?autoplay=1`}
                  title={playing.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/80">
                  Unable to load video. <a className="underline ml-1" href={playing.videoUrl} target="_blank" rel="noopener noreferrer">Open on YouTube</a>
                </div>
              )}
            </div>
            <p className="text-white font-medium mt-3">{playing.title}</p>
          </div>
        </div>
      )}
    </div>
  );
}
