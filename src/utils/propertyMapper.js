export const formatPrice = (value) => {
  const amount = Number(value || 0)
  if (!amount) return '₹0'

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export const normalizeProperty = (property) => {
  const images = Array.isArray(property.images) && property.images.length > 0
    ? property.images.map((image) => (typeof image === 'string' ? image : image.url)).filter(Boolean)
    : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200']

  const videos = Array.isArray(property.videos)
    ? property.videos.map((video) => (typeof video === 'string' ? video : video.url)).filter(Boolean)
    : []

  return {
    ...property,
    id: property._id,
    location: property.city || property.address || '',
    priceNum: Number(property.price || 0),
    price: formatPrice(property.price),
    images,
    videos,
    furnishing: property.furnishing || 'N/A',
    area: property.area ? `${property.area} sq.ft` : 'N/A',
    agent: property.contact?.name || 'Kuldevta Agent',
    postedDate: property.createdAt,
    amenities: Array.isArray(property.amenities) ? property.amenities : [],
    video: videos[0] || null,
    advertisement: Boolean(property.advertised),
  }
}
