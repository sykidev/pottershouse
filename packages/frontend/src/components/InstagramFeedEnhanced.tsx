import { useQuery } from '@tanstack/react-query';
import { Instagram, ExternalLink, Heart, MessageCircle } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { apiRequest } from '@/lib/api';
// Skeleton loader handled inline

interface InstagramPost {
  id: string;
  media_url: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  caption?: string;
  permalink: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
  thumbnail_url?: string;
}

interface InstagramFeedData {
  username: string;
  profileUrl: string;
  posts: InstagramPost[];
}

interface GalleryRow {
  id: number;
  imageUrl: string;
  caption: string;
  permalink: string | null;
  mediaType: string | null;
  status: string;
}

const HOME_FEED_LIMIT = 12;

// Pulls approved gallery images from our own DB (synced from Instagram in the
// admin). No live Instagram/FeedFramer call happens on a page visit.
async function fetchInstagramFeed(): Promise<InstagramFeedData> {
  type GalleryContentResp = { data: { igUsername?: string; instagramUrl?: string } };
  const [rows, content] = await Promise.all([
    apiRequest<GalleryRow[]>('/gallery'),
    apiRequest<GalleryContentResp>('/content/gallery').catch((): GalleryContentResp => ({ data: {} })),
  ]);

  const username = content.data?.igUsername || 'thepottersapostolicministries';
  const profileUrl = content.data?.instagramUrl || `https://instagram.com/${username}`;

  const posts: InstagramPost[] = rows.slice(0, HOME_FEED_LIMIT).map((r) => ({
    id: String(r.id),
    media_url: r.imageUrl,
    media_type: (r.mediaType as InstagramPost['media_type']) || 'IMAGE',
    caption: r.caption,
    permalink: r.permalink || profileUrl,
    timestamp: '',
  }));

  return { username, profileUrl, posts };
}

function AnimatedPost({ post, delay }: { post: InstagramPost; delay: number }) {
  const { ref, isVisible } = useScrollAnimation(0.1);

  const mediaUrl = post.media_type === 'VIDEO' ? post.thumbnail_url || post.media_url : post.media_url;

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <a
        href={post.permalink}
        target="_blank"
        rel="noopener noreferrer"
        className="group block relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer bg-gray-200"
      >
        <img
          src={mediaUrl}
          alt={post.caption?.slice(0, 100) || 'Instagram post'}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Video indicator */}
        {post.media_type === 'VIDEO' && (
          <div className="absolute top-3 right-3 w-8 h-8 bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          </div>
        )}

        {/* Carousel indicator */}
        {post.media_type === 'CAROUSEL_ALBUM' && (
          <div className="absolute top-3 right-3 w-8 h-8 bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2" />
              <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2" />
              <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2" />
              <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2" />
            </svg>
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          {/* Engagement stats */}
          {(post.like_count || post.comments_count) && (
            <div className="flex items-center gap-4 mb-2 text-white text-sm font-medium">
              {post.like_count && (
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span>{post.like_count.toLocaleString()}</span>
                </div>
              )}
              {post.comments_count && (
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.comments_count}</span>
                </div>
              )}
            </div>
          )}

          {/* Caption preview */}
          <p className="text-white text-sm line-clamp-2">
            {post.caption || 'View on Instagram'}
          </p>
        </div>

        {/* Instagram icon */}
        <div className="absolute top-3 left-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ExternalLink className="w-4 h-4 text-clay-700" />
        </div>
      </a>
    </div>
  );
}

export function InstagramFeedEnhanced() {
  const { ref, isVisible } = useScrollAnimation(0.1);

  const { data: feedData, isLoading, error } = useQuery({
    queryKey: ['instagram-feed'],
    queryFn: fetchInstagramFeed,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  return (
    <section className="bg-gradient-to-b from-white via-potter-cream to-white py-16 relative overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, #8B4513 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }} />
      </div>

      {/* Pottery shard accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-clay-200/20 to-bronze-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-glaze-200/20 to-clay-200/20 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          ref={ref}
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-pink-600 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
              <Instagram className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-3">
            Follow Our Journey
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Stay connected with our community on Instagram. See what the Potter is doing through our ministry!
          </p>
          {feedData && (
            <a
              href={feedData.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-clay-700 hover:text-clay-900 font-semibold group"
            >
              <Instagram className="w-5 h-5" />
              @{feedData.username}
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          )}
        </div>

        {/* Instagram Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square">
                <div className="w-full h-full rounded-2xl bg-gray-200 animate-pulse" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Unable to load Instagram feed. Please visit us on Instagram!</p>
          </div>
        ) : feedData && feedData.posts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {feedData.posts.map((post, index) => (
              <AnimatedPost key={post.id} post={post} delay={index * 50} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Follow us on Instagram for the latest photos!</p>
          </div>
        )}

        {/* Follow Button */}
        {feedData && (
          <div className="text-center mt-12">
            <a
              href={feedData.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:shadow-2xl text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105"
            >
              <Instagram className="w-5 h-5" />
              Follow Us on Instagram
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
