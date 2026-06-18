import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { SkeletonGrid } from '@/components/SkeletonLoader';

interface Sermon {
  id: number;
  title: string;
  speaker: string;
  date: string;
  description: string;
  videoUrl: string;
  imageUrl: string | null;
  createdAt: string;
}

interface ContentData {
  youtubeChannelId?: string;
}

export function SermonsPage() {
  const { data: sermons, isLoading } = useQuery({
    queryKey: ['sermons'],
    queryFn: () => apiRequest<Sermon[]>('/sermons'),
  });

  const { data: contentData } = useQuery({
    queryKey: ['content', 'sermons'],
    queryFn: () => apiRequest<{ data: ContentData }>('/content/sermons'),
  });

  const youtubeChannelId = contentData?.data?.youtubeChannelId;

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
            <p className="text-lg text-white/90">
              Watch and grow in faith through our latest messages.
            </p>
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

  return (
    <div>
      {/* Section 1 - Hero with Gradient */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-red-900 via-crimson to-purple-900">
        {/* Video play pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }} />
        </div>

        {/* Floating shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-red-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-red-600/20 backdrop-blur-sm rounded-3xl flex items-center justify-center border-2 border-white/20">
              <Youtube className="w-10 h-10 text-white drop-shadow-lg" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4 text-white drop-shadow-2xl">Sermons</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Watch and grow in faith through our latest messages.
          </p>
        </div>
      </section>

      {/* Section 2 - Video Grid or Setup Prompt */}
      <section className="py-16 bg-gradient-to-b from-warm-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!youtubeChannelId ? (
            /* Unconfigured State */
            <div className="text-center py-16">
              <div className="flex justify-center mb-6">
                <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center">
                  <Youtube className="w-16 h-16 text-gray-300" />
                </div>
              </div>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
                No YouTube channel configured
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Add your YouTube channel ID in the Admin panel under Content › Sermons
              </p>
              <Link href="/admin/content">
                <Button variant="outline" className="border-crimson text-crimson hover:bg-crimson hover:text-white">
                  Go to Content Settings
                </Button>
              </Link>
            </div>
          ) : (
            /* Video Grid */
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sermons?.map((sermon) => (
                <div
                  key={sermon.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                >
                  <div
                    className="relative h-48 bg-gray-300 group cursor-pointer"
                    style={{
                      backgroundImage: sermon.imageUrl
                        ? `url(${sermon.imageUrl})`
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <div className="w-16 h-16 bg-crimson rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute bottom-3 left-3 text-white text-sm font-medium">
                      {new Date(sermon.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-serif font-bold text-gray-900 mb-2 line-clamp-2">
                      {sermon.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">{sermon.speaker}</p>
                    <p className="text-gray-700 text-sm line-clamp-2 mb-4">{sermon.description}</p>
                    <div className="flex gap-2">
                      <a
                        href={sermon.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center bg-crimson text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-crimson-800 transition"
                      >
                        Watch
                      </a>
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
    </div>
  );
}
