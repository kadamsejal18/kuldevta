import { Link } from 'react-router-dom'
import { MapPin, Bed, Bath, Maximize, Eye, Heart, MessageCircle, Phone } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function PropertyCard({ property, index = 0 }) {
  const [liked, setLiked] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group glass rounded-2xl overflow-hidden card-hover"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {property.featured && (
            <span className="px-3 py-1 rounded-lg text-xs font-semibold gradient-gold text-black">
              Featured
            </span>
          )}
          <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
            property.type === 'rent'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
          }`}>
            {property.type === 'rent' ? 'For Rent' : 'For Sale'}
          </span>
        </div>

        {/* Heart */}
        <button
          onClick={(e) => { e.preventDefault(); setLiked(!liked) }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full glass flex items-center justify-center hover:bg-white/20 transition-all"
        >
          <Heart size={16} className={liked ? 'fill-red-500 text-red-500' : 'text-white'} />
        </button>

        {/* Price */}
        <div className="absolute bottom-3 left-3">
          <p className="text-xl font-bold text-white">{property.price}</p>
        </div>

        {/* Views */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 text-white/60 text-xs">
          <Eye size={12} />
          {property.views}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <Link to={`/property/${property.id}`}>
          <h3 className="font-display text-lg font-semibold group-hover:text-amber-400 transition-colors line-clamp-2">
            {property.title}
          </h3>
        </Link>

        <div className="flex items-center gap-1.5 text-white/40 text-sm">
          <MapPin size={14} />
          {property.location}
        </div>

        {/* Specs */}
        <div className="flex items-center gap-4 text-white/50 text-sm">
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1.5">
              <Bed size={14} /> {property.bedrooms} Bed
            </span>
          )}
          {property.bathrooms > 0 && (
            <span className="flex items-center gap-1.5">
              <Bath size={14} /> {property.bathrooms} Bath
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Maximize size={14} /> {property.area}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-white/5 text-white/40 text-xs">
            {property.category}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-white/5 text-white/40 text-xs">
            {property.furnishing}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <a
            href="https://wa.me/919930388219"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium hover:bg-green-500/20 transition-all"
          >
            <MessageCircle size={14} />
            WhatsApp
          </a>
          <a
            href="tel:9930388219"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl glass-gold text-amber-400 text-sm font-medium hover:bg-amber-500/15 transition-all"
          >
            <Phone size={14} />
            Call
          </a>
          <Link
            to={`/property/${property.id}`}
            className="px-4 py-2.5 rounded-xl glass text-white/60 text-sm font-medium hover:text-white hover:bg-white/10 transition-all"
          >
            View
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
