// React hooks for component state
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { ServiceCountdown } from '@/components/ServiceCountdown';
import { LivestreamBanner } from '@/components/LivestreamBanner';
import { InstagramFeedEnhanced } from '@/components/InstagramFeedEnhanced';
import { LatestSermons } from '@/components/LatestSermons';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Clock, MapPin, ArrowRight, Sparkles, BookOpen, Heart, Users } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface HeroData {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
}

interface Announcement {
  id: number;
  title: string;
  body: string;
  active: boolean;
  createdAt: string;
}

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string | null;
}

// Sermon interface removed - not used on home page

function AnimatedCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function HomePage() {

  const { data: heroData } = useQuery({
    queryKey: ['content', 'home.hero'],
    queryFn: () => apiRequest<{ data: HeroData }>('/content/home.hero'),
  });

  const { data: announcements } = useQuery({
    queryKey: ['announcements'],
    queryFn: () => apiRequest<Announcement[]>('/announcements'),
  });

  const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: () => apiRequest<Event[]>('/events'),
  });

  // Sermons query removed - not used on home page

  const hero = heroData?.data;
  const latestAnnouncement = announcements?.find(a => a.active);
  const upcomingEvents = events?.slice(0, 3) || [];

  return (
    <div className="overflow-hidden">
      {/* Section 1 - Enhanced Hero with Potter's Theme */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(61, 33, 16, 0.7), rgba(139, 69, 19, 0.6)), url(${hero?.backgroundImage || 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1920'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Animated pottery shards/particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-gold-300/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${8 + Math.random() * 12}s`,
              }}
            />
          ))}
        </div>

        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-clay-900/20 to-royal-950/80" />

        <div className="text-center text-white px-4 max-w-6xl relative z-10 animate-fade-in-up">
          {/* Potter's symbol */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gold-400 blur-2xl opacity-50 animate-pulse" />
              <div className="relative w-20 h-20 bg-gradient-to-br from-gold-300 to-gold-600 rounded-full flex items-center justify-center shadow-2xl">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 leading-tight drop-shadow-2xl">
            {hero?.title || "Welcome to The Potters' Apostolic Ministries"}
          </h1>

          <p className="text-xl sm:text-2xl md:text-3xl mb-8 font-light drop-shadow-lg max-w-4xl mx-auto leading-relaxed">
            {hero?.subtitle || 'Molded by the Master Potter, Transforming Lives Through Apostolic Ministry'}
          </p>

          {/* Scripture verse */}
          <div className="mb-10 inline-block">
            <p className="text-gold-200 text-lg md:text-xl italic font-serif border-l-4 border-gold-400 pl-4 py-2">
              "We are the clay, You are the Potter; we are all the work of Your hand."
              <span className="block text-sm mt-1 text-gold-300">— Isaiah 64:8</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href={hero?.ctaLink || '/visit'}>
              <Button size="lg" className="bg-gradient-to-r from-royal-600 to-royal-800 hover:from-royal-700 hover:to-royal-900 text-white rounded-full px-8 md:px-10 py-6 md:py-7 text-lg md:text-xl font-semibold group hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-royal-500/50">
                {hero?.ctaText || 'Join Us This Sunday'}
                <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/sermons">
              <Button size="lg" className="border-2 border-white/80 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm rounded-full px-8 md:px-10 py-6 md:py-7 text-lg md:text-xl font-semibold group transition-all duration-300 shadow-lg">
                Watch Sermons
                <Sparkles className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Stats bar */}
          <div className="mt-12 sm:mt-16 grid grid-cols-3 gap-3 sm:gap-6 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20">
              <Users className="w-7 h-7 sm:w-8 sm:h-8 text-gold-300 mx-auto mb-2" />
              <p className="text-2xl sm:text-3xl font-bold text-white">500+</p>
              <p className="text-gold-200 text-xs sm:text-sm">Members</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20">
              <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-gold-300 mx-auto mb-2" />
              <p className="text-2xl sm:text-3xl font-bold text-white">20+</p>
              <p className="text-gold-200 text-xs sm:text-sm">Years Serving</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20">
              <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-gold-300 mx-auto mb-2" />
              <p className="text-2xl sm:text-3xl font-bold text-white">100+</p>
              <p className="text-gold-200 text-xs sm:text-sm">Lives Changed</p>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2" />
          </div>
        </div>
      </section>

      {/* Livestream Banner */}
      <LivestreamBanner />

      {/* Section 2 - Service Countdown */}
      <ServiceCountdown />

      {/* Section 3 - Announcement Banner */}
      {latestAnnouncement && (
        <section className="bg-gradient-to-r from-royal-700 via-clay-600 to-royal-700 text-white py-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-bronze-400/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }} />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <span className="inline-block bg-gradient-to-r from-gold-400 to-gold-600 text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wide shadow-lg animate-pulse">
                  Latest News
                </span>
                <div>
                  <h3 className="font-bold text-xl mb-1">{latestAnnouncement.title}</h3>
                  <p className="text-white/90 hidden md:block text-lg">{latestAnnouncement.body}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Section 4 - Upcoming Events */}
      <section className="bg-gradient-to-b from-potter-cream to-warm-white py-12 sm:py-20 relative">
        {/* Background accent */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-royal-200/30 to-transparent rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedCard>
            <div className="flex justify-between items-end mb-12">
              <div>
                <p className="text-royal-700 text-sm font-semibold uppercase tracking-wider mb-3 flex items-center gap-3">
                  <span className="w-12 h-0.5 bg-gradient-to-r from-royal-600 to-gold-500"></span>
                  Join Us
                </p>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold bg-gradient-to-r from-royal-800 to-royal-600 bg-clip-text text-transparent">
                  Upcoming Events
                </h2>
              </div>
              <Link href="/events">
                <a className="text-royal-700 hover:text-royal-900 font-semibold hidden md:inline-flex items-center group text-lg">
                  View All Events
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Link>
            </div>
          </AnimatedCard>

          <div className="grid md:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <AnimatedCard key={event.id} delay={index * 150}>
                <Link href={`/events/${event.id}`}>
                <a className="block bg-white rounded-3xl border border-royal-200/50 overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 group cursor-pointer">
                  {event.imageUrl && (
                    <div className="h-56 bg-gradient-to-br from-royal-200 to-gold-200 overflow-hidden relative">
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-royal-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  )}
                  <div className="p-7">
                    <span className="inline-block bg-gradient-to-r from-gold-100 to-gold-200 text-gold-800 text-sm font-bold px-4 py-2 rounded-full mb-4 group-hover:from-gold-500 group-hover:to-gold-600 group-hover:text-white transition-all duration-300 shadow-sm">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3 group-hover:text-royal-700 transition-colors leading-tight">
                      {event.title}
                    </h3>
                    <div className="space-y-2 mb-4 text-gray-600">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-royal-600" />
                        <span className="font-medium">{event.time}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-royal-600" />
                        <span className="font-medium">{event.location}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 line-clamp-2 leading-relaxed">{event.description}</p>
                  </div>
                </a>
                </Link>
              </AnimatedCard>
            ))}
          </div>

          <div className="mt-10 text-center md:hidden">
            <Link href="/events">
              <Button variant="outline" className="border-2 border-royal-600 text-royal-700 hover:bg-royal-700 hover:text-white group rounded-full px-8 py-6 text-lg">
                View All Events
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 5 - Latest Sermons (from the sermons DB) */}
      <LatestSermons
        title="Latest Messages"
        description="Watch our most recent sermons and teachings. Subscribe to never miss a message!"
        limit={3}
      />

      {/* Section 6 - Instagram Feed */}
      <InstagramFeedEnhanced />

      {/* Section 7 - Call to Action */}
      <section className="relative py-16 sm:py-24 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(139, 69, 19, 0.95), rgba(61, 33, 16, 0.95)), url(https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1920)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <AnimatedCard>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center shadow-2xl">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              Ready to Take the Next Step?
            </h2>
            <p className="text-xl text-gold-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              We'd love to meet you! Join us this Sunday and experience the transforming power of God's presence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/visit">
                <Button size="lg" className="bg-white text-royal-800 hover:bg-gold-50 rounded-full px-10 py-7 text-xl font-bold shadow-2xl hover:scale-105 transition-all">
                  Plan Your Visit
                  <ArrowRight className="ml-2 w-6 h-6" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" className="border-2 border-white bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm rounded-full px-10 py-7 text-xl font-bold shadow-lg">
                  Learn More About Us
                </Button>
              </Link>
            </div>
          </AnimatedCard>
        </div>
      </section>
    </div>
  );
}
