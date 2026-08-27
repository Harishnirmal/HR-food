import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, Category, Order, OrderStatus, ProductAddon, SpiceLevel } from '../../types';
import { OrderStatusBadge, VegIndicator } from '../common/Badge';
import { OrderTimeline } from '../order/OrderTimeline';
import { 
  ShoppingBag, 
  TrendingUp, 
  Clock, 
  Utensils, 
  Settings, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  MessageCircle, 
  ExternalLink, 
  Power, 
  Search, 
  Filter, 
  Save, 
  Layers, 
  Flame, 
  ShieldAlert,
  Store,
  DollarSign,
  AlertCircle
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    user,
    products,
    categories,
    orders,
    settings,
    updateOrderStatus,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductAvailability,
    addCategory,
    updateCategory,
    deleteCategory,
    updateSettings,
    toggleRestaurantOpen,
    switchRoleDemo,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'categories' | 'settings'>('orders');

  // Order filters
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Product CRUD states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState(categories[0]?.slug || 'dosa-varieties');
  const [prodDescription, setProdDescription] = useState('');
  const [prodPrice, setProdPrice] = useState<number>(100);
  const [prodOriginalPrice, setProdOriginalPrice] = useState<number | undefined>(undefined);
  const [prodImageUrl, setProdImageUrl] = useState('');
  const [prodVeg, setProdVeg] = useState(true);
  const [prodSpice, setProdSpice] = useState<SpiceLevel>('medium');
  const [prodBestseller, setProdBestseller] = useState(false);
  const [prodFeatured, setProdFeatured] = useState(false);
  const [prodAvailable, setProdAvailable] = useState(true);
  const [prodPrepTime, setProdPrepTime] = useState(15);
  const [prodAddons, setProdAddons] = useState<ProductAddon[]>([]);

  // Category CRUD states
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catImage, setCatImage] = useState('');
  const [catOrder, setCatOrder] = useState(1);

  // Settings state
  const [restSettings, setRestSettings] = useState(settings);

  // Check if admin
  if (user?.role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white rounded-3xl border border-rose-200 text-center space-y-4 shadow-lg">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-stone-900">Admin Access Required</h2>
        <p className="text-sm text-stone-600">
          You are currently signed in as a Customer. Switch to the Admin role to access the management portal.
        </p>
        <button
          onClick={() => switchRoleDemo('admin')}
          className="px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold text-sm shadow-md transition-all active:scale-95"
        >
          Switch to Admin Demo Account
        </button>
      </div>
    );
  }

  // Metric computations
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.total : 0), 0);
  const activeOrdersCount = orders.filter((o) => ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Out for Delivery'].includes(o.status)).length;
  const todayOrdersCount = orders.length;

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    const matchesSearch = 
      o.order_number.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.phone.includes(orderSearchQuery);
    return matchesStatus && matchesSearch;
  });

  // Product Modal Open
  const handleOpenProductModal = (product?: Product) => {
    if (product) {
      setEditingProductId(product.id);
      setProdName(product.name);
      setProdCategory(product.category_slug || product.category_id);
      setProdDescription(product.description);
      setProdPrice(product.price);
      setProdOriginalPrice(product.original_price);
      setProdImageUrl(product.image_url);
      setProdVeg(product.veg);
      setProdSpice(product.spice_level);
      setProdBestseller(product.bestseller || false);
      setProdFeatured(product.featured || false);
      setProdAvailable(product.available);
      setProdPrepTime(product.preparation_time_mins);
      setProdAddons(product.addons || []);
    } else {
      setEditingProductId(null);
      setProdName('');
      setProdCategory(categories[0]?.slug || 'dosa-varieties');
      setProdDescription('');
      setProdPrice(120);
      setProdOriginalPrice(undefined);
      setProdImageUrl('https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80');
      setProdVeg(true);
      setProdSpice('medium');
      setProdBestseller(false);
      setProdFeatured(false);
      setProdAvailable(true);
      setProdPrepTime(15);
      setProdAddons([
        { id: 'extra-chutney', name: 'Extra Coconut Chutney', price: 15, available: true },
        { id: 'extra-sambar', name: 'Extra Sambar Bowl', price: 20, available: true }
      ]);
    }
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim() || !prodPrice) {
      showToast('Product name and price are required', 'error');
      return;
    }

    if (editingProductId) {
      updateProduct(editingProductId, {
        name: prodName.trim(),
        category_id: prodCategory,
        category_slug: prodCategory,
        description: prodDescription.trim(),
        price: Number(prodPrice),
        original_price: prodOriginalPrice ? Number(prodOriginalPrice) : undefined,
        image_url: prodImageUrl.trim() || 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
        veg: prodVeg,
        spice_level: prodSpice,
        bestseller: prodBestseller,
        featured: prodFeatured,
        available: prodAvailable,
        preparation_time_mins: Number(prodPrepTime),
        addons: prodAddons
      });
    } else {
      addProduct({
        name: prodName.trim(),
        category_id: prodCategory,
        category_slug: prodCategory,
        slug: prodName.trim().toLowerCase().replace(/\s+/g, '-'),
        description: prodDescription.trim(),
        price: Number(prodPrice),
        original_price: prodOriginalPrice ? Number(prodOriginalPrice) : undefined,
        image_url: prodImageUrl.trim() || 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
        veg: prodVeg,
        spice_level: prodSpice,
        bestseller: prodBestseller,
        featured: prodFeatured,
        available: prodAvailable,
        preparation_time_mins: Number(prodPrepTime),
        rating: 4.8,
        rating_count: 1,
        addons: prodAddons
      });
    }
    setIsProductModalOpen(false);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(restSettings);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#941B1B] via-[#7C1313] to-[#EA580C] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-white text-[#EA580C] uppercase tracking-wider">
              Admin Portal
            </span>
            <span className="text-xs text-stone-200">• Real-Time Kitchen Operations</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold mt-1">
            {settings.restaurant_name} Management
          </h1>
        </div>

        {/* Live Restaurant Status Toggle */}
        <div className="flex items-center gap-4 bg-white/10 p-3 rounded-2xl border border-white/15 backdrop-blur-xs">
          <div className="text-right">
            <p className="text-xs font-semibold text-white/80">Kitchen Status</p>
            <p className={`text-sm font-bold ${settings.is_open ? 'text-emerald-400' : 'text-rose-400'}`}>
              {settings.is_open ? 'Open & Taking Orders' : 'Kitchen Closed'}
            </p>
          </div>
          <button
            onClick={toggleRestaurantOpen}
            className={`w-12 h-7 rounded-full transition-colors relative p-1 cursor-pointer ${
              settings.is_open ? 'bg-emerald-500' : 'bg-rose-500'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                settings.is_open ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#F2DDD0] shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
            <span>Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-[#EA580C]" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-[#231815] mt-2">
            {todayOrdersCount}
          </p>
          <p className="text-[11px] text-stone-400 mt-1">All time received</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#F2DDD0] shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
            <span>Active in Kitchen</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-amber-700 mt-2">
            {activeOrdersCount}
          </p>
          <p className="text-[11px] text-stone-400 mt-1">Pending & Out for delivery</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#F2DDD0] shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
            <span>Total Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-[#941B1B] mt-2">
            ₹{totalRevenue.toLocaleString()}
          </p>
          <p className="text-[11px] text-stone-400 mt-1">WhatsApp & COD billings</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#F2DDD0] shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
            <span>Active Menu Items</span>
            <Utensils className="w-4 h-4 text-[#EA580C]" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-[#231815] mt-2">
            {products.length}
          </p>
          <p className="text-[11px] text-stone-400 mt-1">Across {categories.length} categories</p>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[#F2DDD0] pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-[#941B1B] text-white shadow-md'
              : 'bg-white text-[#6E564F] border border-[#F2DDD0] hover:border-[#EA580C]/40'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Orders Management ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'products'
              ? 'bg-[#941B1B] text-white shadow-md'
              : 'bg-white text-[#6E564F] border border-[#F2DDD0] hover:border-[#EA580C]/40'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Product Catalog ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'categories'
              ? 'bg-[#941B1B] text-white shadow-md'
              : 'bg-white text-[#6E564F] border border-[#F2DDD0] hover:border-[#EA580C]/40'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Categories ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-[#941B1B] text-white shadow-md'
              : 'bg-white text-[#6E564F] border border-[#F2DDD0] hover:border-[#EA580C]/40'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Restaurant Settings</span>
        </button>
      </div>

      {/* TAB 1: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-2xl border border-[#E8DFD3]">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search order #, name, phone..."
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-[#183928]"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto no-scrollbar">
              {(['all', 'Pending', 'Confirmed', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    orderStatusFilter === st
                      ? 'bg-[#183928] text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {st === 'all' ? 'All Orders' : st}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 text-stone-500">
                No orders match your filter.
              </div>
            ) : (
              filteredOrders.map((order) => {
                const cleanPhone = order.phone.replace(/[^0-9]/g, '');
                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl border border-[#E8DFD3] p-5 sm:p-6 shadow-xs hover:border-[#DECBB6] transition-all space-y-4"
                  >
                    {/* Header line */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-stone-900 text-base sm:text-lg">
                            Order #{order.order_number}
                          </span>
                          <OrderStatusBadge status={order.status} />
                        </div>
                        <p className="text-xs text-stone-400 mt-1">
                          Received: {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Customer: <span className="text-stone-800 font-semibold">{order.customer_name}</span> ({order.phone})
                        </p>
                      </div>

                      {/* Status Update Control */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-stone-600">Update Status:</span>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className="px-3 py-1.5 rounded-xl border border-stone-300 bg-[#FAF7F2] font-bold text-xs text-stone-900 focus:outline-none focus:border-[#183928]"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Ready">Ready for Pickup</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>

                        <a
                          href={`https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(order.customer_name)}%2C%20regarding%20your%20Annapoorna%20Order%20%23${order.order_number}%3A%20Your%20food%20is%20${encodeURIComponent(order.status)}!`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-[#25D366] text-stone-900 font-bold text-xs hover:bg-[#1EBE5D] flex items-center gap-1.5 shadow-xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-stone-900" />
                          Chat Customer
                        </a>
                      </div>
                    </div>

                    {/* Order Details & Items Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left: Items list */}
                      <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#ECE3D5] space-y-2 text-xs">
                        <p className="font-bold text-stone-900 mb-1">Dishes ({order.items.length})</p>
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between py-1 border-b border-stone-200/60 last:border-0">
                            <div>
                              <span className="font-semibold text-stone-900">{item.product_name}</span> × {item.quantity}
                              {item.customizations.addons && item.customizations.addons.length > 0 && (
                                <p className="text-[10px] text-stone-500">
                                  + {item.customizations.addons.map((a) => a.name).join(', ')}
                                </p>
                              )}
                              {item.customizations.special_instructions && (
                                <p className="text-[10px] text-[#C85A32] italic">
                                  "{item.customizations.special_instructions}"
                                </p>
                              )}
                            </div>
                            <span className="font-bold text-stone-800">₹{item.subtotal}</span>
                          </div>
                        ))}

                        <div className="pt-2 border-t border-stone-200 flex justify-between font-extrabold text-sm text-[#183928]">
                          <span>Order Total</span>
                          <span>₹{order.total}</span>
                        </div>
                      </div>

                      {/* Right: Delivery Address & Instructions */}
                      <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#ECE3D5] space-y-2 text-xs text-stone-700">
                        <p className="font-bold text-stone-900">Delivery Information</p>
                        <p className="text-stone-600">
                          {order.delivery_address}
                        </p>
                        {order.landmark && <p className="text-stone-500">Landmark: {order.landmark}</p>}
                        <p className="text-stone-500">{order.city} - {order.pincode}</p>
                        {order.delivery_instructions && (
                          <p className="text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200 text-[11px]">
                            <strong>Customer Note:</strong> {order.delivery_instructions}
                          </p>
                        )}
                        <p className="text-[11px] text-stone-400 pt-1">
                          Payment Method: <span className="uppercase font-bold text-stone-700">{order.payment_method}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCT CATALOG MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-xl text-stone-900">Food Menu Catalog</h3>
              <p className="text-xs text-stone-500">Add dishes, set prices, mark bestsellers, or toggle daily availability</p>
            </div>
            <button
              onClick={() => handleOpenProductModal()}
              className="px-4 py-2.5 rounded-xl bg-[#183928] text-white hover:bg-[#10271B] font-bold text-xs flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              Add New Dish
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-[#E8DFD3] p-4 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex gap-3">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-20 h-20 rounded-xl object-cover border border-stone-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <VegIndicator veg={product.veg} size="sm" />
                        <h4 className="font-bold text-sm text-stone-900 truncate">
                          {product.name}
                        </h4>
                      </div>
                      <p className="text-xs font-bold text-[#183928] mt-1">₹{product.price}</p>
                      <p className="text-[11px] text-stone-500 line-clamp-2 mt-1 leading-tight">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-stone-100">
                    {product.bestseller && (
                      <span className="text-[10px] font-bold bg-[#C85A32] text-white px-2 py-0.5 rounded-md">
                        Bestseller
                      </span>
                    )}
                    <span className="text-[10px] font-semibold bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md capitalize">
                      {(product.category_slug || product.category_id || '').replace('cat-', '').replace('-', ' ')}
                    </span>
                    <span className="text-[10px] font-semibold bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md">
                      {product.preparation_time_mins} mins
                    </span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                  {/* Availability Toggle */}
                  <button
                    onClick={() => toggleProductAvailability(product.id)}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                      product.available
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                    }`}
                  >
                    {product.available ? '● Available' : '○ Sold Out'}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenProductModal(product)}
                      className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100"
                      title="Edit dish"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                      title="Delete dish"
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

      {/* TAB 3: CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-xl text-stone-900">Food Categories</h3>
              <p className="text-xs text-stone-500">Organize your menu for customer navigation</p>
            </div>
            <button
              onClick={() => {
                setEditingCatId(null);
                setCatName('');
                setCatSlug('');
                setCatDesc('');
                setCatImage('https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80');
                setCatOrder(categories.length + 1);
                setIsCategoryModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-[#183928] text-white hover:bg-[#10271B] font-bold text-xs flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              Add Category
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-2xl border border-[#E8DFD3] p-4 shadow-xs flex items-center gap-4 justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    className="w-14 h-14 rounded-xl object-cover border border-stone-200 shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">{cat.name}</h4>
                    <p className="text-[11px] text-stone-400">Slug: {cat.slug}</p>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${cat.active ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-500'}`}>
                      {cat.active ? 'Active' : 'Hidden'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingCatId(cat.id);
                      setCatName(cat.name);
                      setCatSlug(cat.slug);
                      setCatDesc(cat.description || '');
                      setCatImage(cat.image_url);
                      setCatOrder(cat.display_order);
                      setIsCategoryModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: RESTAURANT SETTINGS */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl border border-[#E8DFD3] p-6 sm:p-8 space-y-6 max-w-3xl">
          <div>
            <h3 className="font-serif font-bold text-xl text-stone-900">
              Restaurant & Delivery Settings
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Configure WhatsApp order number, delivery charges, free shipping threshold, and store timings.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
                Restaurant Name
              </label>
              <input
                type="text"
                required
                value={restSettings.restaurant_name}
                onChange={(e) => setRestSettings({ ...restSettings, restaurant_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 focus:outline-none focus:border-[#183928]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
                WhatsApp Order Number
              </label>
              <input
                type="text"
                required
                value={restSettings.whatsapp_number}
                onChange={(e) => setRestSettings({ ...restSettings, whatsapp_number: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 focus:outline-none focus:border-[#183928]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                required
                value={restSettings.phone}
                onChange={(e) => setRestSettings({ ...restSettings, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 focus:outline-none focus:border-[#183928]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={restSettings.email}
                onChange={(e) => setRestSettings({ ...restSettings, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 focus:outline-none focus:border-[#183928]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
                Standard Delivery Fee (₹)
              </label>
              <input
                type="number"
                required
                value={restSettings.delivery_fee}
                onChange={(e) => setRestSettings({ ...restSettings, delivery_fee: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 focus:outline-none focus:border-[#183928]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
                Free Delivery Above (₹)
              </label>
              <input
                type="number"
                required
                value={restSettings.free_delivery_threshold}
                onChange={(e) => setRestSettings({ ...restSettings, free_delivery_threshold: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 focus:outline-none focus:border-[#183928]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
                Opening Time
              </label>
              <input
                type="text"
                required
                value={restSettings.open_time}
                onChange={(e) => setRestSettings({ ...restSettings, open_time: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 focus:outline-none focus:border-[#183928]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
                Closing Time
              </label>
              <input
                type="text"
                required
                value={restSettings.close_time}
                onChange={(e) => setRestSettings({ ...restSettings, close_time: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 focus:outline-none focus:border-[#183928]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
                UPI Payment ID / VPA
              </label>
              <input
                type="text"
                value={restSettings.upi_id || ''}
                onChange={(e) => setRestSettings({ ...restSettings, upi_id: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 focus:outline-none focus:border-[#183928]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#183928] text-white font-bold text-sm hover:bg-[#10271B] flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              Save Restaurant Settings
            </button>
          </div>
        </form>
      )}

      {/* Product Add/Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-xl bg-[#FCFAF6] rounded-3xl p-6 shadow-2xl border border-[#E8DFD3] space-y-4 my-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-serif font-bold text-lg text-stone-900">
                {editingProductId ? 'Edit Food Dish' : 'Add New Food Dish'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)}>
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
                  Dish Name
                </label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 focus:outline-none focus:border-[#183928]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
                    Category
                  </label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={prodDescription}
                  onChange={(e) => setProdDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={prodImageUrl}
                  onChange={(e) => setProdImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900"
                />
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={prodVeg}
                    onChange={(e) => setProdVeg(e.target.checked)}
                    className="rounded text-[#183928]"
                  />
                  <span>Pure Vegetarian</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={prodBestseller}
                    onChange={(e) => setProdBestseller(e.target.checked)}
                    className="rounded text-[#183928]"
                  />
                  <span>Mark as Bestseller</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={prodAvailable}
                    onChange={(e) => setProdAvailable(e.target.checked)}
                    className="rounded text-[#183928]"
                  />
                  <span>Available for Order Today</span>
                </label>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#183928] text-white font-bold text-xs hover:bg-[#10271B]"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[#FCFAF6] rounded-3xl p-6 shadow-2xl border border-[#E8DFD3] space-y-4">
            <h3 className="font-serif font-bold text-lg text-stone-900">
              {editingCatId ? 'Edit Category' : 'Add Category'}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => {
                    setCatName(e.target.value);
                    if (!editingCatId) setCatSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  required
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-1">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={catImage}
                  onChange={(e) => setCatImage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-3">
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!catName.trim() || !catSlug.trim()) {
                    showToast('Category name and slug are required', 'error');
                    return;
                  }
                  if (editingCatId) {
                    updateCategory(editingCatId, {
                      name: catName.trim(),
                      slug: catSlug.trim(),
                      description: catDesc.trim(),
                      image_url: catImage.trim(),
                      display_order: catOrder
                    });
                  } else {
                    addCategory({
                      name: catName.trim(),
                      slug: catSlug.trim(),
                      description: catDesc.trim(),
                      image_url: catImage.trim(),
                      display_order: catOrder,
                      active: true
                    });
                  }
                  setIsCategoryModalOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#183928] text-white font-bold text-xs hover:bg-[#10271B]"
              >
                Save Category
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
