import { Instagram, ExternalLink } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

// Mock Instagram posts - In production, you'd fetch from Instagram API or use a service
const mockPosts = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=400&h=400&fit=crop',
    caption: 'Sunday worship was powerful! Join us next week.',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=400&h=400&fit=crop',
    caption: 'Youth group had an amazing time at the retreat!',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    caption: 'Community outreach serving our neighbors with love.',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=400&h=400&fit=crop',
    caption: 'Bible study diving deep into the Word together.',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=400&fit=crop',
    caption: 'Worship night filled with praise and thanksgiving.',
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=400&fit=crop',
    caption: 'Join us this Sunday for a life-changing message!',
  },
];

function AnimatedPost({ post, delay }: { post: typeof mockPosts[0]; delay: number }) {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="group relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer bg-gray-200">
        <img
          src={post.image}
          alt={post.caption}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <p className="text-white text-sm line-clamp-2">{post.caption}</p>
        </div>
        {/* Instagram icon */}
        <div className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ExternalLink className="w-4 h-4 text-crimson" />
        </div>
      </div>
    </div>
  );
}

export function InstagramFeed() {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section className="bg-white py-16 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, #4a1020 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          ref={ref}
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-pink-600 to-amber rounded-xl flex items-center justify-center">
              <Instagram className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-3">
            Follow Our Journey
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Stay connected with our community on Instagram. See what God is doing through our church family!
          </p>
          <a
            href="https://instagram.com/yourchurc"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-crimson hover:text-crimson-800 font-semibold group"
          >
            <Instagram className="w-5 h-5" />
            @yourchurch
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        {/* Instagram Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {mockPosts.map((post, index) => (
            <AnimatedPost key={post.id} post={post} delay={index * 50} />
          ))}
        </div>

        {/* Follow Button */}
        <div className="text-center mt-12">
          <a
            href="https://instagram.com/yourchurch"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-amber hover:shadow-2xl text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105"
          >
            <Instagram className="w-5 h-5" />
            Follow Us on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
