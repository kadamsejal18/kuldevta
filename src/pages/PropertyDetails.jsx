import { useState, useRef, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, Eye, Heart,
  MapPin, Bed, Bath, Maximize, Calendar, User, Phone, MessageCircle,
  Share2, Bookmark, CheckCircle2, Play, ArrowLeft
} from 'lucide-react'
import { properties } from '../data/properties'

export default function PropertyDetails() {
  const { id } = useParams()
  const property = properties.find(p => p.id === parseInt(id))
  const [currentImage, setCurrentImage] = useState(0)
  const [showGallery, setShowGallery] = useState(false)
  const [showLeadPopup, setShowLeadPopup] = useState(false)
  const [leadSubmitted, setLeadSubmitted] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [liked, setLiked] = useState(false)
  const galleryRef = useRef(null)

  useEffect(() => {
    const hasSubmitted = sessionStorage.getItem(`lead-${id}`)
    if (hasSubmitted) setLeadSubmitted(true)
  }, [id])

  const handleViewImages = () => {
    if (!leadSubmitted) {
      setShowLeadPopup(true)
    } else {
      setShowGallery(true)
    }
  }

  const handleLeadSubmit = (e) => {
    e.preventDefault()
    sessionStorage.setItem(`lead-${id}`, 'true')
    setLeadSubmitted(true)
    setShowLeadPopup(false)
    setShowGallery(true)
  }

  if (!property) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold mb-4">Property Not Found</h2>
          <Link to="/properties" className="btn-luxury text-sm">Browse Properties</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link to="/properties" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors">
          <ArrowLeft size={16} /> Back to Properties
        </Link>
      </div>

      {/* Image Gallery Header */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 rounded-2xl overflow-hidden h-[400px] lg:h-[500px]">
            {/* Main Image */}
            <div
              className="lg:col-span-2 relative cursor-pointer group"
              onClick={handleViewImages}
            >
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="glass rounded-xl px-6 py-3 flex items-center gap-2 font-medium">
                  <ZoomIn size={18} />
                  View All Photos
                </div>
              </div>
              <div className="absolute top-4 left-4 flex gap-2">
                {property.featured && (
                  <span className="px-3 py-1 rounded-lg text-xs font-semibold gradient-gold text-black">Featured</span>
                )}
                <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  property.type === 'rent'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {property.type === 'rent' ? 'For Rent' : 'For Sale'}
                </span>
              </div>
            </div>

            {/* Side Images */}
            <div className="hidden lg:flex flex-col gap-3">
              {property.images.slice(1, 3).map((img, i) => (
                <div
                  key={i}
                  className="flex-1 relative cursor-pointer group overflow-hidden"
                  onClick={handleViewImages}
                >
                  <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  {i === 1 && property.images.length > 3 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-lg font-semibold">+{property.images.length - 3} more</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Price */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="font-display text-3xl sm:text-4xl font-bold">{property.title}</h1>
                  <div className="flex items-center gap-2 text-white/40 mt-2">
                    <MapPin size={16} />
                    <span>{property.location}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setLiked(!liked)} className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:bg-white/10 transition-all">
                    <Heart size={18} className={liked ? 'fill-red-500 text-red-500' : 'text-white/60'} />
                  </button>
                  <button className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:bg-white/10 transition-all">
                    <Share2 size={18} className="text-white/60" />
                  </button>
                  <button className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:bg-white/10 transition-all">
                    <Bookmark size={18} className="text-white/60" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <p className="text-3xl font-bold gradient-text">{property.price}</p>
                <div className="flex items-center gap-2 text-white/40 text-sm">
                  <Eye size={14} /> {property.views} views
                </div>
              </div>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Bed, label: 'Bedrooms', value: property.bedrooms },
                { icon: Bath, label: 'Bathrooms', value: property.bathrooms },
                { icon: Maximize, label: 'Area', value: property.area },
                { icon: Calendar, label: 'Posted', value: property.postedDate },
              ].map((spec) => (
                <div key={spec.label} className="glass rounded-xl p-4 text-center">
                  <spec.icon size={20} className="text-amber-400 mx-auto mb-2" />
                  <p className="text-lg font-semibold">{spec.value}</p>
                  <p className="text-xs text-white/40">{spec.label}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-display text-xl font-semibold mb-4">Description</h3>
              <p className="text-white/60 leading-relaxed">{property.description}</p>
            </div>

            {/* Details Grid */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-display text-xl font-semibold mb-4">Property Details</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Type', value: property.type === 'buy' ? 'For Sale' : 'For Rent' },
                  { label: 'Category', value: property.category },
                  { label: 'Furnishing', value: property.furnishing },
                  { label: 'Bedrooms', value: property.bedrooms },
                  { label: 'Bathrooms', value: property.bathrooms },
                  { label: 'Area', value: property.area },
                ].map((detail) => (
                  <div key={detail.label} className="border-b border-white/5 pb-3">
                    <p className="text-xs text-white/30 mb-1">{detail.label}</p>
                    <p className="font-medium text-sm">{detail.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-display text-xl font-semibold mb-4">Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2 text-white/60 text-sm">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    {amenity}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Contact Sidebar */}
          <div className="space-y-6">
            {/* Agent Card */}
            <div className="glass rounded-2xl p-6 sticky top-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl gradient-gold flex items-center justify-center font-display font-bold text-xl text-black">
                  {property.agent.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold">{property.agent}</h4>
                  <p className="text-sm text-white/40">Property Agent</p>
                </div>
              </div>

              <div className="space-y-3">
                <a
                  href="https://wa.me/919930388219"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 font-medium hover:bg-green-500/20 transition-all"
                >
                  <MessageCircle size={18} />
                  Chat on WhatsApp
                </a>
                <a
                  href="tel:9930388219"
                  className="w-full btn-luxury flex items-center justify-center gap-2 !py-3.5"
                >
                  <Phone size={18} />
                  Call Now
                </a>
              </div>

              {/* Quick Enquiry */}
              <div className="mt-6 pt-6 border-t border-white/5">
                <h4 className="font-semibold text-sm mb-4">Quick Enquiry</h4>
                <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); alert('Enquiry submitted!') }}>
                  <input type="text" placeholder="Your Name" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-amber-500/30" />
                  <input type="tel" placeholder="Phone Number" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-amber-500/30" />
                  <input type="email" placeholder="Email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-amber-500/30" />
                  <textarea placeholder="Message" rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-amber-500/30 resize-none" />
                  <button type="submit" className="w-full btn-luxury text-sm">Send Enquiry</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Capture Popup */}
      <AnimatePresence>
        {showLeadPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass rounded-2xl p-8 max-w-md w-full"
            >
              <button onClick={() => setShowLeadPopup(false)} className="absolute top-4 right-4 text-white/40 hover:text-white">
                <X size={20} />
              </button>
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-2xl gradient-gold mx-auto flex items-center justify-center mb-4">
                  <Eye size={28} className="text-black" />
                </div>
                <h3 className="font-display text-2xl font-bold">View Property Images</h3>
                <p className="text-white/40 text-sm mt-2">Please provide your details to view all images</p>
              </div>
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <input type="email" placeholder="Email Address" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-amber-500/30" />
                <input type="tel" placeholder="Phone Number" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-amber-500/30" />
                <button type="submit" className="w-full btn-luxury flex items-center justify-center gap-2">
                  <Eye size={16} /> View Images
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Screen Gallery */}
      <AnimatePresence>
        {showGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex flex-col"
          >
            {/* Gallery Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <p className="text-sm text-white/60">{currentImage + 1} / {property.images.length}</p>
              <div className="flex items-center gap-2">
                <button onClick={() => setZoom(z => Math.min(z + 0.5, 3))} className="w-9 h-9 rounded-lg glass flex items-center justify-center hover:bg-white/10 transition-all">
                  <ZoomIn size={16} />
                </button>
                <button onClick={() => setZoom(z => Math.max(z - 0.5, 1))} className="w-9 h-9 rounded-lg glass flex items-center justify-center hover:bg-white/10 transition-all">
                  <ZoomOut size={16} />
                </button>
                <button onClick={() => { setShowGallery(false); setZoom(1) }} className="w-9 h-9 rounded-lg glass flex items-center justify-center hover:bg-white/10 transition-all">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Main Image */}
            <div className="flex-1 flex items-center justify-center overflow-hidden relative">
              <button
                onClick={() => { setCurrentImage(i => (i - 1 + property.images.length) % property.images.length); setZoom(1) }}
                className="absolute left-4 z-10 w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-all"
              >
                <ChevronLeft size={20} />
              </button>

              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  src={property.images[currentImage]}
                  alt=""
                  className="max-h-full max-w-full object-contain transition-transform duration-300"
                  style={{ transform: `scale(${zoom})` }}
                />
              </AnimatePresence>

              <button
                onClick={() => { setCurrentImage(i => (i + 1) % property.images.length); setZoom(1) }}
                className="absolute right-4 z-10 w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="p-4 border-t border-white/5">
              <div className="flex gap-2 justify-center overflow-x-auto hide-scrollbar">
                {property.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => { setCurrentImage(i); setZoom(1) }}
                    className={`w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                      i === currentImage ? 'border-amber-500' : 'border-transparent opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
