import { useQuery } from '@tanstack/react-query';
import { Youtube, Play, Clock, TrendingUp } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
// Skeleton loader not needed - using inline skeleton

interface YouTubeVideo {
  videoId: string;
  title: string;
  published: string;
  thumbnail: string;
  description: string;
  url: string;
}

interface YouTubeChannelData {
  channelTitle: string;
  videos: YouTubeVideo[];
}

async function fetchYouTubeVideos(channelId: string): Promise<YouTubeChannelData> {
  // This would call your backend endpoint: GET /api/sermons/youtube?channelId=...
  const response = await fetch(`/api/sermons/youtube?channelId=${channelId}`);
  if (!response.ok) throw new Error('Failed to fetch YouTube videos');
  return response.json();
}

function AnimatedVideo({ video, delay }: { video: YouTubeVideo; delay: number }) {
  const { ref, isVisible } = useScrollAnimation(0.1);

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <a
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
      >
        {/* Thumbnail */}
        <div className="relative aspect-video bg-gray-200 overflow-hidden">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Play button overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 shadow-2xl">
              <Play className="w-7 h-7 text-white ml-1" fill="white" />
            </div>
          </div>

          {/* YouTube badge */}
          <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1 shadow-lg">
            <Youtube className="w-3 h-3" />
            VIDEO
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-clay-700 transition-colors">
            {video.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {video.description}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{timeAgo(video.published)}</span>
            </div>
            <div className="flex items-center gap-1 text-red-600 font-medium">
              <Play className="w-3 h-3" />
              Watch Now
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}

interface YouTubeChannelProps {
  channelId: string;
  title?: string;
  description?: string;
  limit?: number;
  showChannelLink?: boolean;
}

export function YouTubeChannel({
  channelId,
  title = 'Latest Sermons on YouTube',
  description = 'Watch our latest messages and subscribe for more',
  limit = 3,
  showChannelLink = true,
}: YouTubeChannelProps) {
  const { ref, isVisible } = useScrollAnimation(0.1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['youtube-videos', channelId],
    queryFn: () => fetchYouTubeVideos(channelId),
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  const videos = data?.videos?.slice(0, limit) || [];

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-16 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-red-100/50 to-transparent rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          ref={ref}
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-lg">
              <Youtube className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-3">
            {title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            {description}
          </p>
          {showChannelLink && data?.channelTitle && (
            <a
              href={`https://youtube.com/channel/${channelId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold group"
            >
              <Youtube className="w-5 h-5" />
              {data.channelTitle}
              <TrendingUp className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          )}
        </div>

        {/* Videos Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(limit)].map((_, i) => (
              <div key={i}>
                <div className="aspect-video rounded-2xl mb-4 bg-gray-200 animate-pulse" />
                <div className="h-6 w-3/4 mb-2 rounded bg-gray-200 animate-pulse" />
                <div className="h-4 w-full mb-1 rounded bg-gray-200 animate-pulse" />
                <div className="h-4 w-2/3 rounded bg-gray-200 animate-pulse" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <Youtube className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Unable to load videos. Please visit our YouTube channel!</p>
            {showChannelLink && (
              <a
                href={`https://youtube.com/channel/${channelId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-red-600 hover:text-red-700 font-semibold"
              >
                Visit YouTube Channel →
              </a>
            )}
          </div>
        ) : videos.length > 0 ? (
          <>
            <div className="grid md:grid-cols-3 gap-6">
              {videos.map((video, index) => (
                <AnimatedVideo key={video.videoId} video={video} delay={index * 100} />
              ))}
            </div>

            {/* Subscribe Button */}
            {showChannelLink && (
              <div className="text-center mt-12">
                <a
                  href={`https://youtube.com/channel/${channelId}?sub_confirmation=1`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Youtube className="w-5 h-5" />
                  Subscribe on YouTube
                </a>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No videos available yet. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
}
