import React, { useMemo } from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { VegIndicator, SpiceBadge } from '../common/Badge';
import { Plus, Minus, Star, Clock, SlidersHorizontal, Flame } from 'lucide-react';

interface FoodCardProps {
  product: Product;
}

export const FoodCard: React.FC<FoodCardProps> = ({ product }) => {
  const { 
    cart, 
    addToCart, 
    updateCartItemQuantity, 
    setSelectedProductDetails 
  } = useApp();

  // Find total quantity of this product in cart (across any customizations)
  const cartItemsForProduct = useMemo(() => {
    return cart.filter((item) => item.product_id === product.id);
  }, [cart, product.id]);

  const totalQuantityInCart = useMemo(() => {
    return cartItemsForProduct.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItemsForProduct]);

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.available) return;

    // If product has addons or multiple spice options, open modal for better customization
    if (product.addons && product.addons.length > 0) {
      setSelectedProductDetails(product);
    } else {
      addToCart(product, 1);
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartItemsForProduct.length === 1) {
      updateCartItemQuantity(cartItemsForProduct[0].id, 1);
    } else {
      // If multiple custom variations exist, open details modal
      setSelectedProductDetails(product);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartItemsForProduct.length > 0) {
      // Decrement the last added variation
      const target = cartItemsForProduct[cartItemsForProduct.length - 1];
      updateCartItemQuantity(target.id, -1);
    }
  };

  return (
    <div
      onClick={() => setSelectedProductDetails(product)}
      className={`group flex flex-col justify-between bg-white rounded-2xl border border-[#F2DDD0] p-3.5 sm:p-4 hover:shadow-xl hover:border-[#EA580C]/50 transition-all duration-200 cursor-pointer relative overflow-hidden ${
        !product.available ? 'opacity-70 grayscale-20' : ''
      }`}
    >
      {/* Top Media & Badges */}
      <div>
        <div className="relative w-full aspect-4/3 rounded-xl overflow-hidden bg-stone-100 mb-3.5">
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Top Overlays */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
            <VegIndicator veg={product.veg} size="md" />
            {product.bestseller && (
              <span className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-extrabold bg-gradient-to-r from-[#EA580C] to-[#C2410C] text-white shadow-xs">
                Bestseller
              </span>
            )}
            {product.featured && !product.bestseller && (
              <span className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-extrabold bg-[#941B1B] text-[#FDEEE4] shadow-xs">
                Chef Special
              </span>
            )}
          </div>

          {/* Rating Badge */}
          <div className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-xs px-2 py-1 rounded-lg text-xs font-bold text-[#231815] flex items-center gap-1 shadow-sm">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{product.rating}</span>
            <span className="text-[10px] text-stone-400 font-normal">({product.rating_count})</span>
          </div>

          {!product.available && (
            <div className="absolute inset-0 bg-stone-900/60 flex items-center justify-center backdrop-blur-2xs">
              <span className="bg-rose-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-md">
                Sold Out for Today
              </span>
            </div>
          )}
        </div>

        {/* Title, Spice, Info */}
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif font-bold text-base sm:text-lg text-[#231815] group-hover:text-[#941B1B] transition-colors leading-tight line-clamp-1">
              {product.name}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <SpiceBadge level={product.spice_level} showLabel={false} />
            <span className="text-[11px] font-medium text-[#826A62] flex items-center gap-1">
              <Clock className="w-3 h-3 text-stone-400" />
              {product.preparation_time_mins} mins
            </span>
            {product.addons && product.addons.length > 0 && (
              <span className="text-[10px] font-semibold text-[#941B1B] bg-[#FDEEE4] px-1.5 py-0.5 rounded">
                Customizable
              </span>
            )}
          </div>

          <p className="text-xs text-[#6E564F] line-clamp-2 leading-relaxed mt-1">
            {product.description}
          </p>
        </div>
      </div>

      {/* Pricing and Add CTA Button */}
      <div className="mt-4 pt-3 border-t border-[#F2DDD0] flex items-center justify-between gap-2">
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg sm:text-xl font-extrabold text-[#941B1B] tracking-tight">
            ₹{product.price}
          </span>
          {product.original_price && (
            <span className="text-xs text-stone-400 line-through">
              ₹{product.original_price}
            </span>
          )}
        </div>

        {/* Dynamic Quantity Controller or Add Button */}
        {totalQuantityInCart > 0 ? (
          <div 
            className="flex items-center rounded-xl bg-gradient-to-r from-[#941B1B] to-[#EA580C] text-white overflow-hidden shadow-sm select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleDecrement}
              aria-label="Decrease quantity"
              className="p-2 hover:bg-black/20 text-[#FDEEE4] transition-colors active:scale-95"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-2.5 font-bold text-xs sm:text-sm text-white min-w-[20px] text-center">
              {totalQuantityInCart}
            </span>
            <button
              onClick={handleIncrement}
              aria-label="Increase quantity"
              className="p-2 hover:bg-black/20 text-[#FDEEE4] transition-colors active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddClick}
            disabled={!product.available}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs active:scale-95 ${
              product.available
                ? 'bg-[#FDEEE4] text-[#941B1B] hover:bg-gradient-to-r hover:from-[#941B1B] hover:to-[#EA580C] hover:text-white border border-[#F2DDD0]'
                : 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>ADD</span>
          </button>
        )}
      </div>
    </div>
  );
};
