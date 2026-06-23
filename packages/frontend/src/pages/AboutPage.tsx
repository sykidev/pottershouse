import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { Target, Eye, Sparkles, Heart, CheckCircle2, X } from 'lucide-react';

interface AboutData {
  title?: string;
  mission?: string;
  vision?: string;
  history?: string;
  values?: string[];
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  imageUrl: string | null;
  createdAt: string;
}

interface AboutCard {
  id: number;
  type: 'story' | 'vision' | 'mission';
  title: string;
  shortDescription: string;
  fullDescription: string;
  year: string | null;
  icon: string | null;
  orderIndex: number;
  createdAt: string;
}

export function AboutPage() {
  const [expandedMember, setExpandedMember] = useState<number | null>(null);
  const [expandedCard, setExpandedCard] = useState<'vision' | 'mission' | null>(null);

  const { data: aboutData } = useQuery({
    queryKey: ['content', 'about'],
    queryFn: () => apiRequest<{ data: AboutData }>('/content/about'),
  });

  const { data: team } = useQuery({
    queryKey: ['team'],
    queryFn: () => apiRequest<TeamMember[]>('/team'),
  });

  const { data: aboutCards } = useQuery({
    queryKey: ['about-cards'],
    queryFn: () => apiRequest<AboutCard[]>('/about-cards'),
  });

  const about = aboutData?.data;
  const storyCards = aboutCards?.filter(card => card.type === 'story') || [];
  const visionCard = aboutCards?.find(card => card.type === 'vision');
  const missionCard = aboutCards?.find(card => card.type === 'mission');

  return (
    <div>
      {/* Section 1 - Hero with Gradient */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-royal-700 via-royal-800 to-purple-900">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />
        </div>

        {/* Floating shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gold-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="flex justify-center mb-4">
            <Sparkles className="w-10 h-10 text-gold-400 animate-pulse" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white mb-4 drop-shadow-2xl">
            {about?.title || 'About Us'}
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Get to know our history, our mission, and the people who serve our community.
          </p>
        </div>
      </section>

      {/* Section 2 - Our Story */}
      <section className="relative bg-gradient-to-b from-warm-white via-white to-royal-50/30 py-20 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-royal-400/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gold-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-royal-600 to-royal-600" />
              <Sparkles className="w-8 h-8 text-royal-600 animate-pulse" />
              <div className="w-16 h-0.5 bg-gradient-to-l from-transparent via-royal-600 to-royal-600" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold bg-gradient-to-r from-royal-700 via-purple-600 to-royal-700 bg-clip-text text-transparent mb-3">
              Our Story
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              A journey of faith, purpose, and divine calling
            </p>
          </div>

          {/* Timeline Container */}
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-royal-300 via-purple-400 to-royal-300 transform -translate-x-1/2 hidden md:block" />

            {/* Timeline Events */}
            <div className="space-y-12">
              {storyCards.map((card, index) => {
                const isLeft = index % 2 === 0;
                const colors = [
                  { border: 'border-royal-200 hover:border-royal-400', badge: 'from-royal-600 to-purple-600', dot: 'from-royal-600 to-purple-600' },
                  { border: 'border-gold-200 hover:border-gold-400', badge: 'from-gold-600 to-amber-600', dot: 'from-gold-600 to-amber-600' },
                  { border: 'border-purple-200 hover:border-purple-400', badge: 'from-purple-600 to-royal-600', dot: 'from-purple-600 to-royal-600' },
                ];
                const color = colors[index % colors.length];

                return (
                  <div key={card.id} className="relative grid md:grid-cols-2 gap-8 items-center">
                    {isLeft ? (
                      <>
                        <div className="md:text-right">
                          <div className={`bg-white rounded-3xl p-8 shadow-xl border-2 ${color.border} transition-all duration-300 hover:shadow-2xl hover:scale-105`}>
                            {card.year && (
                              <div className={`inline-block bg-gradient-to-r ${color.badge} text-white text-sm font-bold px-4 py-2 rounded-full mb-4`}>
                                {card.year}
                              </div>
                            )}
                            <h3 className="text-2xl font-serif font-bold text-royal-700 mb-3">
                              {card.title}
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                              {card.shortDescription}
                            </p>
                          </div>
                        </div>
                        <div className="hidden md:block" />
                      </>
                    ) : (
                      <>
                        <div className="hidden md:block" />
                        <div className="md:text-left">
                          <div className={`bg-white rounded-3xl p-8 shadow-xl border-2 ${color.border} transition-all duration-300 hover:shadow-2xl hover:scale-105`}>
                            {card.year && (
                              <div className={`inline-block bg-gradient-to-r ${color.badge} text-white text-sm font-bold px-4 py-2 rounded-full mb-4`}>
                                {card.year}
                              </div>
                            )}
                            <h3 className="text-2xl font-serif font-bold text-royal-700 mb-3">
                              {card.title}
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                              {card.shortDescription}
                            </p>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Center Dot */}
                    <div className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-gradient-to-br ${color.dot} rounded-full border-4 border-white shadow-lg ${index === storyCards.length - 1 ? 'animate-pulse' : ''} hidden md:block`} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 - Mission & Vision */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mission & Vision Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Vision Card */}
            {visionCard && (
              <div
                onClick={() => setExpandedCard('vision')}
                className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-royal-200 hover:border-royal-400 cursor-pointer group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-royal-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-royal-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4 group-hover:text-royal-700 transition-colors">
                    {visionCard.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-lg line-clamp-3">
                    {visionCard.shortDescription}
                  </p>
                  <p className="text-sm text-royal-600 mt-4 font-semibold">Click to read more →</p>
                </div>

                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-royal-400/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-300" />
              </div>
            )}

            {/* Mission Card */}
            {missionCard && (
              <div
                onClick={() => setExpandedCard('mission')}
                className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gold-200 hover:border-gold-400 cursor-pointer group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gold-50 to-amber-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-royal-600 to-gold-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4 group-hover:text-royal-700 transition-colors">
                    {missionCard.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-lg line-clamp-3">
                    {missionCard.shortDescription}
                  </p>
                  <p className="text-sm text-gold-600 mt-4 font-semibold">Click to read more →</p>
                </div>

                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-gold-400/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-300" />
              </div>
            )}
          </div>

          {/* Vision Modal */}
          {expandedCard === 'vision' && visionCard && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-300"
              onClick={() => setExpandedCard(null)}
            >
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
              <div
                className="relative bg-white/95 backdrop-blur-md rounded-3xl max-w-3xl w-full mx-4 shadow-2xl border-2 border-royal-300 animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setExpandedCard(null)}
                  className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-900/80 hover:bg-gray-900 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="p-10">
                  <div className="w-20 h-20 bg-gradient-to-br from-royal-600 to-purple-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl">
                    <Eye className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-4xl font-serif font-bold text-royal-700 mb-6">
                    {visionCard.title}
                  </h3>
                  <div className="prose prose-lg max-w-none">
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {visionCard.fullDescription}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mission Modal */}
          {expandedCard === 'mission' && missionCard && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-300"
              onClick={() => setExpandedCard(null)}
            >
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
              <div
                className="relative bg-white/95 backdrop-blur-md rounded-3xl max-w-3xl w-full mx-4 shadow-2xl border-2 border-gold-300 animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setExpandedCard(null)}
                  className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-900/80 hover:bg-gray-900 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="p-10">
                  <div className="w-20 h-20 bg-gradient-to-br from-royal-600 to-gold-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl">
                    <Target className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-4xl font-serif font-bold text-royal-700 mb-6">
                    {missionCard.title}
                  </h3>
                  <div className="prose prose-lg max-w-none">
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {missionCard.fullDescription}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Section 4 - Core Values */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold bg-gradient-to-r from-royal-700 to-purple-600 bg-clip-text text-transparent mb-4">
              Our Core Values
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The foundation upon which we build our ministry and community
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {(about?.values || ['Prayer', 'Word', 'Worship', 'Fellowship', 'Quality Family Life', 'Excellence']).map((value, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-royal-100 hover:border-royal-300"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-royal-600 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-royal-700 transition-colors">
                    {value}
                  </h3>
                </div>

                {/* Decorative gradient bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-royal-600 to-gold-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5 - Our Team */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex justify-center items-center gap-2 mb-4">
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-royal-600" />
              <Heart className="w-6 h-6 text-royal-600" />
              <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-royal-600" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-3">Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Meet the passionate people dedicated to serving our church family. Hover over a card to learn more.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team?.map((member) => (
              <div key={member.id}>
                {/* Regular Card */}
                <div
                  onClick={() => setExpandedMember(member.id)}
                  className="relative bg-white rounded-3xl overflow-hidden shadow-lg transition-all duration-300 border-2 border-royal-100 hover:border-royal-300 hover:shadow-xl cursor-pointer"
                >
                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden bg-gradient-to-br from-royal-600 to-purple-600">
                    {member.imageUrl ? (
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-royal-600 to-purple-600 flex items-center justify-center">
                        <span className="text-6xl font-serif font-bold text-white drop-shadow-2xl">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Basic Info */}
                  <div className="p-5">
                    <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
                      {member.name}
                    </h3>
                    <div className="inline-block bg-gradient-to-r from-royal-600 to-gold-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {member.role}
                    </div>
                  </div>
                </div>

                {/* Expanded Card Modal */}
                {expandedMember === member.id && (
                  <div
                    className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-300"
                    onClick={() => setExpandedMember(null)}
                  >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

                    {/* Expanded Card */}
                    <div
                      className="relative bg-white/95 backdrop-blur-md rounded-3xl max-w-2xl w-full mx-4 shadow-2xl border-2 border-royal-300 animate-in zoom-in-95 duration-300"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Close Button */}
                      <button
                        onClick={() => setExpandedMember(null)}
                        className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-900/80 hover:bg-gray-900 rounded-full flex items-center justify-center text-white transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      <div className="flex flex-col md:flex-row gap-6 p-8">
                        {/* Image Side */}
                        <div className="md:w-1/3">
                          <div className="relative h-64 md:h-full min-h-[300px] rounded-2xl overflow-hidden bg-gradient-to-br from-royal-600 to-purple-600">
                            {member.imageUrl ? (
                              <img
                                src={member.imageUrl}
                                alt={member.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-royal-600 to-purple-600 flex items-center justify-center">
                                <span className="text-7xl font-serif font-bold text-white drop-shadow-2xl">
                                  {member.name.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Details Side */}
                        <div className="md:w-2/3 overflow-y-auto max-h-[500px] pr-2">
                          <h3 className="text-3xl font-serif font-bold text-royal-700 mb-2">
                            {member.name}
                          </h3>
                          <div className="inline-block bg-gradient-to-r from-royal-600 to-gold-500 text-white text-sm font-semibold px-4 py-2 rounded-full mb-4">
                            {member.role}
                          </div>

                          {/* Bio with proper formatting */}
                          <div className="prose prose-sm max-w-none">
                            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                              {member.bio}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
