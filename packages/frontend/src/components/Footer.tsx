import { Link } from 'wouter';
import {
  Mail, Phone, MapPin, Clock, Instagram, Facebook, Youtube, Send, Radio, Globe, LucideIcon,
} from 'lucide-react';
import { useContent } from '@/lib/content';
import { FOOTER_DEFAULT, FooterContent, CONNECT_DEFAULT, ConnectContent } from '@/lib/site-content';

const SOCIAL_ICONS: Record<string, LucideIcon> = {
  Instagram,
  Facebook,
  Youtube,
  YouTube: Youtube,
  Telegram: Send,
  Mixlr: Radio,
};

export function Footer() {
  const footer = useContent<FooterContent>('footer', FOOTER_DEFAULT);
  // Contact + service details are sourced from the Visit Us page so they stay in sync.
  const connect = useContent<ConnectContent>('connect', CONNECT_DEFAULT);

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand + socials */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-xl font-serif font-bold mb-3 bg-gradient-to-r from-bronze-300 to-bronze-500 bg-clip-text text-transparent">
              {footer.aboutTitle}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-5 max-w-sm">{footer.aboutText}</p>
            <div className="flex flex-wrap gap-2.5">
              {footer.socials.filter((s) => s.url).map((s) => {
                const Icon = SOCIAL_ICONS[s.label] || Globe;
                return (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    title={s.label}
                    className="w-10 h-10 bg-white/5 hover:bg-bronze-500 rounded-full flex items-center justify-center transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-300 mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {footer.quickLinks.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  <Link href={link.href}>
                    <a className="text-gray-400 hover:text-white text-sm transition-colors">{link.label}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-300 mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {connect.address && (
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-bronze-400 mt-0.5 flex-shrink-0" />
                  <span>{connect.address}</span>
                </li>
              )}
              {connect.phones.filter(Boolean).map((phone) => (
                <li key={phone} className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-bronze-400 flex-shrink-0" />
                  <a href={`tel:${phone.replace(/[^+\d]/g, '')}`} className="hover:text-white transition-colors break-all">
                    {phone}
                  </a>
                </li>
              ))}
              {connect.email && (
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-bronze-400 flex-shrink-0" />
                  <a href={`mailto:${connect.email}`} className="hover:text-white transition-colors break-all">
                    {connect.email}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Service Times */}
          {connect.services.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider text-gray-300 mb-4">Service Times</h4>
              <ul className="space-y-3 text-sm">
                {connect.services.map((s, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-bronze-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium leading-tight">{s.day}</p>
                      <p className="text-gray-400">{s.name}</p>
                      <p className="text-bronze-400">{s.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-gray-500 text-center md:text-left">
            <p>
              © {new Date().getFullYear()} {footer.copyrightName}. All rights reserved.
            </p>
            <p className="italic font-serif text-bronze-400">{footer.scripture}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
