import React from 'react';
import { useApp } from '../../context/AppContext';
import { HariLogo } from '../common/HariLogo';
import { formatWhatsAppPhone } from '../../utils/whatsapp';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Heart, 
  ShieldCheck, 
  Truck, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, categories, setCurrentView, setSelectedCategorySlug } = useApp();
  const cleanWhatsappNumber = formatWhatsAppPhone(settings.whatsapp_number);

  return (
    <footer className="bg-[#2B0707] text-[#FDEEE4] pt-16 pb-12 border-t-4 border-[#EA580C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Brand Banner & Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-[#521212]">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#450E0E] border border-[#6B1818] flex items-center justify-center shrink-0 text-[#F59E0B]">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-white text-base">Pure Cow Ghee & Spices</h4>
              <p className="text-xs text-[#FDEEE4]/80 mt-0.5">Authentic aroma and golden crispness in every dosa, biriyani & roast.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#450E0E] border border-[#6B1818] flex items-center justify-center shrink-0 text-[#EA580C]">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-white text-base">Non-Veg & Veg Delicacies</h4>
              <p className="text-xs text-[#FDEEE4]/80 mt-0.5">Chettinad mutton sukka, pepper chicken, Thalassery biriyani & tiffins.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#450E0E] border border-[#6B1818] flex items-center justify-center shrink-0 text-[#F59E0B]">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-white text-base">Fast Local Delivery</h4>
              <p className="text-xs text-[#FDEEE4]/80 mt-0.5">Insulated hot food packaging right to your doorstep in 30 mins.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#450E0E] border border-[#6B1818] flex items-center justify-center shrink-0 text-[#25D366]">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-white text-base">WhatsApp Ordering</h4>
              <p className="text-xs text-[#FDEEE4]/80 mt-0.5">Order in seconds with instant chef confirmation & real-time updates.</p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-[#521212]">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={() => setCurrentView('home')}
              className="cursor-pointer inline-block"
            >
              <HariLogo size="md" lightMode={true} />
            </div>
            <p className="text-sm text-[#FDEEE4]/80 leading-relaxed max-w-sm">
              Bringing families together with authentic South Indian flavours, Chettinad non-veg specialties, traditional firewood recipes, and unconditional hospitality. Freshly cooked, never pre-packed.
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${cleanWhatsappNumber}?text=Hi%20Hari%20Restaurant%2C%20I%20would%20like%20to%20place%20an%20order`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] text-white font-bold text-xs hover:bg-[#20BA5A] transition-all shadow-md active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                Chat & Order on WhatsApp
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F59E0B] mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => setCurrentView('home')}
                  className="hover:text-[#F59E0B] transition-colors flex items-center gap-1 group"
                >
                  <span>Home</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('menu')}
                  className="hover:text-[#F59E0B] transition-colors flex items-center gap-1 group"
                >
                  <span>Complete Menu</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('about')}
                  className="hover:text-[#F59E0B] transition-colors flex items-center gap-1 group"
                >
                  <span>Our Heritage & Story</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('track-order')}
                  className="hover:text-[#F59E0B] transition-colors flex items-center gap-1 group"
                >
                  <span>Track Live Order</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('account')}
                  className="hover:text-[#F59E0B] transition-colors flex items-center gap-1 group"
                >
                  <span>Customer Account</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F59E0B] mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      setSelectedCategorySlug(cat.slug);
                      setCurrentView('menu');
                    }}
                    className="hover:text-[#EA580C] transition-colors flex items-center justify-between w-full text-left"
                  >
                    <span>{cat.name}</span>
                    <ArrowUpRight className="w-3 h-3 text-[#EA580C] group-hover:text-white" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Reach Us */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F59E0B] mb-4">
              Contact & Timings
            </h4>
            <ul className="space-y-3 text-sm text-[#FDEEE4]/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed text-white">
                  {settings.address}, {settings.landmark}, {settings.city} - {settings.pincode}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#EA580C] shrink-0" />
                <a href={`tel:${settings.phone}`} className="text-xs hover:text-white text-white">
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#EA580C] shrink-0" />
                <a href={`mailto:${settings.email}`} className="text-xs hover:text-white text-white">
                  {settings.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-white">Daily Kitchen Hours:</p>
                  <p className="text-[#FDEEE4]/70">{settings.open_time} - {settings.close_time}</p>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#FDEEE4]/60 gap-4">
          <p>© {new Date().getFullYear()} {settings.restaurant_name}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>FSSAI Certified Kitchen</span>
            <span>•</span>
            <span>100% Contactless Delivery</span>
            <span>•</span>
            <span>WhatsApp Secure Ordering</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
