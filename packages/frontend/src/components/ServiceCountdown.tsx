import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { Clock } from 'lucide-react';

interface ContentData {
  serviceTimes?: string;
  mapUrl?: string;
}

export function ServiceCountdown() {
  const { data } = useQuery({
    queryKey: ['content', 'contact'],
    queryFn: () => apiRequest<{ data: ContentData }>('/content/contact'),
  });

  const serviceTime = data?.data?.serviceTimes || '10:00 AM';

  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    mins: 0,
    secs: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentDay = now.getDay();
      const daysUntilSunday = currentDay === 0 ? 7 : 7 - currentDay;

      const nextSunday = new Date(now);
      nextSunday.setDate(now.getDate() + daysUntilSunday);

      const [time, period] = serviceTime.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      const hours24 = period === 'PM' && hours !== 12 ? hours + 12 : hours === 12 && period === 'AM' ? 0 : hours;

      nextSunday.setHours(hours24, minutes || 0, 0, 0);

      const diff = nextSunday.getTime() - now.getTime();

      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / (1000 * 60)) % 60),
        secs: Math.floor((diff / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [serviceTime]);

  return (
    <section className="bg-gradient-to-r from-royal-600 via-royal-700 to-royal-600 text-white py-12 relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          animation: 'float 20s linear infinite'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="w-5 h-5 animate-pulse" />
            <p className="text-sm font-semibold uppercase tracking-wider">
              Next Sunday Service
            </p>
          </div>
          <p className="text-xl font-medium mb-8">{serviceTime} — join us in worship</p>

          {/* Countdown Boxes with flip animation */}
          <div className="flex justify-center gap-2 sm:gap-4 mb-6 md:mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl px-3 sm:px-6 py-3 sm:py-4 min-w-[70px] sm:min-w-[90px] hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-default border border-white/20 shadow-lg">
              <div className="text-2xl sm:text-4xl font-mono font-bold tabular-nums">{String(countdown.days).padStart(2, '0')}</div>
              <div className="text-xs uppercase tracking-wide mt-1 opacity-90">Days</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl px-3 sm:px-6 py-3 sm:py-4 min-w-[70px] sm:min-w-[90px] hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-default border border-white/20 shadow-lg">
              <div className="text-2xl sm:text-4xl font-mono font-bold tabular-nums">{String(countdown.hours).padStart(2, '0')}</div>
              <div className="text-xs uppercase tracking-wide mt-1 opacity-90">Hours</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl px-3 sm:px-6 py-3 sm:py-4 min-w-[70px] sm:min-w-[90px] hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-default border border-white/20 shadow-lg">
              <div className="text-2xl sm:text-4xl font-mono font-bold tabular-nums">{String(countdown.mins).padStart(2, '0')}</div>
              <div className="text-xs uppercase tracking-wide mt-1 opacity-90">Mins</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl px-3 sm:px-6 py-3 sm:py-4 min-w-[70px] sm:min-w-[90px] hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-default border border-white/20 shadow-lg">
              <div className="text-2xl sm:text-4xl font-mono font-bold tabular-nums">{String(countdown.secs).padStart(2, '0')}</div>
              <div className="text-xs uppercase tracking-wide mt-1 opacity-90">Secs</div>
            </div>
          </div>

          <Link href="/visit">
            <a className="inline-flex items-center gap-2 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 border border-white/30 hover:border-white/50 px-6 py-3 rounded-full transition-all duration-300 font-medium hover:scale-105 shadow-lg backdrop-blur-sm group">
              Get directions
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
}
