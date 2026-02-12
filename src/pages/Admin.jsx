import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { LayoutDashboard, Building2, Plus, Users, Eye, Search, ToggleLeft, ToggleRight, Edit, Trash2, Upload, ArrowUpRight } from 'lucide-react'
import { authAPI, leadAPI, propertyAPI } from '../services/api'
import { normalizeProperty } from '../utils/propertyMapper'

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'properties', label: 'Properties', icon: Building2 },
  { id: 'add', label: 'Add Property', icon: Plus },
  { id: 'leads', label: 'Leads', icon: Users },
  { id: 'views', label: 'Analytics', icon: Eye },
]

const initialForm = { title: '', city: '', price: '', type: 'buy', category: '1BHK', bedrooms: '', bathrooms: '', area: '', description: '', featured: false, advertised: false }

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [properties, setProperties] = useState([])
  const [leads, setLeads] = useState([])
  const [form, setForm] = useState(initialForm)
  const [images, setImages] = useState([])
  const [videos, setVideos] = useState([])
  const [editingId, setEditingId] = useState('')

  const loadData = async () => {
    const [propertyRes, leadsRes] = await Promise.all([
      propertyAPI.getAdminProperties({ limit: 200 }),
      leadAPI.getAll({ limit: 50 }),
    ])
    setProperties((propertyRes.properties || []).map(normalizeProperty))
    setLeads(leadsRes.leads || [])
  }

  useEffect(() => {
    if (!token) return
    loadData().catch((error) => {
      console.error('Admin load error:', error)
      if (error.message?.toLowerCase().includes('not authorized')) {
        localStorage.removeItem('token')
        setToken('')
      }
    })
  }, [token])

  const onLogin = async (e) => {
    e.preventDefault()
    const data = await authAPI.login(credentials.email, credentials.password)
    localStorage.setItem('token', data.token)
    localStorage.setItem('admin', JSON.stringify(data.admin))
    setToken(data.token)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    images.forEach((img) => fd.append('images', img))
    videos.forEach((video) => fd.append('videos', video))

    if (editingId) await propertyAPI.update(editingId, fd)
    else await propertyAPI.create(fd)

    setForm(initialForm)
    setImages([])
    setVideos([])
    setEditingId('')
    await loadData()
    setActiveTab('properties')
  }

  const stats = useMemo(() => ([
    { label: 'Total Properties', value: properties.length, icon: Building2, change: '+0', color: 'text-amber-400' },
    { label: 'Total Leads', value: leads.length, icon: Users, change: '+0', color: 'text-green-400' },
    { label: 'Total Views', value: properties.reduce((a, p) => a + Number(p.views || 0), 0).toLocaleString(), icon: Eye, change: '+0', color: 'text-blue-400' },
    { label: 'Featured', value: properties.filter((p) => p.featured).length, icon: ArrowUpRight, change: '+0', color: 'text-purple-400' },
  ]), [properties, leads])

  if (!token) {
    return (
      <div className="min-h-screen pt-24 pb-20 max-w-md mx-auto px-4">
        <div className="glass rounded-2xl p-6">
          <h2 className="font-display text-2xl font-bold mb-4">Admin Login</h2>
          <form className="space-y-4" onSubmit={onLogin}>
            <input type="email" required value={credentials.email} onChange={(e) => setCredentials((p) => ({ ...p, email: e.target.value }))} placeholder="Email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" />
            <input type="password" required value={credentials.password} onChange={(e) => setCredentials((p) => ({ ...p, password: e.target.value }))} placeholder="Password" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" />
            <button type="submit" className="btn-luxury w-full">Login</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold">Admin <span className="gradient-text">Panel</span></h1>
          <p className="text-white/40 mt-1">Manage properties, leads, and analytics</p>
        </motion.div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-56 flex-shrink-0"><div className="glass rounded-2xl p-3 flex lg:flex-col gap-1 overflow-x-auto hide-scrollbar">{tabs.map((tab) => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id ? 'gradient-gold text-black' : 'text-white/50 hover:text-white hover:bg-white/5'}`}><tab.icon size={18} />{tab.label}</button>)}</div></div>
          <div className="flex-1 min-w-0 space-y-6">
            {activeTab === 'dashboard' && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{stats.map((stat) => <div key={stat.label} className="glass rounded-2xl p-5"><stat.icon size={20} className={stat.color} /><p className="text-2xl font-bold mt-2">{stat.value}</p><p className="text-xs text-white/40 mt-1">{stat.label}</p></div>)}</div>}
            {activeTab === 'properties' && <PropertiesTable properties={properties} refresh={loadData} onEdit={(prop) => { setEditingId(prop.id); setForm({ ...initialForm, ...prop, city: prop.city || '', price: prop.priceNum || '' }); setActiveTab('add') }} />}
            {activeTab === 'add' && <div className="glass rounded-2xl p-8"><h2 className="font-display text-2xl font-bold mb-6">{editingId ? 'Edit Property' : 'Add New Property'}</h2><form className="space-y-6" onSubmit={handleSubmit}><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><input required placeholder="Property title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" /><input required placeholder="City" value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" /></div><div className="grid grid-cols-1 sm:grid-cols-3 gap-4"><input required type="number" placeholder="Price" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm" /><select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm"><option value="buy" className="bg-gray-900">Buy</option><option value="rent" className="bg-gray-900">Rent</option></select><select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm">{['1BHK', '2BHK', '3BHK', '4BHK', 'Villa', 'Plot', 'Commercial', 'Office', 'Shop', 'Warehouse'].map((c) => <option key={c} value={c} className="bg-gray-900">{c}</option>)}</select></div><textarea required rows={4} placeholder="Property description..." value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm resize-none" /><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><label className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-amber-500/30 transition-colors cursor-pointer"><Upload size={32} className="text-white/20 mx-auto mb-3" /><p className="text-white/50 text-sm">Upload images</p><input type="file" accept="image/*" multiple className="hidden" onChange={(e) => setImages(Array.from(e.target.files || []))} /></label><label className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-amber-500/30 transition-colors cursor-pointer"><Upload size={24} className="text-white/20 mx-auto mb-2" /><p className="text-white/50 text-sm">Upload video</p><input type="file" accept="video/*" multiple className="hidden" onChange={(e) => setVideos(Array.from(e.target.files || []))} /></label></div><button type="submit" className="btn-luxury flex items-center gap-2"><Plus size={16} /> {editingId ? 'Update Property' : 'Add Property'}</button></form></div>}
            {activeTab === 'leads' && <div className="glass rounded-2xl p-6"><p className="text-white/60">Leads: {leads.length}</p></div>}
            {activeTab === 'views' && <div className="glass rounded-2xl p-6"><p className="text-white/60">Top viewed property: {properties.sort((a, b) => b.views - a.views)[0]?.title || 'N/A'}</p></div>}
          </div>
        </div>
      </div>
    </div>
  )
}

function PropertiesTable({ properties, refresh, onEdit }) {
  const [searchTerm, setSearchTerm] = useState('')
  const filtered = properties.filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.location.toLowerCase().includes(searchTerm.toLowerCase()))

  const toggleFeatured = async (id) => { await propertyAPI.toggleFeatured(id); await refresh() }
  const toggleAd = async (id) => { await propertyAPI.toggleActive(id); await refresh() }
  const onDelete = async (id) => { await propertyAPI.delete(id); await refresh() }

  return (
    <div className="space-y-4">
      <div className="flex-1 flex items-center gap-2 glass rounded-xl px-4"><Search size={16} className="text-white/30" /><input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search properties..." className="w-full bg-transparent outline-none text-sm text-white placeholder-white/30 py-3" /></div>
      <div className="glass rounded-2xl overflow-hidden"><div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-white/5"><th className="text-left text-xs text-white/40 font-medium p-4">Property</th><th className="text-left text-xs text-white/40 font-medium p-4">Price</th><th className="text-center text-xs text-white/40 font-medium p-4">Featured</th><th className="text-center text-xs text-white/40 font-medium p-4">Active</th><th className="text-right text-xs text-white/40 font-medium p-4">Actions</th></tr></thead><tbody>{filtered.map((prop) => <tr key={prop.id} className="border-b border-white/3 hover:bg-white/3 transition-colors"><td className="p-4"><div className="flex items-center gap-3"><img src={prop.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover" /><div><p className="font-medium text-sm">{prop.title}</p><p className="text-xs text-white/40">{prop.location}</p></div></div></td><td className="p-4 text-sm font-semibold gradient-text">{prop.price}</td><td className="p-4 text-center"><button onClick={() => toggleFeatured(prop.id)}>{prop.featured ? <ToggleRight size={24} className="text-amber-400" /> : <ToggleLeft size={24} className="text-white/20" />}</button></td><td className="p-4 text-center"><button onClick={() => toggleAd(prop.id)}>{prop.active ? <ToggleRight size={24} className="text-amber-400" /> : <ToggleLeft size={24} className="text-white/20" />}</button></td><td className="p-4"><div className="flex items-center justify-end gap-1"><button onClick={() => onEdit(prop)} className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:bg-white/10 transition-all"><Edit size={14} className="text-white/60" /></button><button onClick={() => onDelete(prop.id)} className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:bg-red-500/10 transition-all"><Trash2 size={14} className="text-red-400/60" /></button></div></td></tr>)}</tbody></table></div></div>
    </div>
  )
}
