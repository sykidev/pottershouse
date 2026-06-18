import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { useContent } from '@/lib/content';
import { CONNECT_DEFAULT, ConnectContent } from '@/lib/site-content';
import { Book, Music, Baby, Users, Heart, HandHeart, Phone, Mail, MapPin, Sparkles, Clock, LucideIcon } from 'lucide-react';

interface ContactData {
  address?: string;
  phone?: string;
  email?: string;
  serviceTimes?: string;
  mapUrl?: string;
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  imageUrl: string | null;
}

// Icon names an admin can type for a ministry card.
const ICONS: Record<string, LucideIcon> = { Book, Music, Baby, Users, Heart, HandHeart, Sparkles };

// Card color themes cycled across the ministry list.
const PALETTE = [
  { color: 'from-blue-600 to-blue-800', bgColor: 'bg-blue-600/10', hoverColor: 'hover:border-blue-600/30' },
  { color: 'from-purple-600 to-purple-800', bgColor: 'bg-purple-600/10', hoverColor: 'hover:border-purple-600/30' },
  { color: 'from-pink-600 to-pink-800', bgColor: 'bg-pink-600/10', hoverColor: 'hover:border-pink-600/30' },
  { color: 'from-amber to-amber-700', bgColor: 'bg-amber/10', hoverColor: 'hover:border-amber/30' },
  { color: 'from-green-600 to-green-800', bgColor: 'bg-green-600/10', hoverColor: 'hover:border-green-600/30' },
  { color: 'from-crimson to-crimson-800', bgColor: 'bg-crimson/10', hoverColor: 'hover:border-crimson/30' },
];

export function ConnectPage() {
  const page = useContent<ConnectContent>('connect', CONNECT_DEFAULT);

  const { data: contactData } = useQuery({
    queryKey: ['content', 'contact'],
    queryFn: () => apiRequest<{ data: ContactData }>('/content/contact'),
  });

  const { data: team } = useQuery({
    queryKey: ['team'],
    queryFn: () => apiRequest<TeamMember[]>('/team'),
  });

  const contact = contactData?.data;

  return (
    <div>
      {/* Section 1 - Hero with Gradient */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-blue-900 via-crimson to-purple-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }} />
        </div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-amber/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="flex justify-center mb-4">
            <Sparkles className="w-10 h-10 text-amber animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4 text-white drop-shadow-2xl">{page.heroTitle}</h1>
          <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
            {page.heroSubtitle}
          </p>
        </div>
      </section>

      {/* Section 2 - Ministries & Groups */}
      <section className="bg-gradient-to-b from-warm-white to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex justify-center items-center gap-2 mb-4">
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-crimson" />
              <Heart className="w-6 h-6 text-crimson" />
              <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-crimson" />
            </div>
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-3">{page.ministriesHeading}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{page.ministriesSubtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {page.ministries.map((ministry, index) => {
              const Icon = ICONS[ministry.icon] || Heart;
              const theme = PALETTE[index % PALETTE.length];
              return (
                <div
                  key={index}
                  className={`group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-transparent ${theme.hoverColor} overflow-hidden`}
                >
                  <div className={`absolute inset-0 ${theme.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="relative z-10">
                    <div className={`w-16 h-16 bg-gradient-to-br ${theme.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-crimson transition-colors">{ministry.title}</h3>
                    <p className="text-gray-700 leading-relaxed">{ministry.description}</p>
                  </div>
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-tl from-crimson/10 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 2.5 - Plan Your Visit: church info + service schedule */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            {/* Church info */}
            <div className="bg-gradient-to-br from-royal-900 to-purple-900 rounded-3xl p-8 text-white shadow-xl">
              <h2 className="text-3xl font-serif font-bold mb-6">Plan Your Visit</h2>
              <p className="text-2xl font-semibold mb-4">{page.churchName}</p>
              <div className="flex items-start gap-3 mb-2">
                <MapPin className="w-6 h-6 text-gold-400 flex-shrink-0 mt-1" />
                <p className="text-white/90">{page.address}</p>
              </div>
              {page.postalCode && (
                <p className="text-white/70 text-sm pl-9">Postal Code: {page.postalCode}</p>
              )}
            </div>

            {/* Service schedule */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Clock className="w-6 h-6 text-crimson" />
                <h2 className="text-3xl font-serif font-bold text-gray-900">{page.servicesHeading}</h2>
              </div>
              <div className="space-y-3">
                {page.services.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-4 bg-warm-white rounded-2xl p-5 border border-gray-100 shadow-sm"
                  >
                    <div>
                      <p className="font-bold text-gray-900">{s.day}</p>
                      <p className="text-gray-600 text-sm">{s.name}</p>
                    </div>
                    <span className="inline-block bg-crimson/10 text-crimson font-semibold px-4 py-1.5 rounded-full text-sm text-right flex-shrink-0">
                      {s.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 - Meet Our Team */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-3">{page.teamHeading}</h2>
            <p className="text-gray-600">{page.teamSubtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team?.map((member) => (
              <div
                key={member.id}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-crimson/20"
              >
                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-crimson to-purple-600">
                  {member.imageUrl ? (
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-crimson to-purple-600 flex items-center justify-center">
                      <span className="text-6xl font-serif font-bold text-white drop-shadow-2xl">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2 group-hover:text-crimson transition-colors">
                    {member.name}
                  </h3>
                  <div className="inline-block bg-gradient-to-r from-crimson to-amber text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                    {member.role}
                  </div>
                  <p className="text-gray-700 leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4 - CTA */}
      <section className="relative py-16 overflow-hidden bg-gradient-to-br from-crimson via-crimson-800 to-purple-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)',
            backgroundSize: '50px 50px',
          }} />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8 text-white drop-shadow-2xl">{page.ctaHeading}</h2>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            {contact?.phone && (
              <a
                href={`tel:${contact.phone}`}
                className="inline-flex items-center justify-center gap-3 bg-white text-crimson px-8 py-4 rounded-2xl font-semibold hover:bg-white/90 transition-all duration-300 hover:scale-105 shadow-2xl group"
              >
                <div className="w-10 h-10 bg-crimson/10 rounded-xl flex items-center justify-center group-hover:bg-crimson/20 transition-colors">
                  <Phone className="w-5 h-5 text-crimson" />
                </div>
                Call Us
              </a>
            )}
            {contact?.email && (
              <a
                href={`mailto:${contact.email}`}
                className="inline-flex items-center justify-center gap-3 bg-white text-crimson px-8 py-4 rounded-2xl font-semibold hover:bg-white/90 transition-all duration-300 hover:scale-105 shadow-2xl group"
              >
                <div className="w-10 h-10 bg-crimson/10 rounded-xl flex items-center justify-center group-hover:bg-crimson/20 transition-colors">
                  <Mail className="w-5 h-5 text-crimson" />
                </div>
                Email Us
              </a>
            )}
          </div>

          {contact?.address && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto border border-white/20">
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-6 h-6 text-amber flex-shrink-0 mt-1" />
                <div className="text-left">
                  <p className="font-semibold text-white mb-2">Visit Us</p>
                  <p className="text-white/90">{contact.address}</p>
                </div>
              </div>
              {contact.serviceTimes && (
                <p className="text-white/80 text-sm">
                  Sunday Service: {contact.serviceTimes}
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
