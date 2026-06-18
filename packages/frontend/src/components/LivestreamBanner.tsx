import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { Radio, Clock } from 'lucide-react';

interface ContentData {
  serviceTimes?: string;
  youtubeChannelId?: string;
}

type BannerState = 'live' | 'starting-soon' | 'hidden';

export function LivestreamBanner() {
  const [bannerState, setBannerState] = useState<BannerState>('hidden');
  const [minutesUntilService, setMinutesUntilService] = useState(0);

  const { data: contactData } = useQuery({
    queryKey: ['content', 'contact'],
    queryFn: () => apiRequest<{ data: ContentData }>('/content/contact'),
  });

  const { data: sermonsData } = useQuery({
    queryKey: ['content', 'sermons'],
    queryFn: () => apiRequest<{ data: ContentData }>('/content/sermons'),
  });

  const serviceTime = contactData?.data?.serviceTimes || '10:00 AM';
  const youtubeChannelId = sermonsData?.data?.youtubeChannelId;

  useEffect(() => {
    if (!youtubeChannelId) {
      setBannerState('hidden');
      return;
    }

    const checkServiceTime = () => {
      const now = new Date();
      const currentDay = now.getDay();

      // Only show on Sundays
      if (currentDay !== 0) {
        setBannerState('hidden');
        return;
      }

      // Parse service time
      const [time, period] = serviceTime.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      const hours24 = period === 'PM' && hours !== 12 ? hours + 12 : hours === 12 && period === 'AM' ? 0 : hours;

      const serviceDate = new Date(now);
      serviceDate.setHours(hours24, minutes || 0, 0, 0);

      const diffMs = serviceDate.getTime() - now.getTime();
      const diffMinutes = Math.floor(diffMs / (1000 * 60));

      setMinutesUntilService(diffMinutes);

      // Show "Starting Soon" 30 minutes before service
      if (diffMinutes > 0 && diffMinutes <= 30) {
        setBannerState('starting-soon');
      }
      // Show "Live" during service time (for 2 hours)
      else if (diffMinutes <= 0 && diffMinutes >= -120) {
        setBannerState('live');
      }
      // Hide otherwise
      else {
        setBannerState('hidden');
      }
    };

    checkServiceTime();
    const interval = setInterval(checkServiceTime, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [serviceTime, youtubeChannelId]);

  if (bannerState === 'hidden') {
    return null;
  }

  const getLivestreamUrl = () => {
    if (!youtubeChannelId) return '#';
    return `https://www.youtube.com/channel/${youtubeChannelId}/live`;
  };

  return (
    <a
      href={getLivestreamUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className={`block py-4 text-white transition-colors ${
        bannerState === 'live'
          ? 'bg-red-600 hover:bg-red-700'
          : 'bg-amber hover:bg-amber-600'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-3">
          {bannerState === 'live' ? (
            <>
              <div className="relative flex items-center">
                <Radio className="w-5 h-5 animate-pulse" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping"></span>
              </div>
              <span className="font-bold text-lg">LIVE NOW</span>
              <span className="hidden sm:inline">— Join our Sunday service livestream →</span>
            </>
          ) : (
            <>
              <Clock className="w-5 h-5" />
              <span className="font-bold text-lg">STARTING SOON</span>
              <span className="hidden sm:inline">
                — Service begins in {minutesUntilService} minute{minutesUntilService !== 1 ? 's' : ''} →
              </span>
            </>
          )}
        </div>
      </div>
    </a>
  );
}
