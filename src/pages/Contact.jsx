import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, MessageCircle, Mail, MapPin, Send, Clock, Bot, User, ArrowRight } from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <p className="text-amber-400/60 text-sm tracking-widest uppercase mb-3">Get in touch</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            Contact <span className="gradient-text">Us</span>
          </h1>
          <p className="text-white/40 max-w-lg mx-auto">
            Have questions about a property? Want to schedule a visit? We're here to help.
          </p>
        </motion.div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {[
            {
              icon: Phone,
              label: 'Call Us',
              value: '9930388219',
              sub: 'Mon-Sat, 9am-8pm',
              href: 'tel:9930388219',
              color: 'text-amber-400',
              bg: 'glass-gold'
            },
            {
              icon: MessageCircle,
              label: 'WhatsApp',
              value: '9930388219',
              sub: 'Quick response',
              href: 'https://wa.me/919930388219',
              color: 'text-green-400',
              bg: 'bg-green-500/10 border border-green-500/20'
            },
            {
              icon: Mail,
              label: 'Email',
              value: 'info@kuldevta.com',
              sub: 'We reply within 24hrs',
              href: 'mailto:info@kuldevta.com',
              color: 'text-blue-400',
              bg: 'bg-blue-500/10 border border-blue-500/20'
            },
            {
              icon: MapPin,
              label: 'Visit Office',
              value: 'Mumbai, Maharashtra',
              sub: 'By appointment',
              href: '#map',
              color: 'text-rose-400',
              bg: 'bg-rose-500/10 border border-rose-500/20'
            }
          ].map((item, i) => (
            <motion.a
              key={item.label}
              href={item.href}
              target={item.href.startsWith('http') ? '_blank' : undefined}
              rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 card-hover group block"
            >
              <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center mb-4`}>
                <item.icon size={20} className={item.color} />
              </div>
              <h3 className="font-semibold text-sm text-white/60 mb-1">{item.label}</h3>
              <p className="font-medium group-hover:text-amber-400 transition-colors">{item.value}</p>
              <p className="text-xs text-white/30 mt-1 flex items-center gap-1">
                <Clock size={10} /> {item.sub}
              </p>
            </motion.a>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-8"
          >
            <h2 className="font-display text-2xl font-bold mb-6">Send us a Message</h2>

            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                <div className="w-16 h-16 rounded-full gradient-gold mx-auto flex items-center justify-center mb-4">
                  <Send size={24} className="text-black" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">Message Sent!</h3>
                <p className="text-white/40">We'll get back to you shortly</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="text" placeholder="Your Name" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-amber-500/30 transition-colors" onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  <input type="tel" placeholder="Phone Number" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-amber-500/30 transition-colors" onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>
                <input type="email" placeholder="Email Address" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-amber-500/30 transition-colors" onChange={(e) => setFormData({...formData, email: e.target.value})} />
                <input type="text" placeholder="Subject" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-amber-500/30 transition-colors" onChange={(e) => setFormData({...formData, subject: e.target.value})} />
                <textarea placeholder="Your Message" rows={5} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-amber-500/30 transition-colors resize-none" onChange={(e) => setFormData({...formData, message: e.target.value})} />
                <button type="submit" className="w-full btn-luxury flex items-center justify-center gap-2">
                  <Send size={16} /> Send Message
                </button>
              </form>
            )}
          </motion.div>

          {/* Right Side */}
          <div className="space-y-6">
            {/* Google Map */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              id="map"
              className="glass rounded-2xl overflow-hidden h-[300px]"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.1160984896!2d72.74109995!3d19.08219865!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.8) contrast(1.2)' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>

            {/* Chatbot UI */}
            <ChatbotUI />
          </div>
        </div>
      </div>
    </div>
  )
}

function ChatbotUI() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hello! I\'m the Kuldevta Estate assistant. How can I help you find your dream home today?' }
  ])
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setMessages(prev => [...prev, { from: 'user', text: userMsg }])
    setInput('')

    setTimeout(() => {
      let reply = 'Thank you for your query! Our team will get back to you shortly. Meanwhile, you can browse our featured properties or contact us directly at 9930388219.'
      if (userMsg.toLowerCase().includes('price') || userMsg.toLowerCase().includes('cost')) {
        reply = 'Our properties range from ₹55 Lakhs to ₹12 Crores. For specific pricing, please check our Properties page or call us at 9930388219.'
      } else if (userMsg.toLowerCase().includes('rent')) {
        reply = 'We have furnished, semi-furnished, and unfurnished rentals starting from ₹12,000/month. Would you like to browse our rental listings?'
      } else if (userMsg.toLowerCase().includes('buy') || userMsg.toLowerCase().includes('purchase')) {
        reply = 'Great choice! We have 1RK to Bungalows available. Check our Buy section or tell me your budget and preferred location.'
      } else if (userMsg.toLowerCase().includes('location') || userMsg.toLowerCase().includes('area')) {
        reply = 'We cover all major Mumbai areas including Bandra, Juhu, Worli, Powai, Andheri, Thane, and Navi Mumbai.'
      }
      setMessages(prev => [...prev, { from: 'bot', text: reply }])
    }, 1000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="glass rounded-2xl overflow-hidden"
    >
      <div className="p-4 border-b border-white/5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl gradient-gold flex items-center justify-center">
          <Bot size={18} className="text-black" />
        </div>
        <div>
          <h3 className="font-semibold text-sm">Property Assistant</h3>
          <p className="text-xs text-green-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> Online
          </p>
        </div>
      </div>

      <div className="h-[250px] overflow-y-auto p-4 space-y-3 hide-scrollbar">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-2 ${msg.from === 'user' ? 'justify-end' : ''}`}
          >
            {msg.from === 'bot' && (
              <div className="w-7 h-7 rounded-lg gradient-gold flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot size={14} className="text-black" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm ${
              msg.from === 'user'
                ? 'gradient-gold text-black'
                : 'glass text-white/80'
            }`}>
              {msg.text}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-3 border-t border-white/5">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about properties..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-amber-500/30"
          />
          <button onClick={handleSend} className="btn-luxury !p-3 !rounded-xl">
            <Send size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
