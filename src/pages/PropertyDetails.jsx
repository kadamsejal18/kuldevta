import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, Bed, Bath, Maximize, ArrowLeft, Eye } from 'lucide-react'
import { propertyAPI } from '../services/api'
import { normalizeProperty } from '../utils/propertyMapper'

export default function PropertyDetails() {
  const { id } = useParams()
  const [property, setProperty] = useState(null)
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    const loadProperty = async () => {
      const response = await propertyAPI.getOne(id)
      setProperty(normalizeProperty(response.property))
      await propertyAPI.incrementViews(id)
    }

    loadProperty().catch((error) => {
      console.error('Failed to load property:', error)
      setProperty(null)
    })
  }, [id])

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link to="/properties" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors"><ArrowLeft size={16} /> Back to Properties</Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 rounded-2xl overflow-hidden h-[400px] lg:h-[500px]">
          <div className="lg:col-span-2 relative"><img src={property.images[currentImage]} alt={property.title} className="w-full h-full object-cover" /></div>
          <div className="hidden lg:flex flex-col gap-3">{property.images.slice(0, 2).map((img, i) => <button key={img + i} onClick={() => setCurrentImage(i)} className="flex-1 overflow-hidden"><img src={img} alt="" className="w-full h-full object-cover" /></button>)}</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold">{property.title}</h1>
              <div className="flex items-center gap-2 text-white/40 mt-2"><MapPin size={16} /><span>{property.location}</span></div>
              <p className="text-3xl font-bold gradient-text mt-4">{property.price}</p>
            </div>
            <div className="glass rounded-2xl p-6"><h3 className="font-display text-xl font-semibold mb-4">Overview</h3><div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm"><div className="flex items-center gap-2"><Bed size={16} /> {property.bedrooms || 0} Beds</div><div className="flex items-center gap-2"><Bath size={16} /> {property.bathrooms || 0} Baths</div><div className="flex items-center gap-2"><Maximize size={16} /> {property.area}</div><div className="flex items-center gap-2"><Eye size={16} /> {property.views || 0} Views</div></div></div>
            <div className="glass rounded-2xl p-6"><h3 className="font-display text-xl font-semibold mb-4">Description</h3><p className="text-white/70 leading-relaxed">{property.description}</p></div>
          </div>
          <div className="glass rounded-2xl p-6 h-fit"><h3 className="font-display text-xl font-semibold mb-4">Contact Agent</h3><p className="text-white/70 mb-1">{property.agent}</p><p className="text-white/40 text-sm">{property.contact?.phone || 'N/A'}</p></div>
        </div>
      </div>
    </div>
  )
}
