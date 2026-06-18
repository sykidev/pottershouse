import { useRoute, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { Calendar, Clock, MapPin, ArrowLeft, ArrowRight } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string | null;
  createdAt: string;
}

export function EventDetailPage() {
  const [, params] = useRoute('/events/:id');
  const id = params?.id;

  const { data: event, isLoading, isError } = useQuery({
    queryKey: ['events', id],
    queryFn: () => apiRequest<Event>(`/events/${id}`),
    enabled: !!id,
  });

  if (isLoading) {
    return <div className="max-w-3xl mx-auto px-4 py-24 text-center text-gray-500">Loading…</div>;
  }

  if (isError || !event) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">Event not found</h1>
        <Link href="/events">
          <a className="text-crimson font-semibold hover:underline">← Back to Events</a>
        </Link>
      </div>
    );
  }

  const dateLabel = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-crimson to-crimson-900">
        {event.imageUrl && (
          <div className="absolute inset-0">
            <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover opacity-25" />
          </div>
        )}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Link href="/events">
            <a className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> All Events
            </a>
          </Link>
          <span className="inline-flex items-center gap-2 bg-amber/20 text-amber-100 px-4 py-1.5 rounded-full font-semibold text-sm mb-4">
            <Calendar className="w-4 h-4" />
            {dateLabel}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white drop-shadow-2xl">{event.title}</h1>
        </div>
      </section>

      {/* Details */}
      <section className="bg-gradient-to-b from-warm-white to-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {event.imageUrl && (
            <img src={event.imageUrl} alt={event.title} className="w-full rounded-3xl shadow-lg mb-8 object-cover max-h-96" />
          )}

          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-3">
              <Clock className="w-5 h-5 text-crimson" />
              <span className="font-medium text-gray-800">{event.time}</span>
            </div>
            <div className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-3">
              <MapPin className="w-5 h-5 text-crimson" />
              <span className="font-medium text-gray-800">{event.location}</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 md:p-10">
            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">{event.description}</p>
          </div>

          <div className="mt-10">
            <Link href="/visit">
              <a className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-crimson to-crimson-800 text-white px-8 py-4 rounded-2xl font-semibold hover:scale-105 transition-transform shadow-lg">
                Plan Your Visit
                <ArrowRight className="w-5 h-5" />
              </a>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
