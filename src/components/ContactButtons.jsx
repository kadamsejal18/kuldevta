import { Phone, MessageCircle } from 'lucide-react';

const ContactButtons = ({ propertyId, className = '' }) => {
  const PHONE_NUMBER = '9930388219';
  const WHATSAPP_NUMBER = '919930388219'; // Include country code

  const handleCall = () => {
    window.location.href = `tel:${PHONE_NUMBER}`;
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hi, I'm interested in property ID: ${propertyId}. Please provide more details.`
    );
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`,
      '_blank'
    );
  };

  return (
    <div className={`flex gap-3 ${className}`}>
      <button
        onClick={handleCall}
        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        <Phone size={20} />
        <span>Call Now</span>
      </button>
      <button
        onClick={handleWhatsApp}
        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
      >
        <MessageCircle size={20} />
        <span>WhatsApp</span>
      </button>
    </div>
  );
};

export default ContactButtons;
