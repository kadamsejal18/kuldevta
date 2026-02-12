import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, X, SlidersHorizontal, Grid3X3, List, MapPin } from 'lucide-react'
import PropertyCard from '../components/PropertyCard'
import { propertyAPI } from '../services/api'
import { normalizeProperty } from '../utils/propertyMapper'

export default function Properties() {
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [type, setType] = useState(searchParams.get('type') || 'all')
  const [category, setCategory] = useState(searchParams.get('category') || 'all')
  const [furnishing, setFurnishing] = useState(searchParams.get('furnishing') || 'all')
  const [priceRange, setPriceRange] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState('grid')
  const [properties, setProperties] = useState([])

  useEffect(() => {
    const loadProperties = async () => {
      const response = await propertyAPI.getAll({ limit: 100 })
      setProperties((response.properties || []).map(normalizeProperty))
    }

    loadProperties().catch((error) => {
      console.error('Failed to load properties:', error)
      setProperties([])
    })
  }, [])

  const filtered = useMemo(() => {
    let result = [...properties]

    if (search) {
      const q = search.toLowerCase()
      result = result.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      )
    }
    if (type !== 'all') result = result.filter((p) => p.type === type)
    if (category !== 'all') result = result.filter((p) => p.category === category)
    if (furnishing !== 'all') result = result.filter((p) => p.furnishing === furnishing)

    if (priceRange !== 'all') {
      if (priceRange === 'under50L') result = result.filter((p) => p.priceNum < 5000000)
      else if (priceRange === '50L-1Cr') result = result.filter((p) => p.priceNum >= 5000000 && p.priceNum < 10000000)
      else if (priceRange === '1Cr-5Cr') result = result.filter((p) => p.priceNum >= 10000000 && p.priceNum < 50000000)
      else if (priceRange === 'above5Cr') result = result.filter((p) => p.priceNum >= 50000000)
    }

    if (sortBy === 'price-low') result.sort((a, b) => a.priceNum - b.priceNum)
    else if (sortBy === 'price-high') result.sort((a, b) => b.priceNum - a.priceNum)
    else if (sortBy === 'popular') result.sort((a, b) => b.views - a.views)

    return result
  }, [search, type, category, furnishing, priceRange, sortBy, properties])

  const clearFilters = () => {
    setSearch('')
    setType('all')
    setCategory('all')
    setFurnishing('all')
    setPriceRange('all')
    setSortBy('newest')
  }

  const activeFilters = [type, category, furnishing, priceRange].filter((f) => f !== 'all').length

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="text-amber-400/60 text-sm tracking-widest uppercase mb-3">Explore</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold">
            All <span className="gradient-text">Properties</span>
          </h1>
          <p className="text-white/40 mt-2">{filtered.length} properties found</p>
        </motion.div>

        <div className="glass rounded-2xl p-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-3 bg-white/5 rounded-xl px-4">
              <Search size={18} className="text-white/30" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search properties..."
                className="w-full bg-transparent outline-none text-white placeholder-white/30 py-3 text-sm"
              />
              {search && (
                <button onClick={() => setSearch('')} className="text-white/30 hover:text-white">
                  <X size={16} />
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  showFilters ? 'gradient-gold text-black' : 'glass text-white/60 hover:text-white'
                }`}
              >
                <SlidersHorizontal size={16} />
                Filters
                {activeFilters > 0 && (
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-black text-xs flex items-center justify-center">
                    {activeFilters}
                  </span>
                )}
              </button>
              <div className="hidden sm:flex gap-1 glass rounded-xl p-1">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white/10' : ''}`}>
                  <Grid3X3 size={16} className={viewMode === 'grid' ? 'text-white' : 'text-white/40'} />
                </button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white/10' : ''}`}>
                  <List size={16} className={viewMode === 'list' ? 'text-white' : 'text-white/40'} />
                </button>
              </div>
            </div>
          </div>

          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="border-t border-white/5 mt-4 pt-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <div className="space-y-1.5"><label className="text-xs text-white/40">Type</label><select value={type} onChange={(e) => setType(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none"><option value="all" className="bg-gray-900">All Types</option><option value="buy" className="bg-gray-900">Buy</option><option value="rent" className="bg-gray-900">Rent</option></select></div>
                <div className="space-y-1.5"><label className="text-xs text-white/40">Category</label><select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none"><option value="all" className="bg-gray-900">All Categories</option>{['1BHK', '2BHK', '3BHK', '4BHK', 'Villa', 'Plot', 'Commercial', 'Office', 'Shop', 'Warehouse'].map((c) => (<option key={c} value={c} className="bg-gray-900">{c}</option>))}</select></div>
                <div className="space-y-1.5"><label className="text-xs text-white/40">Furnishing</label><select value={furnishing} onChange={(e) => setFurnishing(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none"><option value="all" className="bg-gray-900">All</option><option value="Furnished" className="bg-gray-900">Furnished</option><option value="Semi-Furnished" className="bg-gray-900">Semi-Furnished</option><option value="Unfurnished" className="bg-gray-900">Unfurnished</option></select></div>
                <div className="space-y-1.5"><label className="text-xs text-white/40">Price Range</label><select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none"><option value="all" className="bg-gray-900">Any Price</option><option value="under50L" className="bg-gray-900">Under ₹50L</option><option value="50L-1Cr" className="bg-gray-900">₹50L - ₹1Cr</option><option value="1Cr-5Cr" className="bg-gray-900">₹1Cr - ₹5Cr</option><option value="above5Cr" className="bg-gray-900">Above ₹5Cr</option></select></div>
                <div className="space-y-1.5"><label className="text-xs text-white/40">Sort By</label><select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none"><option value="newest" className="bg-gray-900">Newest</option><option value="price-low" className="bg-gray-900">Price: Low to High</option><option value="price-high" className="bg-gray-900">Price: High to Low</option><option value="popular" className="bg-gray-900">Most Popular</option></select></div>
              </div>
              {activeFilters > 0 && <button onClick={clearFilters} className="mt-3 text-sm text-amber-400 hover:text-amber-300 flex items-center gap-1"><X size={14} /> Clear all filters</button>}
            </motion.div>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl glass mx-auto flex items-center justify-center mb-4"><MapPin size={32} className="text-white/20" /></div>
            <h3 className="font-display text-2xl font-semibold mb-2">No properties found</h3>
            <p className="text-white/40">Try adjusting your filters or search criteria</p>
            <button onClick={clearFilters} className="btn-luxury mt-4 text-sm">Clear Filters</button>
          </div>
        ) : (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filtered.map((property, i) => <PropertyCard key={property.id} property={property} index={i} />)}
          </div>
        )}
      </div>
    </div>
  )
}
