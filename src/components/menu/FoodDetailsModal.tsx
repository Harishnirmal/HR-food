import React, { useState, useEffect } from 'react';
import { Product, ProductAddon, SpiceLevel } from '../../types';
import { useApp } from '../../context/AppContext';
import { VegIndicator, SpiceBadge } from '../common/Badge';
import { X, Plus, Minus, Star, Clock, Flame, Check, Sparkles, ChefHat } from 'lucide-react';

export const FoodDetailsModal: React.FC = () => {
  const { 
    selectedProductDetails, 
    setSelectedProductDetails, 
    addToCart,
    setIsCartDrawerOpen
  } = useApp();

  const product = selectedProductDetails;

  const [quantity, setQuantity] = useState(1);
  const [spiceLevel, setSpiceLevel] = useState<SpiceLevel>('medium');
  const [selectedAddons, setSelectedAddons] = useState<ProductAddon[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Sync state whenever selected product changes
  useEffect(() => {
    if (product) {
      setQuantity(1);
      setSpiceLevel(product.spice_level);
      setSelectedAddons([]);
      setSpecialInstructions('');
    }
  }, [product]);

  if (!product) return null;

  const toggleAddon = (addon: ProductAddon) => {
    if (selectedAddons.some((a) => a.id === addon.id)) {
      setSelectedAddons((prev) => prev.filter((a) => a.id !== addon.id));
    } else {
      setSelectedAddons((prev) => [...prev, addon]);
    }
  };

  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const singleUnitPrice = product.price + addonsTotal;
  const totalPrice = singleUnitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(product, quantity, {
      spice_level: spiceLevel,
      addons: selectedAddons,
      special_instructions: specialInstructions.trim() || undefined
    });
    setSelectedProductDetails(null);
  };

  const handleQuickOrder = () => {
    addToCart(product, quantity, {
      spice_level: spiceLevel,
      addons: selectedAddons,
      special_instructions: specialInstructions.trim() || undefined
    });
    setSelectedProductDetails(null);
    setIsCartDrawerOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div 
        id="food-details-modal"
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#F2DDD0] overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Top Image Banner with close button */}
        <div className="relative w-full h-64 sm:h-72 bg-stone-900">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

          {/* Close button */}
          <button
            onClick={() => setSelectedProductDetails(null)}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 text-white hover:bg-black/80 flex items-center justify-center backdrop-blur-xs transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badges on image */}
          <div className="absolute top-4 left-4 flex gap-2">
            <VegIndicator veg={product.veg} size="lg" />
            {product.bestseller && (
              <span className="px-3 py-1 rounded-full text-xs uppercase tracking-wider font-extrabold bg-gradient-to-r from-[#EA580C] to-[#C2410C] text-white shadow-md">
                Bestseller
              </span>
            )}
          </div>

          {/* Title & Rating overlay on bottom of image */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="flex items-center gap-1 text-xs font-bold bg-amber-500/90 text-stone-900 px-2 py-0.5 rounded-md">
                <Star className="w-3 h-3 fill-stone-900" />
                {product.rating} ({product.rating_count} reviews)
              </span>
              <span className="text-xs text-white/80 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {product.preparation_time_mins} mins
              </span>
              {product.calories && (
                <span className="text-xs text-white/80">
                  • {product.calories}
                </span>
              )}
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-md">
              {product.name}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[calc(85vh-280px)] overflow-y-auto custom-scrollbar">
          
          {/* Description */}
          <div>
            <p className="text-sm text-[#6E564F] leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Ingredients list */}
          {product.ingredients && product.ingredients.length > 0 && (
            <div className="bg-[#FCF8F5] p-3.5 rounded-2xl border border-[#F2DDD0]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#941B1B] mb-2 flex items-center gap-1.5">
                <ChefHat className="w-3.5 h-3.5 text-[#EA580C]" />
                Key Ingredients
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {product.ingredients.map((item, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium px-2.5 py-1 rounded-lg bg-white text-[#231815] border border-[#F2DDD0]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Spice Level Radio Controls */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#826A62] block">
              Choose Spice Level
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {(['mild', 'medium', 'spicy'] as SpiceLevel[]).map((level) => {
                const isSelected = spiceLevel === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSpiceLevel(level)}
                    className={`py-2.5 px-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 select-none ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#941B1B] to-[#B91C1C] text-white border-[#941B1B] shadow-sm ring-2 ring-[#EA580C]/30'
                        : 'bg-white text-[#231815] border-[#F2DDD0] hover:border-[#EA580C]'
                    }`}
                  >
                    <div className="flex items-center gap-1 text-xs font-bold capitalize">
                      <Flame className={`w-3.5 h-3.5 ${
                        level === 'spicy' ? 'text-rose-500 fill-rose-500' : level === 'medium' ? 'text-amber-500' : 'text-emerald-500'
                      }`} />
                      <span>{level}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Add-ons Checklist */}
          {product.addons && product.addons.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[#826A62]">
                  Recommended Add-ons
                </label>
                <span className="text-[11px] text-[#826A62]">Optional</span>
              </div>
              <div className="space-y-2">
                {product.addons.map((addon) => {
                  const isChecked = selectedAddons.some((a) => a.id === addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon)}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer select-none transition-all ${
                        isChecked
                          ? 'bg-[#FDEEE4] border-[#EA580C] shadow-xs'
                          : 'bg-white border-[#F2DDD0] hover:border-[#EA580C]/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                          isChecked ? 'bg-[#EA580C] border-[#EA580C] text-white' : 'border-stone-300 bg-white'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <span className="text-sm font-semibold text-[#231815]">
                          {addon.name}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-[#941B1B]">
                        +₹{addon.price}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Cooking Instructions */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#826A62] block">
              Special Instructions
            </label>
            <input
              type="text"
              placeholder="e.g. Less spicy, crispy roast, extra sambar bag..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#F2DDD0] bg-white text-sm text-[#231815] placeholder:text-[#826A62]/60 focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C]"
            />
          </div>

        </div>

        {/* Modal Footer with Quantity and Add Button */}
        <div className="p-4 sm:p-5 bg-[#FCF8F5] border-t border-[#F2DDD0] flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Quantity Stepper */}
          <div className="flex items-center bg-white border border-[#F2DDD0] rounded-xl p-1 shadow-xs">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-lg hover:bg-stone-100 flex items-center justify-center text-[#231815] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center font-bold text-sm text-[#231815]">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded-lg hover:bg-stone-100 flex items-center justify-center text-[#231815] transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Actions */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleAddToCart}
              className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-[#941B1B] text-white hover:bg-[#7C1313] font-bold text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
            >
              <span>Add to Cart</span>
              <span>•</span>
              <span className="text-[#FDEEE4]">₹{totalPrice}</span>
            </button>

            <button
              onClick={handleQuickOrder}
              className="px-4 py-3 rounded-xl bg-[#EA580C] text-white hover:bg-[#C2410C] font-bold text-sm active:scale-95 transition-all shadow-md"
              title="Add & Open Cart"
            >
              Order Now
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
