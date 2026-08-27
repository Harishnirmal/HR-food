import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { PaymentMethod } from '../../types';
import { 
  X, 
  MessageCircle, 
  MapPin, 
  Phone, 
  User, 
  Mail, 
  FileText, 
  CreditCard, 
  Banknote, 
  QrCode, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  Bookmark
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    cart,
    cartSubtotal,
    cartDeliveryFee,
    cartDiscount,
    appliedCoupon,
    cartTotal,
    user,
    addresses,
    createOrder,
    settings,
    showToast
  } = useApp();

  // Form Fields
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [addressLine, setAddressLine] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState(settings.city || 'Chennai');
  const [pincode, setPincode] = useState(settings.pincode || '600020');
  const [instructions, setInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('whatsapp');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill user data or default address
  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.name);
      if (!phone) setPhone(user.phone);
      if (!email) setEmail(user.email);

      const defaultAddr = addresses.find((a) => a.user_id === user.id && a.is_default) || addresses.find((a) => a.user_id === user.id);
      if (defaultAddr && !addressLine) {
        setAddressLine(defaultAddr.address_line);
        setLandmark(defaultAddr.landmark || '');
        setCity(defaultAddr.city);
        setPincode(defaultAddr.pincode);
      }
    }
  }, [user, addresses]);

  if (!isCheckoutModalOpen) return null;

  const handleSelectSavedAddress = (addrId: string) => {
    const selected = addresses.find((a) => a.id === addrId);
    if (selected) {
      setAddressLine(selected.address_line);
      setLandmark(selected.landmark || '');
      setCity(selected.city);
      setPincode(selected.pincode);
      showToast('Loaded saved address', 'info');
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      showToast('Please enter your full name', 'error');
      return;
    }
    if (!phone.trim() || phone.replace(/[^0-9]/g, '').length < 10) {
      showToast('Please enter a valid 10-digit mobile number', 'error');
      return;
    }
    if (!addressLine.trim()) {
      showToast('Please enter your delivery street address', 'error');
      return;
    }
    if (!pincode.trim()) {
      showToast('Please enter your delivery pincode', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = createOrder({
        customer_name: customerName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        delivery_address: addressLine.trim(),
        landmark: landmark.trim() || undefined,
        city: city.trim(),
        pincode: pincode.trim(),
        delivery_instructions: instructions.trim() || undefined,
        payment_method: paymentMethod,
        openWhatsAppDirectly: true
      });

      if (result) {
        // Modal will close and order confirmation modal will render
      }
    } catch (err) {
      console.error(err);
      showToast('Something went wrong creating your order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const userSavedAddresses = user ? addresses.filter((a) => a.user_id === user.id) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div 
        id="checkout-modal-panel"
        className="w-full max-w-2xl bg-[#FCFAF6] rounded-3xl shadow-2xl border border-[#E8DFD3] overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#E8DFC8] bg-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#25D366]/20 text-[#128C7E] flex items-center justify-center">
                <MessageCircle className="w-4 h-4 fill-current" />
              </div>
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-stone-900 leading-tight">
                Complete Your Order
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Instant direct WhatsApp booking • Fast delivery in {settings.delivery_radius_km} km
            </p>
          </div>

          <button
            onClick={() => setIsCheckoutModalOpen(false)}
            className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleSubmitOrder}>
          <div className="p-5 sm:p-6 space-y-6 max-h-[calc(85vh-220px)] overflow-y-auto custom-scrollbar">
            
            {/* Quick saved addresses selector if logged in */}
            {userSavedAddresses.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5 text-[#C85A32]" />
                  Saved Delivery Addresses
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {userSavedAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => handleSelectSavedAddress(addr.id)}
                      className={`p-3 rounded-xl border cursor-pointer text-xs transition-all ${
                        addressLine === addr.address_line
                          ? 'bg-[#F2EBE1] border-[#C85A32] ring-1 ring-[#C85A32]'
                          : 'bg-white border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-stone-900 mb-0.5">
                        <span>{addr.label}</span>
                        {addr.is_default && (
                          <span className="text-[10px] text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">Default</span>
                        )}
                      </div>
                      <p className="text-stone-600 line-clamp-1">{addr.address_line}</p>
                      <p className="text-stone-400 text-[10px]">{addr.city} - {addr.pincode}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section 1: Customer Details */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#C85A32]" />
                Customer Contact Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Suresh Kumar"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm text-stone-900 focus:outline-none focus:border-[#183928] focus:ring-1 focus:ring-[#183928]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Mobile Number (WhatsApp) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 98401 23456"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm text-stone-900 focus:outline-none focus:border-[#183928] focus:ring-1 focus:ring-[#183928]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. suresh@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm text-stone-900 focus:outline-none focus:border-[#183928] focus:ring-1 focus:ring-[#183928]"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Delivery Address */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C85A32]" />
                Delivery Location
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Flat / House No. / Street Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Flat 4B, Kaveri Apartments, 2nd Cross Street"
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm text-stone-900 focus:outline-none focus:border-[#183928] focus:ring-1 focus:ring-[#183928]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Landmark
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Opp. Apollo Pharmacy"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm text-stone-900 focus:outline-none focus:border-[#183928] focus:ring-1 focus:ring-[#183928]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      City <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm text-stone-900 focus:outline-none focus:border-[#183928] focus:ring-1 focus:ring-[#183928]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Pincode <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm text-stone-900 focus:outline-none focus:border-[#183928] focus:ring-1 focus:ring-[#183928]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Leave at security, ring bell twice..."
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm text-stone-900 focus:outline-none focus:border-[#183928] focus:ring-1 focus:ring-[#183928]"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Payment Choice */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#C85A32]" />
                Payment Method
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div
                  onClick={() => setPaymentMethod('whatsapp')}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col items-center text-center gap-1.5 ${
                    paymentMethod === 'whatsapp'
                      ? 'bg-[#EBF7F0] border-[#25D366] text-[#128C7E] ring-2 ring-[#25D366]/30 shadow-xs'
                      : 'bg-white border-stone-200 hover:border-stone-300 text-stone-700'
                  }`}
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span className="text-xs font-bold">WhatsApp Confirmation</span>
                  <span className="text-[10px] text-stone-500 leading-tight">Pay on WhatsApp bill link</span>
                </div>

                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col items-center text-center gap-1.5 ${
                    paymentMethod === 'cod'
                      ? 'bg-[#EBF7F0] border-[#25D366] text-[#128C7E] ring-2 ring-[#25D366]/30 shadow-xs'
                      : 'bg-white border-stone-200 hover:border-stone-300 text-stone-700'
                  }`}
                >
                  <Banknote className="w-5 h-5" />
                  <span className="text-xs font-bold">Cash on Delivery</span>
                  <span className="text-[10px] text-stone-500 leading-tight">Pay cash at doorstep</span>
                </div>

                <div
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col items-center text-center gap-1.5 ${
                    paymentMethod === 'upi'
                      ? 'bg-[#EBF7F0] border-[#25D366] text-[#128C7E] ring-2 ring-[#25D366]/30 shadow-xs'
                      : 'bg-white border-stone-200 hover:border-stone-300 text-stone-700'
                  }`}
                >
                  <QrCode className="w-5 h-5" />
                  <span className="text-xs font-bold">UPI QR Code</span>
                  <span className="text-[10px] text-stone-500 leading-tight">GPay / PhonePe / Paytm</span>
                </div>
              </div>
            </div>

            {/* Section 4: Compact Order Summary */}
            <div className="bg-[#F4ECE1] p-4 rounded-2xl border border-[#E8DFC8] space-y-2 text-xs">
              <h4 className="font-bold text-stone-900 text-sm flex items-center justify-between">
                <span>Order Summary ({cart.length} items)</span>
                <span className="text-[#183928] font-extrabold text-base">₹{cartTotal}</span>
              </h4>
              <div className="divide-y divide-[#E5D8C6] pt-1">
                {cart.map((item) => (
                  <div key={item.id} className="py-1.5 flex justify-between text-stone-700">
                    <span className="truncate max-w-[240px]">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="font-semibold">₹{item.total_price}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-[#DECBB6] space-y-1 text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{cartSubtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span>{cartDeliveryFee === 0 ? 'FREE' : `₹${cartDeliveryFee}`}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-semibold">
                    <span>Discount ({appliedCoupon})</span>
                    <span>-₹{cartDiscount}</span>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Checkout Modal Footer */}
          <div className="p-5 bg-white border-t border-[#E8DFC8] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
            <div>
              <p className="text-xs text-stone-500">Total payable amount</p>
              <p className="text-2xl font-serif font-bold text-[#183928]">₹{cartTotal}</p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              id="confirm-whatsapp-order-btn"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#25D366] text-stone-900 hover:bg-[#1EBE5D] font-extrabold text-sm flex items-center justify-center gap-2.5 shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-stone-900" />
              <span>Send Order on WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
