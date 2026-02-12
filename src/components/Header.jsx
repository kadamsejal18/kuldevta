import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Phone, MessageCircle, Home, Building2, Plus, Key, DollarSign, Mail, ChevronDown } from 'lucide-react'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/properties', label: 'Properties', icon: Building2 },
    { path: '/properties?type=buy', label: 'Buy', icon: DollarSign },
    { path: '/properties?type=rent', label: 'Rent', icon: Key },
    { path: '/sell', label: 'Sell', icon: Plus },
    { path: '/contact', label: 'Contact', icon: Mail },
  ]

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass-dark shadow-2xl shadow-black/20' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center font-display font-bold text-lg text-black group-hover:scale-110 transition-transform">
                K
              </div>
              <div className="hidden sm:block">
                <h1 className="font-display text-lg font-bold gradient-text leading-tight">Kuldevta</h1>
                <p className="text-[10px] tracking-[0.2em] text-white/50 uppercase">Estate Agency</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    location.pathname === link.path
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <a
                href="https://wa.me/919930388219"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium hover:bg-green-500/20 transition-all"
              >
                <MessageCircle size={16} />
                WhatsApp
              </a>
              <a
                href="tel:9930388219"
                className="btn-luxury text-sm flex items-center gap-2 !py-2.5 !px-5"
              >
                <Phone size={16} />
                Call Now
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-xl glass"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-500 overflow-hidden ${
          menuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="glass-dark border-t border-white/5 px-4 py-6 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    location.pathname === link.path
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={18} />
                  {link.label}
                </Link>
              )
            })}
            <div className="flex gap-3 pt-4">
              <a
                href="https://wa.me/919930388219"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium"
              >
                <MessageCircle size={16} />
                WhatsApp
              </a>
              <a
                href="tel:9930388219"
                className="flex-1 btn-luxury text-sm flex items-center justify-center gap-2"
              >
                <Phone size={16} />
                Call
              </a>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
