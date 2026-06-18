import { Link } from 'wouter';
import { Mail, Phone, MapPin, Clock, Facebook, Instagram, Youtube } from 'lucide-react';
import { useContent } from '@/lib/content';
import { FOOTER_DEFAULT, FooterContent } from '@/lib/site-content';

export function Footer() {
  const footer = useContent<FooterContent>('footer', FOOTER_DEFAULT);

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          {/* Column 1 - About */}
          <div>
            <h3 className="text-2xl font-serif font-bold mb-4 bg-gradient-to-r from-bronze-300 to-bronze-500 bg-clip-text text-transparent">
              {footer.aboutTitle}
            </h3>
            <p className="text-gray-400 leading-relaxed mb-6">{footer.aboutText}</p>
            {/* Social Media */}
            <div className="flex gap-3">
              {footer.facebook && (
                <a
                  href={footer.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {footer.instagram && (
                <a
                  href={footer.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-pink-600 rounded-full flex items-center justify-center transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {footer.youtube && (
                <a
                  href={footer.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {footer.quickLinks.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  <Link href={link.href}>
                    <a className="text-gray-400 hover:text-white transition-colors">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3 text-gray-400">
              {footer.address && (
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>{footer.address}</span>
                </li>
              )}
              {footer.phone && (
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 flex-shrink-0" />
                  <a href={`tel:${footer.phone}`} className="hover:text-white transition-colors">
                    {footer.phone}
                  </a>
                </li>
              )}
              {footer.email && (
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 flex-shrink-0" />
                  <a href={`mailto:${footer.email}`} className="hover:text-white transition-colors">
                    {footer.email}
                  </a>
                </li>
              )}
              {footer.serviceTime && (
                <li className="flex items-start gap-3">
                  <Clock className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-white">{footer.serviceLabel}</p>
                    <p className="text-sm">{footer.serviceTime}</p>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
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
