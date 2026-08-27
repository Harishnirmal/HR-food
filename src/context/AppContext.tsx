import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  User, 
  Product, 
  Category, 
  Order, 
  RestaurantSettings, 
  Address, 
  CartItem, 
  CartCustomization, 
  OrderStatus, 
  PaymentMethod 
} from '../types';
import { 
  INITIAL_SETTINGS, 
  INITIAL_CATEGORIES, 
  INITIAL_PRODUCTS, 
  INITIAL_USERS, 
  INITIAL_ADDRESSES, 
  INITIAL_ORDERS 
} from '../data/initialData';
import { openWhatsAppOrder, isRestaurantOpen } from '../utils/whatsapp';

export type ViewType = 'home' | 'menu' | 'about' | 'contact' | 'account' | 'admin' | 'track-order';

interface AppContextType {
  // Navigation & Modals
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  selectedCategorySlug: string | null;
  setSelectedCategorySlug: (slug: string | null) => void;
  selectedProductDetails: Product | null;
  setSelectedProductDetails: (product: Product | null) => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register' | 'forgot';
  setAuthModalMode: (mode: 'login' | 'register' | 'forgot') => void;
  lastConfirmedOrder: Order | null;
  setLastConfirmedOrder: (order: Order | null) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  vegOnlyFilter: boolean;
  setVegOnlyFilter: (val: boolean) => void;

  // Notification Toast
  toast: { id: string; type: 'success' | 'error' | 'info'; message: string } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;

  // Auth & Profile
  user: User | null;
  users: User[];
  login: (email: string, pass: string) => boolean;
  register: (name: string, email: string, phone: string, pass: string) => boolean;
  logout: () => void;
  updateProfile: (name: string, phone: string) => void;
  switchRoleDemo: (role: 'admin' | 'customer') => void;

  // Store Entities
  settings: RestaurantSettings;
  updateSettings: (newSettings: Partial<RestaurantSettings>) => void;
  categories: Category[];
  products: Product[];
  orders: Order[];
  addresses: Address[];
  
  // Cart & Calculation
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, customization?: CartCustomization) => void;
  updateCartItemQuantity: (cartItemId: string, delta: number) => void;
  removeCartItem: (cartItemId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartDeliveryFee: number;
  cartDiscount: number;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  cartTotal: number;
  cartItemCount: number;

  // Order Placement
  createOrder: (data: {
    customer_name: string;
    phone: string;
    email?: string;
    delivery_address: string;
    landmark?: string;
    city: string;
    pincode: string;
    delivery_instructions?: string;
    payment_method: PaymentMethod;
    openWhatsAppDirectly?: boolean;
  }) => { order: Order; whatsappUrl: string } | null;
  
  reorder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;

  // Admin CRUD Products
  addProduct: (product: Omit<Product, 'id' | 'created_at'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductAvailability: (id: string) => void;

  // Admin CRUD Categories
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Customer Addresses
  addAddress: (address: Omit<Address, 'id' | 'user_id'>) => void;
  updateAddress: (id: string, updates: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  // Operating status helper
  restaurantStatus: { isOpen: boolean; message: string };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'hari_user_v2',
  USERS: 'hari_users_v2',
  SETTINGS: 'hari_settings_v2',
  CATEGORIES: 'hari_categories_v2',
  PRODUCTS: 'hari_products_v2',
  ORDERS: 'hari_orders_v2',
  ADDRESSES: 'hari_addresses_v2',
  CART: 'hari_cart_v2',
  COUPON: 'hari_coupon_v2',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & UI States
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [lastConfirmedOrder, setLastConfirmedOrder] = useState<Order | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [vegOnlyFilter, setVegOnlyFilter] = useState<boolean>(false);

  // Toast
  const [toast, setToast] = useState<{ id: string; type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ id: Date.now().toString(), type, message });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  const hideToast = () => setToast(null);

  // Persistent States
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : INITIAL_USERS[1]; // default to customer demo
    } catch {
      return INITIAL_USERS[1];
    }
  });

  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [settings, setSettings] = useState<RestaurantSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Automatically migrate if previous placeholder number was cached in browser
        if (!parsed.whatsapp_number || parsed.whatsapp_number.includes('9840123456')) {
          parsed.whatsapp_number = '+919345576736';
          parsed.phone = '+91 93455 76736';
          localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(parsed));
        }
        return parsed;
      }
      return INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [addresses, setAddresses] = useState<Address[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADDRESSES);
      return saved ? JSON.parse(saved) : INITIAL_ADDRESSES;
    } catch {
      return INITIAL_ADDRESSES;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.COUPON) || null;
    } catch {
      return null;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      if (user) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      else localStorage.removeItem(STORAGE_KEYS.USER);
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error(e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify(addresses));
    } catch (e) {
      console.error(e);
    }
  }, [addresses]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      if (appliedCoupon) localStorage.setItem(STORAGE_KEYS.COUPON, appliedCoupon);
      else localStorage.removeItem(STORAGE_KEYS.COUPON);
    } catch (e) {
      console.error(e);
    }
  }, [appliedCoupon]);

  // Cart Calculations
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.total_price, 0);
  }, [cart]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  const cartDeliveryFee = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    if (cartSubtotal >= settings.free_delivery_threshold) return 0;
    return settings.delivery_fee;
  }, [cartSubtotal, settings.free_delivery_threshold, settings.delivery_fee]);

  const cartDiscount = useMemo(() => {
    if (!appliedCoupon || cartSubtotal === 0) return 0;
    const normalized = appliedCoupon.trim().toUpperCase();
    if (normalized === 'FAMILY10' || normalized === 'HARI10') {
      return Math.round(cartSubtotal * 0.1);
    }
    if (normalized === 'HARI50' || normalized === 'ANNAPOORNA50') {
      return Math.min(50, cartSubtotal);
    }
    if (normalized === 'NONVEG20') {
      return Math.min(120, Math.round(cartSubtotal * 0.2));
    }
    if (normalized === 'WELCOME100') {
      return Math.min(100, Math.round(cartSubtotal * 0.2));
    }
    return 0;
  }, [appliedCoupon, cartSubtotal]);

  const cartTotal = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    return Math.max(0, cartSubtotal + cartDeliveryFee - cartDiscount);
  }, [cartSubtotal, cartDeliveryFee, cartDiscount]);

  const applyCoupon = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    if (['HARI50', 'HARI10', 'NONVEG20', 'FAMILY10', 'WELCOME100', 'ANNAPOORNA50'].includes(trimmed)) {
      setAppliedCoupon(trimmed);
      showToast(`Coupon "${trimmed}" applied successfully!`, 'success');
      return { success: true, message: 'Coupon applied!' };
    }
    showToast('Invalid coupon code. Try "HARI50", "HARI10" or "NONVEG20".', 'error');
    return { success: false, message: 'Invalid coupon code' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed.', 'info');
  };

  // Cart Mutators
  const addToCart = (product: Product, quantity = 1, customization?: CartCustomization) => {
    if (!product.available) {
      showToast('This item is currently unavailable', 'error');
      return;
    }

    const effectiveCustomization: CartCustomization = customization || {
      spice_level: product.spice_level,
      addons: [],
      special_instructions: ''
    };

    // Build unique composite key for item customization
    const addonKey = (effectiveCustomization.addons || [])
      .map((a) => a.id)
      .sort()
      .join('-');
    const cartItemId = `${product.id}__${effectiveCustomization.spice_level}__${addonKey}__${effectiveCustomization.special_instructions || ''}`;

    const addonsTotal = (effectiveCustomization.addons || []).reduce((sum, a) => sum + a.price, 0);
    const unit_price = product.price + addonsTotal;

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          total_price: unit_price * newQty
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            id: cartItemId,
            product_id: product.id,
            product,
            quantity,
            customization: effectiveCustomization,
            unit_price,
            total_price: unit_price * quantity
          }
        ];
      }
    });

    showToast(`Added ${product.name} to cart!`, 'success');
  };

  const updateCartItemQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              total_price: item.unit_price * newQty
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeCartItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== cartItemId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Auth Operations
  const login = (email: string, _pass: string): boolean => {
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setUser(found);
      showToast(`Welcome back, ${found.name}!`, 'success');
      return true;
    }
    // Auto register demo customer if unknown
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0],
      email,
      phone: '+91 98400 00000',
      role: email.includes('admin') ? 'admin' : 'customer',
      created_at: new Date().toISOString()
    };
    setUsers((prev) => [...prev, newUser]);
    setUser(newUser);
    showToast(`Logged in as ${newUser.name}`, 'success');
    return true;
  };

  const register = (name: string, email: string, phone: string, _pass: string): boolean => {
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      showToast('An account with this email already exists. Please log in.', 'error');
      return false;
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone,
      role: 'customer',
      created_at: new Date().toISOString()
    };
    setUsers((prev) => [...prev, newUser]);
    setUser(newUser);
    showToast(`Account created! Welcome to Hari Restaurant, ${name}.`, 'success');
    return true;
  };

  const logout = () => {
    setUser(null);
    if (currentView === 'admin' || currentView === 'account') {
      setCurrentView('home');
    }
    showToast('You have been logged out.', 'info');
  };

  const updateProfile = (name: string, phone: string) => {
    if (!user) return;
    const updated: User = { ...user, name, phone, updated_at: new Date().toISOString() };
    setUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
    showToast('Profile updated successfully!', 'success');
  };

  const switchRoleDemo = (role: 'admin' | 'customer') => {
    if (role === 'admin') {
      const admin = users.find((u) => u.role === 'admin') || INITIAL_USERS[0];
      setUser(admin);
      setCurrentView('admin');
      showToast('Switched to Admin account', 'info');
    } else {
      const customer = users.find((u) => u.role === 'customer') || INITIAL_USERS[1];
      setUser(customer);
      if (currentView === 'admin') setCurrentView('home');
      showToast('Switched to Customer account', 'info');
    }
  };

  // Order Placement (Server / State authoritative calculation)
  const createOrder = (data: {
    customer_name: string;
    phone: string;
    email?: string;
    delivery_address: string;
    landmark?: string;
    city: string;
    pincode: string;
    delivery_instructions?: string;
    payment_method: PaymentMethod;
    openWhatsAppDirectly?: boolean;
  }) => {
    if (cart.length === 0) {
      showToast('Your cart is empty', 'error');
      return null;
    }

    // Recalculate prices against latest product catalog to prevent price tampering
    let secureSubtotal = 0;
    const orderItems = cart.map((cartItem, idx) => {
      const liveProduct = products.find((p) => p.id === cartItem.product_id);
      const basePrice = liveProduct ? liveProduct.price : cartItem.product.price;
      const addonsPrice = (cartItem.customization.addons || []).reduce((sum, a) => sum + a.price, 0);
      const secureUnitPrice = basePrice + addonsPrice;
      const itemSubtotal = secureUnitPrice * cartItem.quantity;
      secureSubtotal += itemSubtotal;

      return {
        id: `oi-${Date.now()}-${idx}`,
        order_id: '',
        product_id: cartItem.product_id,
        product_name: liveProduct ? liveProduct.name : cartItem.product.name,
        quantity: cartItem.quantity,
        unit_price: secureUnitPrice,
        customizations: cartItem.customization,
        subtotal: itemSubtotal,
        image_url: liveProduct?.image_url || cartItem.product.image_url,
        veg: liveProduct ? liveProduct.veg : cartItem.product.veg
      };
    });

    const deliveryFee = secureSubtotal >= settings.free_delivery_threshold ? 0 : settings.delivery_fee;
    let discount = 0;
    if (appliedCoupon) {
      const norm = appliedCoupon.toUpperCase();
      if (norm === 'FAMILY10' || norm === 'HARI10') discount = Math.round(secureSubtotal * 0.1);
      else if (norm === 'HARI50' || norm === 'ANNAPOORNA50') discount = Math.min(50, secureSubtotal);
      else if (norm === 'NONVEG20') discount = Math.min(120, Math.round(secureSubtotal * 0.2));
      else if (norm === 'WELCOME100') discount = Math.min(100, Math.round(secureSubtotal * 0.2));
    }
    const secureTotal = Math.max(0, secureSubtotal + deliveryFee - discount);

    const orderNumber = `HARI-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrderId = `ord-${Date.now()}`;
    const timestamp = new Date().toISOString();

    const finalizedOrder: Order = {
      id: newOrderId,
      order_number: orderNumber,
      user_id: user?.id,
      customer_name: data.customer_name,
      phone: data.phone,
      email: data.email || user?.email,
      delivery_address: data.delivery_address,
      landmark: data.landmark,
      city: data.city,
      pincode: data.pincode,
      delivery_instructions: data.delivery_instructions,
      payment_method: data.payment_method,
      items: orderItems.map((item) => ({ ...item, order_id: newOrderId })),
      subtotal: secureSubtotal,
      delivery_fee: deliveryFee,
      discount,
      discount_code: appliedCoupon || undefined,
      total: secureTotal,
      status: 'Pending',
      status_history: [
        {
          status: 'Pending',
          timestamp,
          note: 'Order placed via Web App'
        }
      ],
      created_at: timestamp,
      updated_at: timestamp,
      whatsapp_sent: true
    };

    setOrders((prev) => [finalizedOrder, ...prev]);
    setLastConfirmedOrder(finalizedOrder);
    clearCart();
    setIsCheckoutModalOpen(false);

    // Generate WhatsApp link and trigger
    const whatsappUrl = openWhatsAppOrder(finalizedOrder, settings);
    if (data.openWhatsAppDirectly !== false) {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }

    showToast(`Order #${finalizedOrder.order_number} created successfully!`, 'success');
    return { order: finalizedOrder, whatsappUrl };
  };

  const reorder = (prevOrder: Order) => {
    let addedCount = 0;
    prevOrder.items.forEach((item) => {
      const product = products.find((p) => p.id === item.product_id);
      if (product && product.available) {
        addToCart(product, item.quantity, item.customizations);
        addedCount++;
      }
    });

    if (addedCount > 0) {
      setIsCartDrawerOpen(true);
      showToast(`Added ${addedCount} items from Order #${prevOrder.order_number} to cart!`, 'success');
    } else {
      showToast('Items from this order are currently out of stock', 'error');
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, note?: string) => {
    const timestamp = new Date().toISOString();
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const newHistory = [...ord.status_history, { status: newStatus, timestamp, note }];
          return {
            ...ord,
            status: newStatus,
            status_history: newHistory,
            updated_at: timestamp
          };
        }
        return ord;
      })
    );

    // Also update lastConfirmedOrder if it's currently displayed
    setLastConfirmedOrder((prev) => {
      if (prev && prev.id === orderId) {
        return {
          ...prev,
          status: newStatus,
          status_history: [...prev.status_history, { status: newStatus, timestamp, note }],
          updated_at: timestamp
        };
      }
      return prev;
    });

    showToast(`Order status updated to: ${newStatus}`, 'info');
  };

  // Product CRUD
  const addProduct = (productData: Omit<Product, 'id' | 'created_at'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Added "${newProduct.name}" to menu`, 'success');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p))
    );
    showToast('Product updated successfully', 'success');
  };

  const deleteProduct = (id: string) => {
    const prod = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast(`Deleted ${prod?.name || 'dish'}`, 'info');
  };

  const toggleProductAvailability = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const next = !p.available;
          showToast(`${p.name} is now ${next ? 'Available' : 'Unavailable'}`, next ? 'success' : 'info');
          return { ...p, available: next };
        }
        return p;
      })
    );
  };

  // Category CRUD
  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: `cat-${Date.now()}`
    };
    setCategories((prev) => [...prev, newCategory]);
    showToast(`Added category "${newCategory.name}"`, 'success');
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    showToast('Category updated', 'success');
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast('Category removed', 'info');
  };

  // Settings
  const updateSettings = (newSettings: Partial<RestaurantSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Restaurant settings updated successfully', 'success');
  };

  // Customer Addresses
  const addAddress = (addressData: Omit<Address, 'id' | 'user_id'>) => {
    if (!user) return;
    const newAddr: Address = {
      ...addressData,
      id: `addr-${Date.now()}`,
      user_id: user.id
    };
    if (newAddr.is_default) {
      setAddresses((prev) => prev.map((a) => (a.user_id === user.id ? { ...a, is_default: false } : a)));
    }
    setAddresses((prev) => [...prev, newAddr]);
    showToast('New address saved', 'success');
  };

  const updateAddress = (id: string, updates: Partial<Address>) => {
    if (!user) return;
    if (updates.is_default) {
      setAddresses((prev) => prev.map((a) => (a.user_id === user.id ? { ...a, is_default: false } : a)));
    }
    setAddresses((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
    showToast('Address updated', 'success');
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    showToast('Address deleted', 'info');
  };

  const setDefaultAddress = (id: string) => {
    if (!user) return;
    setAddresses((prev) =>
      prev.map((a) => (a.user_id === user.id ? { ...a, is_default: a.id === id } : a))
    );
    showToast('Default address set', 'success');
  };

  const restaurantStatus = useMemo(() => {
    return isRestaurantOpen(settings);
  }, [settings]);

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedCategorySlug,
        setSelectedCategorySlug,
        selectedProductDetails,
        setSelectedProductDetails,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        lastConfirmedOrder,
        setLastConfirmedOrder,
        isSearchModalOpen,
        setIsSearchModalOpen,
        searchQuery,
        setSearchQuery,
        vegOnlyFilter,
        setVegOnlyFilter,

        toast,
        showToast,
        hideToast,

        user,
        users,
        login,
        register,
        logout,
        updateProfile,
        switchRoleDemo,

        settings,
        updateSettings,
        categories,
        products,
        orders,
        addresses,

        cart,
        addToCart,
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

        createOrder,
        reorder,
        updateOrderStatus,

        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductAvailability,

        addCategory,
        updateCategory,
        deleteCategory,

        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,

        restaurantStatus
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
