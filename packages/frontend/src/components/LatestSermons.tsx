import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Youtube, Play, Clock, ArrowRight } from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface Sermon {
  id: number;
  title: string;
  speaker: string;
  date: string;
  description: string;
  videoUrl: string;
  imageUrl: string | null;
}

function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffInDays <= 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
}

function SermonCard({ sermon, delay }: { sermon: Sermon; delay: number }) {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <a
        href={sermon.videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
      >
        <div className="relative aspect-video bg-gray-200 overflow-hidden">
          <img
            src={sermon.imageUrl || 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800'}
            alt={sermon.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 shadow-2xl">
              <Play className="w-7 h-7 text-white ml-1" fill="white" />
            </div>
          </div>
          <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1 shadow-lg">
            <Youtube className="w-3 h-3" />
            VIDEO
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-clay-700 transition-colors">
            {sermon.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{sermon.description}</p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{timeAgo(sermon.date)}</span>
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

interface LatestSermonsProps {
  title?: string;
  description?: string;
  limit?: number;
}

export function LatestSermons({
  title = 'Latest Messages',
  description = 'Watch our most recent sermons and teachings. Subscribe to never miss a message!',
  limit = 3,
}: LatestSermonsProps) {
  const { ref, isVisible } = useScrollAnimation(0.1);

  const { data: sermons, isLoading } = useQuery({
    queryKey: ['sermons'],
    queryFn: () => apiRequest<Sermon[]>('/sermons'),
  });

  const latest = (sermons ?? []).slice(0, limit);

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-16 relative overflow-hidden">
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
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-3">{title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">{description}</p>
        </div>

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
        ) : latest.length > 0 ? (
          <>
            <div className="grid md:grid-cols-3 gap-6">
              {latest.map((sermon, index) => (
                <SermonCard key={sermon.id} sermon={sermon} delay={index * 100} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/sermons">
                <button className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                  View All Sermons
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No sermons available yet. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
}
