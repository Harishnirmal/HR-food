import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export const MobileStickyCart: React.FC = () => {
  const { cartItemCount, cartTotal, setIsCartDrawerOpen, isCartDrawerOpen, isCheckoutModalOpen } = useApp();

  if (cartItemCount === 0 || isCartDrawerOpen || isCheckoutModalOpen) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-30 sm:hidden">
      <button
        onClick={() => setIsCartDrawerOpen(true)}
        id="mobile-sticky-cart-bar"
        className="w-full bg-[#183928] text-white p-3.5 rounded-2xl shadow-2xl flex items-center justify-between border border-[#2B563F] active:scale-98 transition-all animate-in slide-in-from-bottom-4 duration-200"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#E6C687] text-[#183928] flex items-center justify-center font-bold text-xs">
            {cartItemCount}
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold text-[#E6C687]">
              {cartItemCount} {cartItemCount === 1 ? 'Item' : 'Items'} in Cart
            </p>
            <p className="text-base font-extrabold text-white leading-none mt-0.5">
              ₹{cartTotal}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs font-extrabold text-white bg-[#C85A32] px-3.5 py-2 rounded-xl shadow-xs">
          <span>View Cart</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </button>
    </div>
  );
};
