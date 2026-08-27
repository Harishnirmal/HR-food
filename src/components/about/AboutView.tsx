import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  Heart, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle, 
  ChefHat, 
  ShieldCheck,
  Utensils
} from 'lucide-react';

export const AboutView: React.FC = () => {
  const { settings, setCurrentView } = useApp();
  const cleanWhatsappNumber = settings.whatsapp_number.replace(/[^0-9]/g, '');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      
      {/* Story Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4ECE1] text-[#8F4A2D] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#C85A32]" />
            <span>Serving Chennai Since 1994</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#183928] leading-tight">
            Preserving South Indian & Chettinad Heritage, One Dish at a Time.
          </h1>

          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            Hari Restaurant started thirty years ago as a humble family kitchen near Besant Nagar beach. Founded with a deep passion for authentic firewood cooking, our mission was simple: prepare traditional non-veg feasts and pure vegetarian delicacies with pure cow ghee, stone-ground spices, and unconditional hospitality.
          </p>

          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            Today, second-generation culinary masters carry forward the exact recipes: fragrant Thalassery Mutton Dum Biriyani, Madurai Kari Dosa, tender Chettinad Mutton Sukka, and golden crisp Ghee Roasts that taste just like home.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setCurrentView('menu')}
              className="px-6 py-3 rounded-xl bg-[#183928] text-white font-bold text-xs shadow-md hover:bg-[#10271B] transition-all"
            >
              Explore Our Dishes
            </button>
            <a
              href={`https://wa.me/${cleanWhatsappNumber}?text=Hi%20Hari%20Restaurant%2C%20I%20would%20like%20to%20reserve%20a%20family%20table`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-[#25D366] text-stone-900 font-bold text-xs hover:bg-[#1EBE5D] flex items-center gap-2 shadow-md transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-stone-900" />
              Book Table on WhatsApp
            </a>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-4/5 bg-stone-900">
            <img
              src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80"
              alt="Traditional South Indian Thali Feast on Banana Leaf"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <p className="font-serif text-xl font-bold">Chef Subbiah's Secret Ghee Masala</p>
              <p className="text-xs text-stone-200 mt-1">Slow roasted spices blended with pure cow ghee.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Values & Ingredients Grid */}
      <div className="bg-[#FAF7F2] p-8 sm:p-12 rounded-3xl border border-[#E8DFD3] space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8F4A2D]">
            Zero Compromise
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Our 4 Golden Promises
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-[#E8DFD3] space-y-2 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#F4ECE1] text-[#8F4A2D] flex items-center justify-center font-bold text-lg">
              🧈
            </div>
            <h3 className="font-serif font-bold text-sm text-stone-900">Pure Ghee Only</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              We never use palm oil or artificial cooking fats. Only farm-fresh cow ghee.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E8DFD3] space-y-2 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#F4ECE1] text-[#8F4A2D] flex items-center justify-center font-bold text-lg">
              🥥
            </div>
            <h3 className="font-serif font-bold text-sm text-stone-900">3-Hour Chutney Rule</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Chutneys are discarded and freshly stone-ground every 3 hours for optimal aroma.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E8DFD3] space-y-2 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#F4ECE1] text-[#8F4A2D] flex items-center justify-center font-bold text-lg">
              🪵
            </div>
            <h3 className="font-serif font-bold text-sm text-stone-900">Firewood Embers</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Our Thalassery Biriyanis and rasams are slow simmered over traditional wood coals.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E8DFD3] space-y-2 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#F4ECE1] text-[#8F4A2D] flex items-center justify-center font-bold text-lg">
              ❤️
            </div>
            <h3 className="font-serif font-bold text-sm text-stone-900">Atithi Devo Bhava</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Every guest and online customer is treated as a revered family member.
            </p>
          </div>
        </div>
      </div>

      {/* Location & Contact Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="bg-white p-8 rounded-3xl border border-[#E8DFD3] shadow-xs space-y-5">
          <h3 className="font-serif font-bold text-2xl text-stone-900">
            Visit Our Dining Hall
          </h3>
          
          <div className="space-y-4 text-xs sm:text-sm text-stone-600">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#C85A32] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-stone-900">Restaurant Address</p>
                <p>{settings.address}, {settings.landmark}</p>
                <p>{settings.city} - {settings.pincode}, Tamil Nadu, India</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-[#C85A32] shrink-0" />
              <div>
                <p className="font-bold text-stone-900">Customer Helpline</p>
                <p>{settings.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#C85A32] shrink-0" />
              <div>
                <p className="font-bold text-stone-900">Daily Kitchen Hours</p>
                <p>{settings.open_time} to {settings.close_time}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#C85A32] shrink-0" />
              <div>
                <p className="font-bold text-stone-900">General Enquiries</p>
                <p>{settings.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Fast Connect Banner */}
        <div className="bg-[#183928] p-8 rounded-3xl text-white shadow-xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#25D366] text-stone-900 flex items-center justify-center">
            <MessageCircle className="w-6 h-6 fill-stone-900" />
          </div>
          <h3 className="font-serif text-2xl font-bold">
            Direct WhatsApp Catering & Queries
          </h3>
          <p className="text-xs sm:text-sm text-[#C5D6CC] leading-relaxed">
            Planning a birthday, wedding reception, or bulk family breakfast? Talk directly to our master catering manager on WhatsApp for custom menus and discounts.
          </p>
          <div className="pt-2">
            <a
              href={`https://wa.me/${cleanWhatsappNumber}?text=Hi%20Hari%20Restaurant%2C%20I%20have%20a%20catering%20or%20bulk%20order%20enquiry`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] text-stone-900 font-extrabold text-xs hover:bg-[#1EBE5D] transition-all shadow-md active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-stone-900" />
              Chat on WhatsApp Now
            </a>
          </div>
        </div>
      </div>

    </div>
  );
};
