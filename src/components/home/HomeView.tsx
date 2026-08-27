import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Hero } from './Hero';
import { FoodCard } from '../menu/FoodCard';
import { 
  ArrowRight, 
  MessageCircle, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Heart, 
  ChefHat, 
  Flame, 
  Star, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2,
  UtensilsCrossed
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { categories, products, setSelectedCategorySlug, setCurrentView, settings } = useApp();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const bestsellers = products.filter((p) => p.bestseller).slice(0, 4);
  const chefSpecials = products.filter((p) => p.featured && !p.bestseller).slice(0, 4);
  const activeCategories = categories.filter((c) => c.active).sort((a, b) => a.display_order - b.display_order);

  const faqs = [
    {
      q: 'How does ordering on WhatsApp work?',
      a: 'Select your favourite dishes and customizations on our web app, click "Send Order on WhatsApp", and your complete order with prices and delivery address will be auto-formatted in WhatsApp. Our kitchen team confirms your order in real-time and starts cooking immediately!'
    },
    {
      q: 'What is your delivery time and radius?',
      a: `We deliver fresh, piping hot food within a ${settings.delivery_radius_km} km radius around our kitchen in ${settings.city}. Average delivery time is 25 to 35 minutes using insulated heat-preserving containers.`
    },
    {
      q: 'Are your dishes prepared with pure ghee and fresh ingredients?',
      a: 'Yes! We use 100% pure cow ghee for all our dosas, sweets, and roasts. Our coconut and tomato chutneys are freshly ground three times a day, and we never use pre-packaged spice pastes or artificial food colouring.'
    },
    {
      q: 'Can I customize my spice level or request special instructions?',
      a: 'Absolutely. When choosing any dish, you can select between Mild, Medium, or Spicy, add extra chutneys or sambar, and type special notes (e.g. "Less oil", "Extra crispy"). These are passed directly to our kitchen.'
    },
    {
      q: 'What payment methods do you accept?',
      a: 'You can pay via UPI (Google Pay, PhonePe, Paytm), Cash on Delivery at your doorstep, or through the direct WhatsApp payment bill.'
    }
  ];

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Menu Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#941B1B]">
              <Sparkles className="w-3.5 h-3.5 text-[#EA580C]" />
              <span>Explore by Category</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#231815] mt-1">
              What are you craving today?
            </h2>
          </div>

          <button
            onClick={() => {
              setSelectedCategorySlug(null);
              setCurrentView('menu');
            }}
            className="text-xs font-bold text-[#941B1B] hover:text-[#EA580C] flex items-center gap-1 group"
          >
            <span>View Complete Menu</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {activeCategories.map((cat) => {
            const productCount = products.filter(
              (p) => p.category_slug === cat.slug || p.category_id === cat.id || p.category_id === cat.slug
            ).length;
            return (
              <div
                key={cat.id}
                onClick={() => {
                  setSelectedCategorySlug(cat.slug);
                  setCurrentView('menu');
                }}
                className="group bg-white rounded-2xl border border-[#F2DDD0] p-3 hover:border-[#EA580C] hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col items-center text-center select-none"
              >
                <div className="w-full aspect-square rounded-xl overflow-hidden bg-stone-100 mb-2.5">
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-serif font-bold text-xs sm:text-sm text-[#231815] group-hover:text-[#941B1B] transition-colors leading-tight line-clamp-1">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-[#826A62] mt-0.5">
                  {productCount} {productCount === 1 ? 'Dish' : 'Dishes'}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Customer Favourites / Bestsellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#EA580C]">
              <Flame className="w-3.5 h-3.5 fill-[#EA580C] text-[#EA580C]" />
              <span>Customer Favourites</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#231815] mt-1">
              Most Ordered by Chennai Families
            </h2>
          </div>

          <button
            onClick={() => setCurrentView('menu')}
            className="text-xs font-bold text-[#941B1B] hover:text-[#EA580C] flex items-center gap-1 group"
          >
            <span>See All Bestsellers</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestsellers.map((product) => (
            <FoodCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Special Promotional Callout: Firewood Biriyani & Heritage Thali */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#941B1B] via-[#7C1313] to-[#EA580C] rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FBBF24] text-[#941B1B]">
                Chef's Weekend Special
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold leading-tight">
                Authentic Thalassery Dum Biriyani & Royal South Indian Feast
              </h2>
              <p className="text-sm sm:text-base text-stone-100 leading-relaxed">
                Slow cooked on fragrant firewood embers with aromatic Jeerakasala rice, caramelized onions, and homemade garam masala. Served with cooling cucumber pachadi and spiced date pickle.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setSelectedCategorySlug('biriyani');
                    setCurrentView('menu');
                  }}
                  className="px-6 py-3 rounded-xl bg-white text-[#941B1B] hover:bg-[#FDEEE4] font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-2"
                >
                  <UtensilsCrossed className="w-4 h-4 text-[#EA580C]" />
                  <span>Order Biriyani Special</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white/30 aspect-4/3">
                <img
                  src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80"
                  alt="Thalassery Chicken Biriyani with boiled egg and raita"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Chef Specials / More Options */}
      {chefSpecials.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#941B1B]">
                <ChefHat className="w-3.5 h-3.5 text-[#EA580C]" />
                <span>Handcrafted Selections</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#231815] mt-1">
                Curated by Master Chefs
              </h2>
            </div>

            <button
              onClick={() => setCurrentView('menu')}
              className="text-xs font-bold text-[#941B1B] hover:text-[#EA580C] flex items-center gap-1 group"
            >
              <span>Explore Full Menu</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {chefSpecials.map((product) => (
              <FoodCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 6. Why Families Love Us (Pillars of Quality) */}
      <section className="bg-[#FCF8F5] py-16 border-y border-[#F2DDD0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#941B1B]">
              Our Kitchen Philosophy
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#231815]">
              Why 25,000+ Chennai Families Trust Us Daily
            </h2>
            <p className="text-xs sm:text-sm text-[#6E564F]">
              We cook the exact same way we cook for our children at home: zero compromises, pure ingredients, and timeless love.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#F2DDD0] shadow-xs text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FDEEE4] text-[#EA580C] flex items-center justify-center mx-auto text-xl font-bold">
                🧈
              </div>
              <h3 className="font-serif font-bold text-base text-[#231815]">100% Pure Cow Ghee</h3>
              <p className="text-xs text-[#6E564F] leading-relaxed">
                Hand-churned butter clarified over slow heat. Adds unforgettable golden aroma to every dosa.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#F2DDD0] shadow-xs text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FDEEE4] text-[#EA580C] flex items-center justify-center mx-auto text-xl font-bold">
                🥥
              </div>
              <h3 className="font-serif font-bold text-base text-[#231815]">Fresh Ground Chutneys</h3>
              <p className="text-xs text-[#6E564F] leading-relaxed">
                Stone-ground with fresh coastal coconuts and green chillies every 3 hours. Never refrigerated.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#F2DDD0] shadow-xs text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FDEEE4] text-[#EA580C] flex items-center justify-center mx-auto text-xl font-bold">
                🛵
              </div>
              <h3 className="font-serif font-bold text-base text-[#231815]">Insulated Hot Delivery</h3>
              <p className="text-xs text-[#6E564F] leading-relaxed">
                Triple-layered thermo food containers ensure crispy dosas stay crisp and sambar arrives steaming hot.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#F2DDD0] shadow-xs text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#25D366]/15 text-[#25D366] flex items-center justify-center mx-auto text-xl font-bold">
                <MessageCircle className="w-6 h-6 fill-current" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#231815]">WhatsApp Speed Ordering</h3>
              <p className="text-xs text-[#6E564F] leading-relaxed">
                No complex downloads. One tap to WhatsApp with your personalized order and chef confirmation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. How WhatsApp Ordering Works in 3 Steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C]">
            Seamless Journey
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#231815]">
            How WhatsApp Ordering Works
          </h2>
          <p className="text-xs sm:text-sm text-[#6E564F]">
            Order in under 30 seconds without creating complicated logins or downloading apps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          <div className="bg-white p-6 rounded-3xl border border-[#F2DDD0] shadow-xs space-y-3 relative">
            <div className="w-9 h-9 rounded-xl bg-[#941B1B] text-white flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h3 className="font-serif font-bold text-base text-[#231815]">
              Pick Your Dishes & Spice
            </h3>
            <p className="text-xs text-[#6E564F] leading-relaxed">
              Browse our crispy dosas, meals, and biriyanis. Customize spice level, add extra chutney or egg, and click Checkout.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#F2DDD0] shadow-xs space-y-3 relative">
            <div className="w-9 h-9 rounded-xl bg-[#25D366] text-white flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h3 className="font-serif font-bold text-base text-[#231815]">
              Tap "Send to WhatsApp"
            </h3>
            <p className="text-xs text-[#6E564F] leading-relaxed">
              Your order is formatted instantly with dish breakdowns, delivery location, and bill totals ready to send to our kitchen.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#F2DDD0] shadow-xs space-y-3 relative">
            <div className="w-9 h-9 rounded-xl bg-[#EA580C] text-white flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h3 className="font-serif font-bold text-base text-[#231815]">
              Instant Chef Confirmation
            </h3>
            <p className="text-xs text-[#6E564F] leading-relaxed">
              Our team immediately acknowledges your order, starts cooking fresh, and delivers within 30 minutes.
            </p>
          </div>
        </div>
      </section>

      {/* 8. Real Customer Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#941B1B]">
            Loved by Chennai
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#231815]">
            Real Reviews From Real Families
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-[#F2DDD0] shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-xs text-[#6E564F] leading-relaxed italic">
                "The Ghee Podi Dosa arrived boiling hot and so crispy! My grandparents loved the filter coffee and the WhatsApp ordering is so effortless."
              </p>
            </div>
            <div className="flex items-center gap-3 pt-3 border-t border-[#F2DDD0]">
              <div className="w-10 h-10 rounded-full bg-[#FDEEE4] text-[#941B1B] font-bold flex items-center justify-center text-sm">
                MK
              </div>
              <div>
                <p className="text-xs font-bold text-[#231815]">Meenakshi Krishnan</p>
                <p className="text-[10px] text-[#826A62]">Adyar, Chennai</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#F2DDD0] shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-xs text-[#6E564F] leading-relaxed italic">
                "Best Thalassery Biriyani in town. The rice grains are tiny and deeply aromatic, chicken was tender, and the date pickle is fantastic."
              </p>
            </div>
            <div className="flex items-center gap-3 pt-3 border-t border-[#F2DDD0]">
              <div className="w-10 h-10 rounded-full bg-[#FDEEE4] text-[#941B1B] font-bold flex items-center justify-center text-sm">
                AR
              </div>
              <div>
                <p className="text-xs font-bold text-[#231815]">Arun Ramachandran</p>
                <p className="text-[10px] text-[#826A62]">Besant Nagar, Chennai</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#F2DDD0] shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-xs text-[#6E564F] leading-relaxed italic">
                "We order Sunday family meals regularly. Packaging is top-notch, sambar never spills, and the coconut chutney tastes just like home."
              </p>
            </div>
            <div className="flex items-center gap-3 pt-3 border-t border-[#F2DDD0]">
              <div className="w-10 h-10 rounded-full bg-[#FDEEE4] text-[#941B1B] font-bold flex items-center justify-center text-sm">
                PV
              </div>
              <div>
                <p className="text-xs font-bold text-[#231815]">Priya Venkat</p>
                <p className="text-[10px] text-[#826A62]">Thiruvanmiyur, Chennai</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQs Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#941B1B]">
            Common Questions
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#231815]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#F2DDD0] overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-serif font-bold text-[#231815] text-sm sm:text-base hover:text-[#EA580C] transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#EA580C] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-[#6E564F] leading-relaxed border-t border-[#F2DDD0] pt-3 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
