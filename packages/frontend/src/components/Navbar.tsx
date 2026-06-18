import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/sermons', label: 'Sermons' },
    { href: '/events', label: 'Events' },
    { href: '/connect', label: 'Connect' },
  ];

  // Lock body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo - Left */}
            <Link href="/">
              <a className="flex items-center group">
                <img
                  src="/images/logo.jpg"
                  alt="The Potters' Apostolic Ministries"
                  className="h-16 w-auto hover:scale-105 transition-transform duration-300 drop-shadow-lg rounded-lg"
                />
              </a>
            </Link>

            {/* Desktop Nav Links - Center */}
            <div className="hidden lg:flex items-center space-x-10">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <a className="text-sm font-semibold text-gray-700 hover:text-royal-700 transition-colors relative group">
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-royal-600 to-gold-500 transition-all group-hover:w-full"></span>
                  </a>
                </Link>
              ))}
            </div>

            {/* Desktop Visit Us Button - Right */}
            <div className="hidden lg:block">
              <Link href="/connect">
                <Button className="bg-gradient-to-r from-royal-600 to-royal-700 hover:from-royal-700 hover:to-royal-800 text-white rounded-full px-8 shadow-md hover:shadow-xl hover:scale-105 transition-all">
                  Visit Us
                </Button>
              </Link>
            </div>

            {/* Animated Hamburger Button */}
            <button
              className="lg:hidden relative w-10 h-10 flex items-center justify-center"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 relative flex flex-col justify-between">
                {/* Top bar */}
                <span
                  className={`w-full h-0.5 bg-gray-700 rounded-full transition-all duration-300 origin-center ${
                    mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                  }`}
                />
                {/* Middle bar */}
                <span
                  className={`w-full h-0.5 bg-gray-700 rounded-full transition-all duration-300 ${
                    mobileMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                  }`}
                />
                {/* Bottom bar */}
                <span
                  className={`w-full h-0.5 bg-gray-700 rounded-full transition-all duration-300 origin-center ${
                    mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-[100] transition-all duration-500 ${
          mobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Glass-morphism Background - Click to close */}
        <div
          className="absolute inset-0 bg-royal-950/40 backdrop-blur-2xl"
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Royal Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-royal-600 via-gold-500 to-royal-600" />

        {/* Close Button - Top Right */}
        <button
          onClick={() => setMobileMenuOpen(false)}
          className={`absolute top-8 right-8 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-300 ${
            mobileMenuOpen ? 'scale-100 rotate-0' : 'scale-0 rotate-90'
          }`}
          style={{ transitionDelay: mobileMenuOpen ? '200ms' : '0ms' }}
          aria-label="Close menu"
        >
          <X className="w-6 h-6 text-royal-700" />
        </button>

        {/* Menu Content */}
        <div className="relative h-full flex flex-col">
          {/* Navigation Links */}
          <nav className="flex-1 flex flex-col justify-center px-8 space-y-2">
            {navLinks.map((link, index) => {
              const isActive = location === link.href;
              return (
                <Link key={link.href} href={link.href}>
                  <a
                    className={`relative block py-5 px-6 rounded-2xl text-xl font-medium transition-all duration-300 backdrop-blur-sm ${
                      mobileMenuOpen
                        ? 'translate-x-0 opacity-100'
                        : '-translate-x-8 opacity-0'
                    } ${
                      isActive
                        ? 'bg-white/95 text-royal-800 border-l-4 border-gold-500 shadow-xl'
                        : 'text-white bg-white/10 hover:bg-white/20 shadow-lg'
                    }`}
                    style={{
                      transitionDelay: mobileMenuOpen ? `${index * 60}ms` : '0ms',
                    }}
                  >
                    <span className="flex items-center justify-between">
                      {link.label}
                      {isActive && (
                        <span className="text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-royal-600 to-gold-500 bg-clip-text text-transparent px-3 py-1 rounded-full border border-gold-400/30">
                          Current
                        </span>
                      )}
                    </span>
                  </a>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div
            className={`px-8 pb-12 space-y-6 transition-all duration-500 ${
              mobileMenuOpen
                ? 'translate-y-0 opacity-100'
                : 'translate-y-8 opacity-0'
            }`}
            style={{
              transitionDelay: mobileMenuOpen ? '300ms' : '0ms',
            }}
          >
            {/* CTA Button */}
            <Link href="/connect">
              <a
                className="block w-full bg-gradient-to-r from-royal-600 to-royal-700 hover:from-royal-700 hover:to-royal-800 text-white rounded-2xl py-6 text-lg font-semibold shadow-2xl hover:shadow-royal-500/50 transition-all backdrop-blur-sm text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Visit Us This Sunday
              </a>
            </Link>

            {/* Scripture Footer */}
            <p className="text-center text-sm italic text-white/80 font-serif">
              "We are the clay, You are the Potter" - Isaiah 64:8
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
