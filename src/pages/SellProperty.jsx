import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Send, CheckCircle, Image, Video, MapPin, Phone, Home, IndianRupee } from 'lucide-react'

export default function SellProperty() {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '',
    propertyType: '', bhk: '', furnishing: '',
    location: '', area: '', price: '', description: '',
    images: [], hasVideo: false
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="w-20 h-20 rounded-2xl gradient-gold mx-auto flex items-center justify-center mb-6">
            <CheckCircle size={36} className="text-black" />
          </div>
          <h2 className="font-display text-3xl font-bold mb-4">Property Submitted!</h2>
          <p className="text-white/40 mb-8">
            Thank you for listing your property with Kuldevta Estate Agency. Our team will review your submission and contact you within 24 hours.
          </p>
          <a href="tel:9930388219" className="btn-luxury inline-flex items-center gap-2">
            <Phone size={16} /> Call for Quick Listing
          </a>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <p className="text-amber-400/60 text-sm tracking-widest uppercase mb-3">List your property</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            Sell Your <span className="gradient-text">Property</span>
          </h1>
          <p className="text-white/40 max-w-lg mx-auto">
            Get the best value for your property. Fill in the details and our experts will handle the rest.
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {[
            { num: 1, label: 'Personal Info' },
            { num: 2, label: 'Property Details' },
            { num: 3, label: 'Media & Submit' },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center gap-3">
              <button
                onClick={() => setStep(s.num)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                  step >= s.num ? 'gradient-gold text-black' : 'glass text-white/40'
                }`}
              >
                {step > s.num ? <CheckCircle size={18} /> : s.num}
              </button>
              <span className={`hidden sm:block text-sm ${step >= s.num ? 'text-white' : 'text-white/30'}`}>
                {s.label}
              </span>
              {i < 2 && <div className={`w-8 sm:w-16 h-px ${step > s.num ? 'gradient-gold' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-2xl p-8"
          >
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="font-display text-2xl font-bold flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                    <Phone size={18} className="text-black" />
                  </div>
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-white/50">Full Name *</label>
                    <input type="text" required value={formData.name} onChange={(e) => updateField('name', e.target.value)} placeholder="Enter your name" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-amber-500/30 transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-white/50">Phone Number *</label>
                    <input type="tel" required value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="Enter phone number" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-amber-500/30 transition-colors" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-white/50">Email Address</label>
                  <input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} placeholder="Enter email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-amber-500/30 transition-colors" />
                </div>
                <div className="flex justify-end">
                  <button type="button" onClick={() => setStep(2)} className="btn-luxury flex items-center gap-2">
                    Next Step <CheckCircle size={16} />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="font-display text-2xl font-bold flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                    <Home size={18} className="text-black" />
                  </div>
                  Property Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-white/50">Property Type *</label>
                    <select value={formData.propertyType} onChange={(e) => updateField('propertyType', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-amber-500/30">
                      <option value="" className="bg-gray-900">Select Type</option>
                      <option value="Apartment" className="bg-gray-900">Apartment</option>
                      <option value="Villa" className="bg-gray-900">Villa</option>
                      <option value="Bungalow" className="bg-gray-900">Bungalow</option>
                      <option value="Plot" className="bg-gray-900">Plot</option>
                      <option value="Commercial" className="bg-gray-900">Commercial</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-white/50">Configuration</label>
                    <select value={formData.bhk} onChange={(e) => updateField('bhk', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-amber-500/30">
                      <option value="" className="bg-gray-900">Select BHK</option>
                      {['1RK','1BHK','2BHK','3BHK','4BHK','5BHK+'].map(b => (
                        <option key={b} value={b} className="bg-gray-900">{b}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-white/50">Furnishing</label>
                    <select value={formData.furnishing} onChange={(e) => updateField('furnishing', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-amber-500/30">
                      <option value="" className="bg-gray-900">Select</option>
                      <option value="Furnished" className="bg-gray-900">Furnished</option>
                      <option value="Semi-Furnished" className="bg-gray-900">Semi-Furnished</option>
                      <option value="Unfurnished" className="bg-gray-900">Unfurnished</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-white/50">Area (sq.ft)</label>
                    <input type="text" value={formData.area} onChange={(e) => updateField('area', e.target.value)} placeholder="e.g. 1200" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-amber-500/30 transition-colors" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-white/50">Location *</label>
                    <input type="text" required value={formData.location} onChange={(e) => updateField('location', e.target.value)} placeholder="e.g. Bandra West, Mumbai" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-amber-500/30 transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-white/50">Expected Price *</label>
                    <input type="text" required value={formData.price} onChange={(e) => updateField('price', e.target.value)} placeholder="e.g. ₹2.5 Cr" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-amber-500/30 transition-colors" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-white/50">Description</label>
                  <textarea value={formData.description} onChange={(e) => updateField('description', e.target.value)} rows={4} placeholder="Describe your property..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-amber-500/30 transition-colors resize-none" />
                </div>
                <div className="flex justify-between">
                  <button type="button" onClick={() => setStep(1)} className="btn-glass text-sm">Back</button>
                  <button type="button" onClick={() => setStep(3)} className="btn-luxury flex items-center gap-2">
                    Next Step <CheckCircle size={16} />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="font-display text-2xl font-bold flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                    <Image size={18} className="text-black" />
                  </div>
                  Upload Media
                </h2>

                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="text-sm text-white/50">Property Images</label>
                  <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-amber-500/30 transition-colors cursor-pointer">
                    <Upload size={40} className="text-white/20 mx-auto mb-4" />
                    <p className="text-white/60 text-sm">Drag & drop images here or click to browse</p>
                    <p className="text-white/30 text-xs mt-1">JPG, PNG up to 10MB each</p>
                    <input type="file" multiple accept="image/*" className="hidden" />
                    <button type="button" className="btn-glass text-sm mt-4">
                      <Image size={14} className="inline mr-2" /> Choose Images
                    </button>
                  </div>
                </div>

                {/* Video Upload */}
                <div className="space-y-2">
                  <label className="text-sm text-white/50">Property Video (Optional)</label>
                  <div className="border-2 border-dashed border-white/10 rounded-2xl p-6 text-center hover:border-amber-500/30 transition-colors cursor-pointer">
                    <Video size={32} className="text-white/20 mx-auto mb-3" />
                    <p className="text-white/60 text-sm">Upload a walkthrough video</p>
                    <p className="text-white/30 text-xs mt-1">MP4, MOV up to 100MB</p>
                    <button type="button" className="btn-glass text-sm mt-3">
                      <Video size={14} className="inline mr-2" /> Choose Video
                    </button>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button type="button" onClick={() => setStep(2)} className="btn-glass text-sm">Back</button>
                  <button type="submit" className="btn-luxury flex items-center gap-2">
                    <Send size={16} /> Submit Property
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </form>
      </div>
    </div>
  )
}
