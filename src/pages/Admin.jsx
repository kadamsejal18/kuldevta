import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Building2, Image, Star, Megaphone, Users, Eye,
  Plus, Edit, Trash2, ToggleLeft, ToggleRight, Upload, Search,
  TrendingUp, ArrowUpRight, Phone, Mail, ChevronRight
} from 'lucide-react'
import { properties, leads } from '../data/properties'

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'properties', label: 'Properties', icon: Building2 },
  { id: 'add', label: 'Add Property', icon: Plus },
  { id: 'leads', label: 'Leads', icon: Users },
  { id: 'views', label: 'Analytics', icon: Eye },
]

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold">
            Admin <span className="gradient-text">Panel</span>
          </h1>
          <p className="text-white/40 mt-1">Manage properties, leads, and analytics</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-56 flex-shrink-0">
            <div className="glass rounded-2xl p-3 flex lg:flex-col gap-1 overflow-x-auto hide-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'gradient-gold text-black'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              {activeTab === 'dashboard' && <DashboardTab />}
              {activeTab === 'properties' && <PropertiesTab />}
              {activeTab === 'add' && <AddPropertyTab />}
              {activeTab === 'leads' && <LeadsTab />}
              {activeTab === 'views' && <AnalyticsTab />}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DashboardTab() {
  const stats = [
    { label: 'Total Properties', value: properties.length, icon: Building2, change: '+3', color: 'text-amber-400' },
    { label: 'Total Leads', value: leads.length, icon: Users, change: '+12', color: 'text-green-400' },
    { label: 'Total Views', value: properties.reduce((a, p) => a + p.views, 0).toLocaleString(), icon: Eye, change: '+256', color: 'text-blue-400' },
    { label: 'Featured', value: properties.filter(p => p.featured).length, icon: Star, change: '+1', color: 'text-purple-400' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <stat.icon size={20} className={stat.color} />
              <span className="text-xs text-green-400 flex items-center gap-0.5">
                <ArrowUpRight size={12} /> {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-white/40 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Leads */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-display text-lg font-semibold mb-4">Recent Leads</h3>
        <div className="space-y-3">
          {leads.slice(0, 3).map((lead) => (
            <div key={lead.id} className="flex items-center justify-between p-3 rounded-xl bg-white/3 hover:bg-white/5 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center font-bold text-sm text-black">
                  {lead.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-sm">{lead.name}</p>
                  <p className="text-xs text-white/40">{lead.property}</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                lead.status === 'New' ? 'bg-blue-500/10 text-blue-400' :
                lead.status === 'Contacted' ? 'bg-amber-500/10 text-amber-400' :
                lead.status === 'Interested' ? 'bg-green-500/10 text-green-400' :
                'bg-purple-500/10 text-purple-400'
              }`}>
                {lead.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Properties */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-display text-lg font-semibold mb-4">Top Viewed Properties</h3>
        <div className="space-y-3">
          {[...properties].sort((a, b) => b.views - a.views).slice(0, 5).map((prop, i) => (
            <div key={prop.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/3">
              <span className="text-lg font-bold text-white/20 w-6">#{i + 1}</span>
              <img src={prop.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{prop.title}</p>
                <p className="text-xs text-white/40">{prop.location}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold flex items-center gap-1"><Eye size={12} /> {prop.views}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PropertiesTab() {
  const [searchTerm, setSearchTerm] = useState('')
  const [propertyList, setPropertyList] = useState(properties.map(p => ({...p})))

  const toggleFeatured = (id) => {
    setPropertyList(prev => prev.map(p => p.id === id ? {...p, featured: !p.featured} : p))
  }

  const toggleAd = (id) => {
    setPropertyList(prev => prev.map(p => p.id === id ? {...p, advertisement: !p.advertisement} : p))
  }

  const filtered = propertyList.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="flex-1 flex items-center gap-2 glass rounded-xl px-4">
          <Search size={16} className="text-white/30" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search properties..."
            className="w-full bg-transparent outline-none text-sm text-white placeholder-white/30 py-3"
          />
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs text-white/40 font-medium p-4">Property</th>
                <th className="text-left text-xs text-white/40 font-medium p-4">Price</th>
                <th className="text-left text-xs text-white/40 font-medium p-4">Type</th>
                <th className="text-center text-xs text-white/40 font-medium p-4">Featured</th>
                <th className="text-center text-xs text-white/40 font-medium p-4">Ad</th>
                <th className="text-center text-xs text-white/40 font-medium p-4">Views</th>
                <th className="text-right text-xs text-white/40 font-medium p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((prop) => (
                <tr key={prop.id} className="border-b border-white/3 hover:bg-white/3 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={prop.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <p className="font-medium text-sm">{prop.title}</p>
                        <p className="text-xs text-white/40">{prop.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-semibold gradient-text">{prop.price}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      prop.type === 'buy' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'
                    }`}>
                      {prop.type === 'buy' ? 'Sale' : 'Rent'}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={() => toggleFeatured(prop.id)} className="mx-auto">
                      {prop.featured ? (
                        <ToggleRight size={24} className="text-amber-400" />
                      ) : (
                        <ToggleLeft size={24} className="text-white/20" />
                      )}
                    </button>
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={() => toggleAd(prop.id)} className="mx-auto">
                      {prop.advertisement ? (
                        <ToggleRight size={24} className="text-amber-400" />
                      ) : (
                        <ToggleLeft size={24} className="text-white/20" />
                      )}
                    </button>
                  </td>
                  <td className="p-4 text-center text-sm text-white/60">{prop.views}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      <button className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:bg-white/10 transition-all">
                        <Edit size={14} className="text-white/60" />
                      </button>
                      <button className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:bg-red-500/10 transition-all">
                        <Trash2 size={14} className="text-red-400/60" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function AddPropertyTab() {
  return (
    <div className="glass rounded-2xl p-8">
      <h2 className="font-display text-2xl font-bold mb-6">Add New Property</h2>
      <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Property added (UI only)') }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-white/50">Title *</label>
            <input type="text" required placeholder="Property title" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-amber-500/30" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/50">Location *</label>
            <input type="text" required placeholder="e.g. Bandra West, Mumbai" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-amber-500/30" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-white/50">Price *</label>
            <input type="text" required placeholder="e.g. ₹2.5 Cr" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-amber-500/30" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/50">Type *</label>
            <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-amber-500/30">
              <option value="buy" className="bg-gray-900">Buy</option>
              <option value="rent" className="bg-gray-900">Rent</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/50">Category *</label>
            <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-amber-500/30">
              {['1RK','1BHK','2BHK','3BHK','Villa','Bungalow','Plot'].map(c => (
                <option key={c} value={c} className="bg-gray-900">{c}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-white/50">Bedrooms</label>
            <input type="number" placeholder="0" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-amber-500/30" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/50">Bathrooms</label>
            <input type="number" placeholder="0" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-amber-500/30" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/50">Area (sq.ft)</label>
            <input type="text" placeholder="e.g. 1200" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-amber-500/30" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm text-white/50">Description</label>
          <textarea rows={4} placeholder="Property description..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-amber-500/30 resize-none" />
        </div>

        {/* Toggles */}
        <div className="flex gap-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="hidden peer" />
            <div className="w-10 h-6 rounded-full bg-white/10 peer-checked:bg-amber-500 relative transition-colors after:content-[''] after:absolute after:top-1 after:left-1 after:w-4 after:h-4 after:bg-white after:rounded-full peer-checked:after:translate-x-4 after:transition-transform" />
            <span className="text-sm text-white/60">Featured</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="hidden peer" />
            <div className="w-10 h-6 rounded-full bg-white/10 peer-checked:bg-amber-500 relative transition-colors after:content-[''] after:absolute after:top-1 after:left-1 after:w-4 after:h-4 after:bg-white after:rounded-full peer-checked:after:translate-x-4 after:transition-transform" />
            <span className="text-sm text-white/60">Advertisement</span>
          </label>
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="text-sm text-white/50">Images</label>
          <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-amber-500/30 transition-colors cursor-pointer">
            <Upload size={32} className="text-white/20 mx-auto mb-3" />
            <p className="text-white/50 text-sm">Drag & drop or click to upload images</p>
            <p className="text-white/30 text-xs mt-1">JPG, PNG up to 10MB</p>
          </div>
        </div>

        {/* Video Upload */}
        <div className="space-y-2">
          <label className="text-sm text-white/50">Video (Optional)</label>
          <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-amber-500/30 transition-colors cursor-pointer">
            <Upload size={24} className="text-white/20 mx-auto mb-2" />
            <p className="text-white/50 text-sm">Upload property video</p>
          </div>
        </div>

        <button type="submit" className="btn-luxury flex items-center gap-2">
          <Plus size={16} /> Add Property
        </button>
      </form>
    </div>
  )
}

function LeadsTab() {
  return (
    <div className="space-y-4">
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs text-white/40 font-medium p-4">Lead</th>
                <th className="text-left text-xs text-white/40 font-medium p-4">Contact</th>
                <th className="text-left text-xs text-white/40 font-medium p-4">Property</th>
                <th className="text-left text-xs text-white/40 font-medium p-4">Date</th>
                <th className="text-left text-xs text-white/40 font-medium p-4">Status</th>
                <th className="text-right text-xs text-white/40 font-medium p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-white/3 hover:bg-white/3 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center font-bold text-sm text-black">
                        {lead.name.charAt(0)}
                      </div>
                      <p className="font-medium text-sm">{lead.name}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-white/60">{lead.email}</p>
                    <p className="text-xs text-white/40">{lead.phone}</p>
                  </td>
                  <td className="p-4 text-sm text-white/60">{lead.property}</td>
                  <td className="p-4 text-sm text-white/40">{lead.date}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                      lead.status === 'New' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      lead.status === 'Contacted' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      lead.status === 'Interested' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                      'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      <a href={`tel:${lead.phone}`} className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:bg-white/10 transition-all">
                        <Phone size={14} className="text-amber-400" />
                      </a>
                      <a href={`mailto:${lead.email}`} className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:bg-white/10 transition-all">
                        <Mail size={14} className="text-blue-400" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function AnalyticsTab() {
  const sortedByViews = [...properties].sort((a, b) => b.views - a.views)
  const totalViews = properties.reduce((a, p) => a + p.views, 0)

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-5 text-center">
          <Eye size={24} className="text-blue-400 mx-auto mb-2" />
          <p className="text-3xl font-bold">{totalViews.toLocaleString()}</p>
          <p className="text-xs text-white/40 mt-1">Total Views</p>
        </div>
        <div className="glass rounded-2xl p-5 text-center">
          <TrendingUp size={24} className="text-green-400 mx-auto mb-2" />
          <p className="text-3xl font-bold">{Math.round(totalViews / properties.length)}</p>
          <p className="text-xs text-white/40 mt-1">Avg. Views per Property</p>
        </div>
        <div className="glass rounded-2xl p-5 text-center">
          <Star size={24} className="text-amber-400 mx-auto mb-2" />
          <p className="text-3xl font-bold">{sortedByViews[0]?.views.toLocaleString()}</p>
          <p className="text-xs text-white/40 mt-1">Highest Views</p>
        </div>
      </div>

      {/* Views Chart (bar representation) */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-display text-lg font-semibold mb-6">Views by Property</h3>
        <div className="space-y-4">
          {sortedByViews.map((prop) => {
            const pct = (prop.views / sortedByViews[0].views) * 100
            return (
              <div key={prop.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={prop.images[0]} alt="" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                    <span className="truncate text-white/70">{prop.title}</span>
                  </div>
                  <span className="text-white/50 flex-shrink-0 ml-4">{prop.views}</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="h-full gradient-gold rounded-full"
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
