import { Link } from 'react-router-dom'
import { Phone, MessageCircle, Mail, MapPin, Instagram, Facebook, Twitter, Youtube, ArrowUpRight } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a] to-[#060606]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center font-display font-bold text-xl text-black">
                K
              </div>
              <div>
                <h3 className="font-display text-xl font-bold gradient-text">Kuldevta</h3>
                <p className="text-xs tracking-[0.2em] text-white/40 uppercase">Estate Agency</p>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              Your trusted partner in finding the perfect home. Premium properties, new projects, and rentals across Mumbai.
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl glass flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h4 className="font-display text-lg font-semibold">Quick Links</h4>
            <div className="space-y-3">
              {[
                { path: '/', label: 'Home' },
                { path: '/properties', label: 'Properties' },
                { path: '/properties?type=buy', label: 'Buy Property' },
                { path: '/properties?type=rent', label: 'Rent Property' },
                { path: '/sell', label: 'Sell Property' },
                { path: '/contact', label: 'Contact Us' },
              ].map((link) => (
                <Link key={link.path} to={link.path} className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors group">
                  <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-5">
            <h4 className="font-display text-lg font-semibold">Property Types</h4>
            <div className="space-y-3">
              {['1RK', '1BHK', '2BHK', '3BHK', 'Villas', 'Bungalows', 'Plots'].map((cat) => (
                <Link key={cat} to={`/properties?category=${cat}`} className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors group">
                  <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-5">
            <h4 className="font-display text-lg font-semibold">Contact Us</h4>
            <div className="space-y-4">
              <a href="tel:9930388219" className="flex items-center gap-3 text-white/50 hover:text-white transition-colors">
                <div className="w-10 h-10 rounded-xl glass-gold flex items-center justify-center">
                  <Phone size={16} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-white/30">Call Us</p>
                  <p className="text-sm">9930388219</p>
                </div>
              </a>
              <a href="https://wa.me/919930388219" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/50 hover:text-white transition-colors">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                  <MessageCircle size={16} className="text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-white/30">WhatsApp</p>
                  <p className="text-sm">9930388219</p>
                </div>
              </a>
              <a href="mailto:info@kuldevta.com" className="flex items-center gap-3 text-white/50 hover:text-white transition-colors">
                <div className="w-10 h-10 rounded-xl glass flex items-center justify-center">
                  <Mail size={16} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-white/30">Email</p>
                  <p className="text-sm">info@kuldevta.com</p>
                </div>
              </a>
              <div className="flex items-start gap-3 text-white/50">
                <div className="w-10 h-10 rounded-xl glass flex-shrink-0 flex items-center justify-center">
                  <MapPin size={16} className="text-rose-400" />
                </div>
                <div>
                  <p className="text-xs text-white/30">Office</p>
                  <p className="text-sm">Mumbai, Maharashtra, India</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-sm">
            &copy; {new Date().getFullYear()} Kuldevta Estate Agency. All rights reserved.
          </p>
          <div className="flex gap-6 text-white/30 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
