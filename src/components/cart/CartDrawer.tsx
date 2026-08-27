import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VegIndicator, SpiceBadge } from '../common/Badge';
import { 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  Tag, 
  MessageCircle, 
  Check, 
  Truck,
  ShieldCheck
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cart,
    updateCartItemQuantity,
    removeCartItem,
    clearCart,
    cartSubtotal,
    cartDeliveryFee,
    cartDiscount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    cartTotal,
    cartItemCount,
    settings,
    setIsCheckoutModalOpen,
    setCurrentView
  } = useApp();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    applyCoupon(couponInput);
    setCouponInput('');
  };

  const freeDeliveryRemaining = Math.max(0, settings.free_delivery_threshold - cartSubtotal);
  const freeDeliveryProgress = Math.min(100, Math.round((cartSubtotal / settings.free_delivery_threshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div 
        id="cart-drawer-panel"
        className="w-full max-w-md bg-[#FCFAF6] h-full shadow-2xl flex flex-col justify-between border-l border-[#E8DFD3] animate-in slide-in-from-right duration-250"
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#F2DDD0] bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-[#941B1B] to-[#EA580C] text-white flex items-center justify-center shadow-xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-[#231815] leading-tight">
                Your Order Cart
              </h2>
              <p className="text-xs text-[#826A62]">
                {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'} selected
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-stone-400 hover:text-rose-600 font-medium px-2 py-1"
                title="Clear all items"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Free Delivery Progress Bar */}
        {cart.length > 0 && (
          <div className="px-4 py-2.5 bg-[#FDEEE4] border-b border-[#F2DDD0]">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="text-[#941B1B] flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-[#EA580C]" />
                {freeDeliveryRemaining === 0 ? (
                  <span className="text-emerald-800 font-bold">You unlocked FREE Delivery! 🎉</span>
                ) : (
                  <span>Add ₹{freeDeliveryRemaining} more for FREE delivery</span>
                )}
              </span>
              <span className="text-[#826A62] text-[11px]">{freeDeliveryProgress}%</span>
            </div>
            <div className="w-full bg-[#F2DDD0] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#941B1B] to-[#EA580C] h-full rounded-full transition-all duration-300"
                style={{ width: `${freeDeliveryProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Drawer Content (Items List or Empty State) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12 px-4 space-y-4">
              <div className="w-20 h-20 rounded-full bg-[#FDEEE4] flex items-center justify-center text-4xl shadow-inner">
                🍽️
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-xl font-bold text-[#231815]">
                  Your table is waiting
                </h3>
                <p className="text-xs text-[#826A62] max-w-xs">
                  Add something delicious to get started. Explore crispy dosas, steaming idlis, or fragrant Thalassery biriyani.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  setCurrentView('menu');
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#941B1B] to-[#EA580C] text-white hover:from-[#7C1313] hover:to-[#C2410C] text-xs font-bold shadow-md transition-all active:scale-95"
              >
                Explore Menu
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#F2DDD0] space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex gap-3 group">
                  {/* Dish Thumbnail */}
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-stone-200"
                  />

                  {/* Info and Customizations */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <VegIndicator veg={item.product.veg} size="sm" />
                        <h4 className="font-semibold text-[#231815] text-sm truncate">
                          {item.product.name}
                        </h4>
                      </div>
                      <button
                        onClick={() => removeCartItem(item.id)}
                        className="text-stone-300 hover:text-rose-600 p-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Customization Details */}
                    <div className="text-[11px] text-[#826A62] space-y-0.5 mt-0.5">
                      <div className="flex items-center gap-1">
                        <span className="capitalize">Spice: {item.customization.spice_level}</span>
                        {item.customization.addons && item.customization.addons.length > 0 && (
                          <span>
                            • {item.customization.addons.map((a) => a.name).join(', ')}
                          </span>
                        )}
                      </div>
                      {item.customization.special_instructions && (
                        <p className="italic text-stone-400">
                          "{item.customization.special_instructions}"
                        </p>
                      )}
                    </div>

                    {/* Quantity Stepper and Item Total */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center bg-[#FDEEE4] rounded-lg p-0.5">
                        <button
                          onClick={() => updateCartItemQuantity(item.id, -1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-[#941B1B] hover:bg-white transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-[#231815]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartItemQuantity(item.id, 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-[#941B1B] hover:bg-white transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-sm font-bold text-[#941B1B]">
                        ₹{item.total_price}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Coupon Code Section */}
          {cart.length > 0 && (
            <div className="pt-3 border-t border-[#F2DDD0]">
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-700" />
                    <div>
                      <p className="text-xs font-bold text-emerald-900">
                        {appliedCoupon} applied!
                      </p>
                      <p className="text-[11px] text-emerald-700">
                        You saved ₹{cartDiscount}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-rose-600 font-bold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code (e.g. HARI10 or NONVEG20)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs uppercase placeholder:normal-case font-semibold text-stone-800 focus:outline-none focus:border-[#EA580C]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#941B1B] text-white rounded-xl text-xs font-bold hover:bg-[#7C1313] transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Drawer Footer & Bill Breakdown */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 bg-white border-t border-[#F2DDD0] space-y-3 shadow-lg">
            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-stone-900">₹{cartSubtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-semibold text-stone-900">
                  {cartDeliveryFee === 0 ? (
                    <span className="text-emerald-700 uppercase font-bold">Free</span>
                  ) : (
                    `₹${cartDeliveryFee}`
                  )}
                </span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Promo Discount</span>
                  <span>-₹{cartDiscount}</span>
                </div>
              )}
              <div className="pt-2 border-t border-stone-200 flex justify-between text-base font-extrabold text-[#941B1B]">
                <span>Total Amount</span>
                <span>₹{cartTotal}</span>
              </div>
            </div>

            {/* Checkout CTAs */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  setIsCheckoutModalOpen(true);
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] text-white hover:bg-[#20BA5A] font-extrabold text-sm flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>Proceed to WhatsApp Checkout</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => setIsCartDrawerOpen(false)}
                className="w-full py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 text-center"
              >
                Continue Browsing Menu
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
