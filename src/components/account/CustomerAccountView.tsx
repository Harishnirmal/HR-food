import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Address, Order } from '../../types';
import { OrderStatusBadge } from '../common/Badge';
import { OrderTimeline } from '../order/OrderTimeline';
import { openWhatsAppOrder } from '../../utils/whatsapp';
import { 
  User, 
  MapPin, 
  PackageCheck, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  MessageCircle, 
  RotateCcw, 
  Clock, 
  Phone, 
  Mail, 
  LogOut,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const CustomerAccountView: React.FC = () => {
  const {
    user,
    orders,
    addresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    updateProfile,
    reorder,
    settings,
    logout,
    setIsAuthModalOpen,
    setAuthModalMode,
    switchRoleDemo,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile'>('orders');
  
  // Profile edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');

  // Address modal / form state
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addrLabel, setAddrLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [addrLine, setAddrLine] = useState('');
  const [addrLandmark, setAddrLandmark] = useState('');
  const [addrCity, setAddrCity] = useState(settings.city || 'Chennai');
  const [addrPincode, setAddrPincode] = useState(settings.pincode || '600020');
  const [addrIsDefault, setAddrIsDefault] = useState(false);

  // Expanded order tracking
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-[#FDEEE4] flex items-center justify-center mx-auto text-[#EA580C] shadow-inner">
          <User className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#231815]">
            Sign in to view your Account
          </h2>
          <p className="text-sm text-[#826A62] max-w-md mx-auto">
            Access your order tracking, delivery addresses, and reorder favourite South Indian delicacies in seconds.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              setAuthModalMode('login');
              setIsAuthModalOpen(true);
            }}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#941B1B] to-[#EA580C] text-white font-bold text-sm shadow-md hover:opacity-90 transition-all cursor-pointer"
          >
            Sign In to Account
          </button>
          <button
            onClick={() => switchRoleDemo('customer')}
            className="px-6 py-3 rounded-xl bg-white border border-[#F2DDD0] text-[#941B1B] font-bold text-sm hover:bg-[#FCF8F5] transition-all cursor-pointer"
          >
            Load Customer Demo Account
          </button>
        </div>
      </div>
    );
  }

  // Filter orders for current user (or show all customer demo orders if user created)
  const userOrders = orders.filter((o) => !o.user_id || o.user_id === user.id || o.email === user.email);
  const userAddresses = addresses.filter((a) => a.user_id === user.id);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim() || !profilePhone.trim()) {
      showToast('Name and phone cannot be empty', 'error');
      return;
    }
    updateProfile(profileName.trim(), profilePhone.trim());
    setIsEditingProfile(false);
  };

  const handleOpenAddressModal = (addr?: Address) => {
    if (addr) {
      setEditingAddressId(addr.id);
      setAddrLabel(addr.label);
      setAddrLine(addr.address_line);
      setAddrLandmark(addr.landmark || '');
      setAddrCity(addr.city);
      setAddrPincode(addr.pincode);
      setAddrIsDefault(addr.is_default);
    } else {
      setEditingAddressId(null);
      setAddrLabel('Home');
      setAddrLine('');
      setAddrLandmark('');
      setAddrCity(settings.city || 'Chennai');
      setAddrPincode(settings.pincode || '600020');
      setAddrIsDefault(userAddresses.length === 0);
    }
    setIsAddressFormOpen(true);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrLine.trim() || !addrPincode.trim()) {
      showToast('Please enter full address and pincode', 'error');
      return;
    }

    if (editingAddressId) {
      updateAddress(editingAddressId, {
        label: addrLabel,
        address_line: addrLine.trim(),
        landmark: addrLandmark.trim() || undefined,
        city: addrCity.trim(),
        pincode: addrPincode.trim(),
        is_default: addrIsDefault
      });
    } else {
      addAddress({
        label: addrLabel,
        address_line: addrLine.trim(),
        landmark: addrLandmark.trim() || undefined,
        city: addrCity.trim(),
        pincode: addrPincode.trim(),
        is_default: addrIsDefault
      });
    }
    setIsAddressFormOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Account Hero Banner */}
      <div className="bg-gradient-to-r from-[#941B1B] via-[#7C1313] to-[#EA580C] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden mb-8">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-white text-[#EA580C] font-serif font-bold text-3xl flex items-center justify-center shadow-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
                {user.name}
              </h1>
              <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-white/20 text-white border border-white/40">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-stone-100 mt-1 flex items-center gap-3">
              <span>{user.email}</span>
              <span>•</span>
              <span>{user.phone}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <button
            onClick={() => {
              setProfileName(user.name);
              setProfilePhone(user.phone);
              setIsEditingProfile(true);
            }}
            className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Profile
          </button>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl bg-rose-600/30 text-rose-100 hover:bg-rose-600/50 font-bold text-xs flex items-center gap-1.5 transition-colors border border-rose-400/40 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Log Out
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#F2DDD0] pb-4 mb-6">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-[#941B1B] text-white shadow-md'
              : 'bg-white text-[#6E564F] border border-[#F2DDD0] hover:border-[#EA580C]/40'
          }`}
        >
          <PackageCheck className="w-4 h-4" />
          <span>My Orders ({userOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'addresses'
              ? 'bg-[#941B1B] text-white shadow-md'
              : 'bg-white text-[#6E564F] border border-[#F2DDD0] hover:border-[#EA580C]/40'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Saved Addresses ({userAddresses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-[#941B1B] text-white shadow-md'
              : 'bg-white text-[#6E564F] border border-[#F2DDD0] hover:border-[#EA580C]/40'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile Info</span>
        </button>
      </div>

      {/* TAB 1: ORDERS HISTORY & TRACKING */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {userOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#F2DDD0] space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#FDEEE4] flex items-center justify-center mx-auto text-3xl">
                📦
              </div>
              <h3 className="font-serif text-lg font-bold text-[#231815]">
                You haven't placed an order yet
              </h3>
              <p className="text-xs text-[#826A62] max-w-sm mx-auto">
                Explore our South Indian tiffin, dosas, thalis, and Thalassery biriyani.
              </p>
            </div>
          ) : (
            userOrders.map((order) => {
              const isExpanded = expandedOrderId === order.id;
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-[#F2DDD0] p-5 shadow-xs hover:border-[#EA580C]/40 transition-all space-y-4"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#231815] text-sm">
                          Order #{order.order_number}
                        </span>
                        <OrderStatusBadge status={order.status} />
                      </div>
                      <p className="text-xs text-[#826A62] mt-0.5">
                        Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-right">
                        <p className="text-xs text-[#826A62]">Total Amount</p>
                        <p className="font-serif font-bold text-lg text-[#941B1B]">₹{order.total}</p>
                      </div>

                      <button
                        onClick={() => reorder(order)}
                        className="px-3.5 py-2 rounded-xl bg-[#FDEEE4] text-[#941B1B] hover:bg-[#EA580C] hover:text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reorder
                      </button>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {order.items.map((item) => (
                        <span
                          key={item.id}
                          className="px-2.5 py-1 rounded-lg bg-[#FCF8F5] border border-[#F2DDD0] text-xs font-semibold text-[#231815]"
                        >
                          {item.product_name} × {item.quantity}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Expand / Collapse Live Status Details */}
                  <div>
                    <button
                      onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                      className="text-xs font-bold text-[#EA580C] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {isExpanded ? (
                        <>
                          <span>Hide Live Status & Details</span>
                          <ChevronUp className="w-3.5 h-3.5" />
                        </>
                      ) : (
                        <>
                          <span>Track Kitchen Progress & Bill</span>
                          <ChevronDown className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Expanded Status & Details */}
                  {isExpanded && (
                    <div className="pt-4 border-t border-stone-100 space-y-4 animate-in fade-in duration-200">
                      {/* Timeline */}
                      <div className="bg-[#FCF8F5] p-4 rounded-2xl border border-[#F2DDD0]">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#826A62] mb-2">
                          Order Progress
                        </h4>
                        <OrderTimeline status={order.status} statusHistory={order.status_history} />
                      </div>

                      {/* WhatsApp Chat Shortcut for this order */}
                      <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                        <div className="flex items-center gap-2 text-emerald-900 font-semibold">
                          <MessageCircle className="w-4 h-4 text-emerald-700" />
                          <span>Need to modify or ask about Order #{order.order_number}?</span>
                        </div>
                        <a
                          href={openWhatsAppOrder(order, settings)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-emerald-800 hover:underline flex items-center gap-1"
                        >
                          Chat on WhatsApp <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      {/* Delivery Address */}
                      <div className="text-xs text-[#6E564F]">
                        <span className="font-bold text-[#231815]">Delivered to: </span>
                        {order.delivery_address}, {order.landmark && `${order.landmark}, `}{order.city} - {order.pincode}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: ADDRESSES */}
      {activeTab === 'addresses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-[#231815]">
              Saved Delivery Locations
            </h3>
            <button
              onClick={() => handleOpenAddressModal()}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#941B1B] to-[#EA580C] text-white hover:opacity-90 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add New Address
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userAddresses.map((addr) => (
              <div
                key={addr.id}
                className="bg-white rounded-2xl border border-[#F2DDD0] p-5 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FDEEE4] text-[#EA580C]">
                      {addr.label}
                    </span>
                    {addr.is_default && (
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Check className="w-3 h-3" /> Default Address
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-[#231815] leading-snug">
                    {addr.address_line}
                  </p>
                  {addr.landmark && (
                    <p className="text-xs text-[#826A62] mt-0.5">Landmark: {addr.landmark}</p>
                  )}
                  <p className="text-xs text-[#826A62] mt-0.5">{addr.city} - {addr.pincode}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-xs">
                  {!addr.is_default ? (
                    <button
                      onClick={() => setDefaultAddress(addr.id)}
                      className="font-bold text-[#EA580C] hover:underline cursor-pointer"
                    >
                      Set as Default
                    </button>
                  ) : (
                    <span className="text-stone-400 italic">Default</span>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenAddressModal(addr)}
                      className="p-1 text-stone-500 hover:text-[#231815] cursor-pointer"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteAddress(addr.id)}
                      className="p-1 text-stone-400 hover:text-rose-600 cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PROFILE INFO */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-[#F2DDD0] p-6 sm:p-8 max-w-xl space-y-6">
          <h3 className="font-serif font-bold text-xl text-[#231815]">
            Personal Information
          </h3>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between py-2 border-b border-stone-100">
              <span className="text-[#826A62]">Full Name</span>
              <span className="font-bold text-[#231815]">{user.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-stone-100">
              <span className="text-[#826A62]">Email Address</span>
              <span className="font-bold text-[#231815]">{user.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-stone-100">
              <span className="text-[#826A62]">Phone Number</span>
              <span className="font-bold text-[#231815]">{user.phone}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-stone-100">
              <span className="text-[#826A62]">Account Role</span>
              <span className="font-bold text-[#231815] uppercase text-xs px-2 py-0.5 rounded bg-[#FDEEE4] text-[#EA580C]">
                {user.role}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setProfileName(user.name);
                setProfilePhone(user.phone);
                setIsEditingProfile(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#941B1B] to-[#EA580C] text-white font-bold text-xs hover:opacity-90 transition-all cursor-pointer"
            >
              Update Profile Information
            </button>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#F2DDD0] space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#231815]">
              Edit Profile
            </h3>
            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#826A62] block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#F2DDD0] bg-white text-sm text-[#231815] focus:outline-none focus:border-[#EA580C]"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#826A62] block mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#F2DDD0] bg-white text-sm text-[#231815] focus:outline-none focus:border-[#EA580C]"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#F2DDD0] text-[#6E564F] font-bold text-xs hover:bg-[#FCF8F5] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#941B1B] to-[#EA580C] text-white font-bold text-xs hover:opacity-90 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Address Add / Edit Modal */}
      {isAddressFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-[#F2DDD0] space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#231815]">
              {editingAddressId ? 'Edit Address' : 'Add New Delivery Address'}
            </h3>

            <form onSubmit={handleSaveAddress} className="space-y-3">
              <div className="flex gap-2">
                {(['Home', 'Work', 'Other'] as const).map((lbl) => (
                  <button
                    key={lbl}
                    type="button"
                    onClick={() => setAddrLabel(lbl)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      addrLabel === lbl
                        ? 'bg-[#941B1B] text-white border-[#941B1B]'
                        : 'bg-white text-[#6E564F] border-[#F2DDD0]'
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#826A62] block mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat 4B, Kaveri Apartments"
                  value={addrLine}
                  onChange={(e) => setAddrLine(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#F2DDD0] bg-white text-sm text-[#231815] focus:outline-none focus:border-[#EA580C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#826A62] block mb-1">
                    Landmark
                  </label>
                  <input
                    type="text"
                    value={addrLandmark}
                    onChange={(e) => setAddrLandmark(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#F2DDD0] bg-white text-sm text-[#231815] focus:outline-none focus:border-[#EA580C]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#826A62] block mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={addrCity}
                    onChange={(e) => setAddrCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#F2DDD0] bg-white text-sm text-[#231815] focus:outline-none focus:border-[#EA580C]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#826A62] block mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    required
                    value={addrPincode}
                    onChange={(e) => setAddrPincode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#F2DDD0] bg-white text-sm text-[#231815] focus:outline-none focus:border-[#EA580C]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="addrDefaultCheck"
                  checked={addrIsDefault}
                  onChange={(e) => setAddrIsDefault(e.target.checked)}
                  className="rounded text-[#EA580C] focus:ring-[#EA580C]"
                />
                <label htmlFor="addrDefaultCheck" className="text-xs font-semibold text-[#6E564F]">
                  Set as my default delivery address
                </label>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddressFormOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#F2DDD0] text-[#6E564F] font-bold text-xs hover:bg-[#FCF8F5] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#941B1B] to-[#EA580C] text-white font-bold text-xs hover:opacity-90 cursor-pointer"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
