import { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { Calendar, Clock, MapPin, Sparkles } from 'lucide-react';
import { SkeletonGrid } from '@/components/SkeletonLoader';
import { Pagination } from '@/components/Pagination';

const PAST_PAGE_SIZE = 5;

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

function getEventStatus(dateString: string) {
  const eventDate = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const isSameDay = eventDate.toDateString() === today.toDateString();
  const isTomorrow = eventDate.toDateString() === tomorrow.toDateString();
  const isThisWeek = eventDate <= nextWeek && eventDate >= today;

  if (isSameDay) return { label: 'Today', color: 'bg-red-500 text-white', glow: 'shadow-red-500/50' };
  if (isTomorrow) return { label: 'Tomorrow', color: 'bg-amber text-white', glow: 'shadow-amber/50' };
  if (isThisWeek) return { label: 'This Week', color: 'bg-blue-500 text-white', glow: 'shadow-blue-500/50' };
  return { label: 'Upcoming', color: 'bg-gray-600 text-white', glow: 'shadow-gray-600/50' };
}

export function EventsPage() {
  const [pastPage, setPastPage] = useState(1);
  const { data: events, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => apiRequest<Event[]>('/events'),
  });

  if (isLoading) {
    return (
      <div>
        <section className="bg-warm-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl font-serif font-bold text-gray-900 mb-4">Events</h1>
            <p className="text-lg text-gray-600">
              Join us for fellowship, worship, and community.
            </p>
          </div>
        </section>
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <SkeletonGrid count={4} type="event" />
          </div>
        </section>
      </div>
    );
  }

  const now = new Date();
  const upcomingEvents = events?.filter(e => new Date(e.date) >= now) || [];
  const pastEvents = events?.filter(e => new Date(e.date) < now) || [];

  const pastTotalPages = Math.ceil(pastEvents.length / PAST_PAGE_SIZE);
  const pastCurrentPage = Math.min(pastPage, Math.max(1, pastTotalPages));
  const pagedPastEvents = pastEvents.slice((pastCurrentPage - 1) * PAST_PAGE_SIZE, pastCurrentPage * PAST_PAGE_SIZE);

  return (
    <div>
      {/* Section 1 - Hero with Calendar Pattern */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-purple-900 via-crimson to-crimson-900">
        {/* Calendar grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }} />
        </div>

        {/* Floating shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-amber/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Calendar className="w-8 h-8 text-amber" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-4 drop-shadow-2xl">Events</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Join us for fellowship, worship, and community.
          </p>
        </div>
      </section>

      {/* Section 2 - Upcoming Events */}
      <section className="py-16 bg-gradient-to-b from-warm-white to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-gradient-to-b from-crimson to-amber rounded-full" />
            <h2 className="text-4xl font-serif font-bold text-gray-900">Upcoming Events</h2>
          </div>

          <div className="space-y-6">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => {
                const status = getEventStatus(event.date);
                return (
                  <Link key={event.id} href={`/events/${event.id}`}>
                  <a
                    className="group relative block bg-white rounded-3xl border-2 border-gray-100 hover:border-crimson/30 p-8 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                  >
                    {/* Gradient glow on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-crimson/5 to-amber/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="relative z-10">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        {/* Status Badge */}
                        <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${status.color} ${status.glow} shadow-lg animate-pulse`}>
                          {status.label}
                        </span>

                        {/* Date */}
                        <div className="flex items-center gap-2 bg-amber/10 text-amber-700 px-4 py-1.5 rounded-full font-semibold">
                          <Calendar className="w-4 h-4" />
                          {new Date(event.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>

                      <h3 className="text-3xl font-serif font-bold text-gray-900 mb-4 group-hover:text-crimson transition-colors">
                        {event.title}
                      </h3>

                      <div className="flex flex-wrap gap-4 mb-4 text-gray-700">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-crimson/10 rounded-lg flex items-center justify-center">
                            <Clock className="w-4 h-4 text-crimson" />
                          </div>
                          <span className="font-medium">{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-purple-600/10 rounded-lg flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-purple-600" />
                          </div>
                          <span className="font-medium">{event.location}</span>
                        </div>
                      </div>

                      <p className="text-gray-700 leading-relaxed text-lg">{event.description}</p>
                    </div>

                    {/* Decorative corner */}
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-tl from-crimson/10 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500" />
                  </a>
                  </Link>
                );
              })
            ) : (
              <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-gray-300">
                <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No upcoming events at this time.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section 3 - Past Events */}
      {pastEvents.length > 0 && (
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-8 bg-gradient-to-b from-gray-400 to-gray-600 rounded-full" />
              <h2 className="text-4xl font-serif font-bold text-gray-900">Past Events</h2>
            </div>

            <div className="space-y-6">
              {pagedPastEvents.map((event) => (
                <Link key={event.id} href={`/events/${event.id}`}>
                <a
                  className="block bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-gray-200 p-8 opacity-75 hover:opacity-100 transition-opacity duration-300"
                >
                  <div className="flex items-start gap-2 mb-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                    <p className="text-gray-600 font-semibold">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>

                  <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">
                    {event.title}
                  </h3>

                  <div className="flex flex-wrap gap-4 mb-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed">{event.description}</p>
                </a>
                </Link>
              ))}
            </div>
            <Pagination page={pastCurrentPage} totalPages={pastTotalPages} onChange={setPastPage} />
          </div>
        </section>
      )}
    </div>
  );
}
