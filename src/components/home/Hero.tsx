import React from 'react';
import { useApp } from '../../context/AppContext';
import { openWhatsAppOrder } from '../../utils/whatsapp';
import { 
  ArrowRight, 
  MessageCircle, 
  Sparkles, 
  Star, 
  Clock, 
  ShieldCheck, 
  HeartHandshake,
  Utensils
} from 'lucide-react';

export const Hero: React.FC = () => {
  const { setCurrentView, settings } = useApp();
  const cleanWhatsappNumber = settings.whatsapp_number.replace(/[^0-9]/g, '');

  return (
    <div className="relative overflow-hidden bg-[#FAF7F2] border-b border-[#E8DFD3] py-12 lg:py-20">
      
      {/* Subtle decorative background circles */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#E5DDD2]/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#E6C687]/20 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Top Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F4ECE1] border border-[#DECBB6] text-[#8F4A2D] text-xs font-bold tracking-tight shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#C85A32]" />
              <span>Authentic Firewood South Indian & Chettinad Kitchen • Estd. 1994</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#183928] leading-[1.15] tracking-tight">
              Aromatic Spices, Pure Desi Ghee & Sizzling Non-Veg Feasts.
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-[#5A5046] leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Firewood-cooked Thalassery Mutton Dum Biriyani, Madurai Mutton Kari Dosa, Chettinad Sukka, and golden crispy Ghee Roasts. Order in 30 seconds directly via WhatsApp.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={() => setCurrentView('menu')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#183928] text-white hover:bg-[#10271B] font-bold text-sm flex items-center justify-center gap-2.5 shadow-xl hover:shadow-2xl active:scale-95 transition-all"
              >
                <Utensils className="w-4 h-4" />
                <span>Explore Full Menu</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`https://wa.me/${cleanWhatsappNumber}?text=Hi%20Hari%20Restaurant%2C%20I%20would%20like%20to%20place%20a%20food%20order`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#25D366] text-stone-900 hover:bg-[#1EBE5D] font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-stone-900" />
                <span>Order on WhatsApp</span>
              </a>
            </div>

            {/* Trust Metrics Pill */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#E8DFD3] max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-1 text-amber-600 font-extrabold text-base sm:text-lg">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>4.9★</span>
                </div>
                <p className="text-[11px] text-stone-500 font-medium mt-0.5">2,500+ Family Reviews</p>
              </div>

              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-1 text-[#183928] font-extrabold text-base sm:text-lg">
                  <Clock className="w-4 h-4 text-[#C85A32]" />
                  <span>30 Mins</span>
                </div>
                <p className="text-[11px] text-stone-500 font-medium mt-0.5">Hot Insulated Delivery</p>
              </div>

              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-1 text-[#8F4A2D] font-extrabold text-base sm:text-lg">
                  <ShieldCheck className="w-4 h-4 text-[#8F4A2D]" />
                  <span>100% Ghee</span>
                </div>
                <p className="text-[11px] text-stone-500 font-medium mt-0.5">No Artificial Flavours</p>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Image Frame with elegant border */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-4/3 bg-stone-900">
                <img
                  src="https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=900&auto=format&fit=crop&q=80"
                  alt="Crispy South Indian Ghee Roast Dosa with Samber and Chutneys"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#E6C687] bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
                    Signature Specialty
                  </span>
                  <h3 className="font-serif text-xl font-bold mt-1 drop-shadow-md">
                    Special Ghee Roast Dosa
                  </h3>
                  <p className="text-xs text-stone-200">
                    Served with 3 fresh chutneys & boiling hot Madras sambar
                  </p>
                </div>
              </div>

              {/* Floating Chef Recommendation Badge */}
              <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-white p-3.5 rounded-2xl shadow-xl border border-[#E8DFD3] flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="w-10 h-10 rounded-xl bg-[#F4ECE1] text-[#8F4A2D] flex items-center justify-center font-bold text-lg">
                  🥇
                </div>
                <div>
                  <p className="text-xs font-extrabold text-stone-900">Voted Best Family Dosa</p>
                  <p className="text-[10px] text-stone-500">Chennai Food Guide 2025</p>
                </div>
              </div>

              {/* Floating WhatsApp Live Booking Badge */}
              <div className="absolute -top-4 -right-4 sm:-right-6 bg-[#25D366] text-stone-900 p-3 rounded-2xl shadow-xl flex items-center gap-2.5 font-bold text-xs">
                <MessageCircle className="w-4 h-4 fill-stone-900" />
                <span>Instant WhatsApp Confirm</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
