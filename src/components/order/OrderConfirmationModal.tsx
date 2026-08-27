import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { OrderTimeline } from './OrderTimeline';
import { openWhatsAppOrder } from '../../utils/whatsapp';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  X, 
  MessageCircle, 
  Copy, 
  Clock, 
  MapPin, 
  Phone, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const OrderConfirmationModal: React.FC = () => {
  const { 
    lastConfirmedOrder, 
    setLastConfirmedOrder, 
    settings, 
    setCurrentView,
    showToast 
  } = useApp();

  useEffect(() => {
    if (lastConfirmedOrder) {
      try {
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, [lastConfirmedOrder]);

  if (!lastConfirmedOrder) return null;

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(lastConfirmedOrder.order_number);
    showToast(`Copied Order #${lastConfirmedOrder.order_number} to clipboard!`, 'info');
  };

  const handleOpenWhatsAppChat = () => {
    const url = openWhatsAppOrder(lastConfirmedOrder, settings);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div 
        id="order-confirmation-modal"
        className="w-full max-w-xl bg-[#FCFAF6] rounded-3xl shadow-2xl border border-[#E8DFD3] overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Top Celebration Banner */}
        <div className="bg-gradient-to-br from-[#183928] to-[#0F241A] text-white p-6 sm:p-8 text-center relative overflow-hidden">
          <button
            onClick={() => setLastConfirmedOrder(null)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-16 h-16 rounded-2xl bg-[#E6C687] text-[#183928] flex items-center justify-center mx-auto mb-3 shadow-lg">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <p className="text-xs font-bold uppercase tracking-wider text-[#E6C687] mb-1">
            Order Sent Successfully!
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
            Thank you, {lastConfirmedOrder.customer_name}!
          </h2>
          <p className="text-xs text-[#C5D6CC] mt-1">
            Your delicious food is being received by our master chef.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold backdrop-blur-xs">
            <span>Order #{lastConfirmedOrder.order_number}</span>
            <button
              onClick={handleCopyOrderId}
              className="p-1 hover:text-[#E6C687] transition-colors"
              title="Copy Order ID"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[calc(85vh-300px)] overflow-y-auto custom-scrollbar">
          
          {/* Order Progress Timeline */}
          <div className="bg-white p-4 rounded-2xl border border-[#E8DFD3] space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
                Live Kitchen Status
              </h4>
              <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Est. 25-30 mins
              </span>
            </div>
            <OrderTimeline status={lastConfirmedOrder.status} statusHistory={lastConfirmedOrder.status_history} />
          </div>

          {/* WhatsApp Direct Chat Trigger Button */}
          <div className="p-4 rounded-2xl bg-[#EAF7EE] border border-[#25D366]/40 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#25D366] text-stone-900 flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5 fill-stone-900" />
              </div>
              <div className="text-left">
                <p className="font-bold text-xs sm:text-sm text-stone-900">
                  Open in WhatsApp Chat
                </p>
                <p className="text-[11px] text-stone-600">
                  Chat directly with restaurant team for real-time kitchen updates.
                </p>
              </div>
            </div>

            <button
              onClick={handleOpenWhatsAppChat}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#25D366] text-stone-900 font-extrabold text-xs hover:bg-[#1EBE5D] flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95 shrink-0"
            >
              <span>Open Chat</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Order Items Breakdown */}
          <div className="bg-white p-4 rounded-2xl border border-[#E8DFD3] space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
              Ordered Dishes ({lastConfirmedOrder.items.length})
            </h4>
            <div className="divide-y divide-stone-100 text-xs space-y-2">
              {lastConfirmedOrder.items.map((item) => (
                <div key={item.id} className="pt-2 first:pt-0 flex justify-between">
                  <div>
                    <span className="font-bold text-stone-900">
                      {item.product_name} × {item.quantity}
                    </span>
                    {item.customizations.addons && item.customizations.addons.length > 0 && (
                      <p className="text-[10px] text-stone-500">
                        Addons: {item.customizations.addons.map((a) => a.name).join(', ')}
                      </p>
                    )}
                  </div>
                  <span className="font-bold text-stone-800">₹{item.subtotal}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-stone-200 space-y-1 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{lastConfirmedOrder.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span>{lastConfirmedOrder.delivery_fee === 0 ? 'FREE' : `₹${lastConfirmedOrder.delivery_fee}`}</span>
              </div>
              {lastConfirmedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-800 font-semibold">
                  <span>Discount</span>
                  <span>-₹{lastConfirmedOrder.discount}</span>
                </div>
              )}
              <div className="flex justify-between font-extrabold text-sm text-[#183928] pt-1 border-t border-stone-200">
                <span>Total Paid</span>
                <span>₹{lastConfirmedOrder.total}</span>
              </div>
            </div>
          </div>

          {/* Delivery Destination */}
          <div className="p-3.5 bg-[#F4ECE1] rounded-2xl border border-[#E8DFC8] text-xs text-stone-700 space-y-1">
            <p className="font-bold text-stone-900 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C85A32]" />
              Delivering to:
            </p>
            <p className="pl-5 text-stone-600">
              {lastConfirmedOrder.delivery_address}, {lastConfirmedOrder.landmark && `${lastConfirmedOrder.landmark}, `}{lastConfirmedOrder.city} - {lastConfirmedOrder.pincode}
            </p>
            <p className="pl-5 text-stone-500 font-medium">
              Phone: {lastConfirmedOrder.phone}
            </p>
          </div>

        </div>

        {/* Footer Navigation CTAs */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#E8DFC8] flex items-center justify-between gap-3">
          <button
            onClick={() => {
              setLastConfirmedOrder(null);
              setCurrentView('account');
            }}
            className="text-xs font-bold text-stone-700 hover:text-[#C85A32] flex items-center gap-1"
          >
            View in My Orders →
          </button>

          <button
            onClick={() => {
              setLastConfirmedOrder(null);
              setCurrentView('menu');
            }}
            className="px-5 py-2.5 rounded-xl bg-[#183928] text-white hover:bg-[#10271B] font-bold text-xs shadow-md transition-all active:scale-95"
          >
            Order More Food
          </button>
        </div>

      </div>
    </div>
  );
};
