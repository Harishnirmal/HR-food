import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OrderTimeline } from './OrderTimeline';
import { OrderStatusBadge } from '../common/Badge';
import { openWhatsAppOrder } from '../../utils/whatsapp';
import { 
  Search, 
  Package, 
  MessageCircle, 
  MapPin, 
  Phone, 
  Clock, 
  ExternalLink,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const TrackOrderView: React.FC = () => {
  const { orders, settings, reorder, showToast } = useApp();
  const [searchInput, setSearchInput] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<any | null>(orders[0] || null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) {
      showToast('Please enter Order ID or phone number', 'error');
      return;
    }

    const cleanQuery = searchInput.trim().toLowerCase();
    const found = orders.find(
      (o) =>
        o.order_number.toLowerCase() === cleanQuery ||
        o.order_number.toLowerCase().includes(cleanQuery) ||
        o.phone.replace(/[^0-9]/g, '').includes(cleanQuery.replace(/[^0-9]/g, ''))
    );

    if (found) {
      setSearchedOrder(found);
      showToast(`Found Order #${found.order_number}!`, 'success');
    } else {
      showToast(`No order found matching "${searchInput}"`, 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Page Title */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#8F4A2D]">
          Real-Time Updates
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#183928]">
          Track Your Live Food Order
        </h1>
        <p className="text-xs sm:text-sm text-stone-600">
          Enter your Order Number (e.g. {orders[0]?.order_number || 'ANN-8921'}) or phone number to see kitchen status.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Enter Order # or 10-digit Phone"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-stone-300 bg-white text-sm text-stone-900 font-semibold focus:outline-none focus:border-[#183928] shadow-xs"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 rounded-2xl bg-[#183928] text-white hover:bg-[#10271B] font-bold text-sm shadow-md transition-all active:scale-95 shrink-0"
        >
          Track
        </button>
      </form>

      {/* Tracked Order Result Card */}
      {searchedOrder && (
        <div className="bg-white rounded-3xl border border-[#E8DFD3] p-6 sm:p-8 shadow-md space-y-6 animate-in fade-in duration-200">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                  Order #{searchedOrder.order_number}
                </h2>
                <OrderStatusBadge status={searchedOrder.status} />
              </div>
              <p className="text-xs text-stone-400 mt-1">
                Placed for <span className="font-bold text-stone-800">{searchedOrder.customer_name}</span> ({searchedOrder.phone})
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-stone-400">Total Bill</span>
              <p className="font-serif font-bold text-2xl text-[#183928]">₹{searchedOrder.total}</p>
            </div>
          </div>

          {/* Timeline Progress */}
          <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#ECE3D5] space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
              Live Cooking & Delivery Progress
            </h4>
            <OrderTimeline status={searchedOrder.status} statusHistory={searchedOrder.status_history} />
          </div>

          {/* WhatsApp Support Callout */}
          <div className="p-4 rounded-2xl bg-[#EAF7EE] border border-[#25D366]/40 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#25D366] text-stone-900 flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5 fill-stone-900" />
              </div>
              <div className="text-left">
                <p className="font-bold text-xs sm:text-sm text-stone-900">
                  Need any additions or custom instructions?
                </p>
                <p className="text-[11px] text-stone-600">
                  Chat directly with our kitchen manager on WhatsApp.
                </p>
              </div>
            </div>

            <a
              href={openWhatsAppOrder(searchedOrder, settings)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#25D366] text-stone-900 font-extrabold text-xs hover:bg-[#1EBE5D] flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95 shrink-0"
            >
              <span>Chat on WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Dishes Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
              Ordered Items ({searchedOrder.items.length})
            </h4>
            <div className="divide-y divide-stone-100 text-xs sm:text-sm space-y-2">
              {searchedOrder.items.map((item: any) => (
                <div key={item.id} className="pt-2 first:pt-0 flex justify-between">
                  <div>
                    <span className="font-bold text-stone-900">{item.product_name}</span> × {item.quantity}
                    {item.customizations?.addons && item.customizations.addons.length > 0 && (
                      <p className="text-[11px] text-stone-500">
                        Addons: {item.customizations.addons.map((a: any) => a.name).join(', ')}
                      </p>
                    )}
                    {item.customizations?.special_instructions && (
                      <p className="text-[11px] text-stone-400 italic">
                        "{item.customizations.special_instructions}"
                      </p>
                    )}
                  </div>
                  <span className="font-bold text-stone-800">₹{item.subtotal}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Destination */}
          <div className="p-4 bg-[#F4ECE1] rounded-2xl border border-[#E8DFC8] text-xs text-stone-700 space-y-1">
            <p className="font-bold text-stone-900 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C85A32]" />
              Delivering to:
            </p>
            <p className="pl-5 text-stone-600">
              {searchedOrder.delivery_address}, {searchedOrder.landmark && `${searchedOrder.landmark}, `}{searchedOrder.city} - {searchedOrder.pincode}
            </p>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => reorder(searchedOrder)}
              className="px-5 py-2.5 rounded-xl bg-[#183928] text-white hover:bg-[#10271B] font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reorder these items
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
