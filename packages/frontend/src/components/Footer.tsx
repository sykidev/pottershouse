import { Link } from 'wouter';
import { Mail, Phone, MapPin, Clock, Facebook, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          {/* Column 1 - About */}
          <div>
            <h3 className="text-2xl font-serif font-bold mb-4 bg-gradient-to-r from-bronze-300 to-bronze-500 bg-clip-text text-transparent">
              The Potters' Apostolic Ministries
            </h3>
            <p className="text-gray-400 leading-relaxed mb-6">
              Molded by the Master Potter, empowered to transform lives through apostolic ministry. Everyone is welcome.
            </p>
            {/* Social Media */}
            <div className="flex gap-3">
              <a
                href="https://facebook.com/yourchurch"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/yourchurch"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-pink-600 rounded-full flex items-center justify-center transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com/@yourchurch"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-gray-400 hover:text-white transition-colors">
                    Home
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <a className="text-gray-400 hover:text-white transition-colors">
                    About Us
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/sermons">
                  <a className="text-gray-400 hover:text-white transition-colors">
                    Sermons
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/events">
                  <a className="text-gray-400 hover:text-white transition-colors">
                    Events
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/connect">
                  <a className="text-gray-400 hover:text-white transition-colors">
                    Connect
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>123 Church Street, City, State 12345</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <a href="tel:+15551234567" className="hover:text-white transition-colors">
                  (555) 123-4567
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <a href="mailto:info@fncfc.org" className="hover:text-white transition-colors">
                  info@fncfc.org
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-white">Sunday Service</p>
                  <p className="text-sm">10:00 AM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>
              © {new Date().getFullYear()} The Potters' Apostolic Ministries. All rights reserved.
            </p>
            <p className="italic font-serif text-bronze-400">
              "We are the clay, You are the Potter" - Isaiah 64:8
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
