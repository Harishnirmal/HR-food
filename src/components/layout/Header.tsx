import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HariLogo } from '../common/HariLogo';
import { 
  ShoppingBag, 
  Search, 
  User as UserIcon, 
  Menu as MenuIcon, 
  X, 
  Phone, 
  MessageCircle, 
  Clock, 
  Shield, 
  MapPin, 
  ChevronDown,
  Sparkles,
  LogOut,
  Settings,
  PackageCheck
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    cartItemCount,
    cartSubtotal,
    setIsCartDrawerOpen,
    setIsSearchModalOpen,
    setIsAuthModalOpen,
    setAuthModalMode,
    user,
    logout,
    settings,
    restaurantStatus,
    vegOnlyFilter,
    setVegOnlyFilter,
    switchRoleDemo
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const cleanWhatsappNumber = settings.whatsapp_number.replace(/[^0-9]/g, '');

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FCF8F5]/95 backdrop-blur-md border-b border-[#F2DDD0] shadow-xs">
      {/* Top Announcement Bar */}
      {settings.announcement_banner && (
        <div className="bg-gradient-to-r from-[#941B1B] via-[#831414] to-[#A81D1D] text-[#FFF5EE] px-4 py-1.5 text-xs font-medium text-center flex items-center justify-center gap-2 border-b border-[#731212]">
          <Sparkles className="w-3.5 h-3.5 text-[#FBBF24] animate-pulse" />
          <span className="truncate">{settings.announcement_banner}</span>
          <span className="hidden md:inline-block text-[#FBBF24] font-bold underline cursor-pointer ml-1 hover:text-white" onClick={() => { setCurrentView('menu'); }}>
            Order Online
          </span>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-1.5 sm:gap-4">
          
          {/* Brand Logo & Tag */}
          <div 
            onClick={() => { setCurrentView('home'); setIsMobileMenuOpen(false); }}
            className="cursor-pointer group select-none shrink min-w-0"
            id="brand-logo-button"
          >
            <HariLogo size="md" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-[#231815]">
            <button
              onClick={() => setCurrentView('home')}
              className={`transition-colors hover:text-[#EA580C] ${
                currentView === 'home' ? 'text-[#941B1B] font-bold border-b-2 border-[#941B1B] pb-0.5' : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentView('menu')}
              className={`transition-colors hover:text-[#EA580C] ${
                currentView === 'menu' ? 'text-[#941B1B] font-bold border-b-2 border-[#941B1B] pb-0.5' : ''
              }`}
            >
              Menu
            </button>
            <button
              onClick={() => setCurrentView('about')}
              className={`transition-colors hover:text-[#EA580C] ${
                currentView === 'about' ? 'text-[#941B1B] font-bold border-b-2 border-[#941B1B] pb-0.5' : ''
              }`}
            >
              Our Story
            </button>
            <button
              onClick={() => setCurrentView('track-order')}
              className={`transition-colors hover:text-[#EA580C] ${
                currentView === 'track-order' ? 'text-[#941B1B] font-bold border-b-2 border-[#941B1B] pb-0.5' : ''
              }`}
            >
              Track Order
            </button>
            <button
              onClick={() => setCurrentView('contact')}
              className={`transition-colors hover:text-[#EA580C] ${
                currentView === 'contact' ? 'text-[#941B1B] font-bold border-b-2 border-[#941B1B] pb-0.5' : ''
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Action Center (Search, Veg Switch, Cart, User, Hamburger) */}
          <div className="flex items-center gap-1 sm:gap-2.5 shrink-0" id="header-action-buttons">
            
            {/* Live Store Status Pill */}
            <div 
              className={`hidden xl:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                restaurantStatus.isOpen
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${restaurantStatus.isOpen ? 'bg-emerald-600 animate-pulse' : 'bg-amber-500'}`} />
              {restaurantStatus.isOpen ? 'Open For Delivery' : 'Closed for Orders'}
            </div>

            {/* Veg-Only Quick Filter Switch */}
            <button
              onClick={() => setVegOnlyFilter(!vegOnlyFilter)}
              id="veg-toggle-header"
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                vegOnlyFilter 
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-500 shadow-inner' 
                  : 'bg-white text-[#231815] border-[#F2DDD0] hover:border-emerald-600'
              }`}
              title="Filter Vegetarian items only"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 border border-white" />
              <span>Veg Only</span>
            </button>

            {/* Global Search Button */}
            <button
              onClick={() => setIsSearchModalOpen(true)}
              id="header-search-btn"
              className="p-2 sm:p-2.5 rounded-xl text-[#231815] hover:text-[#941B1B] hover:bg-[#FDEEE4] transition-colors shrink-0"
              aria-label="Search dishes"
            >
              <Search className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </button>

            {/* Direct WhatsApp Ordering Hotline Link */}
            <a
              href={`https://wa.me/${cleanWhatsappNumber}?text=Hi%20Hari%20Restaurant%2C%20I%20would%20like%20to%20order%20food`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#25D366]/15 text-[#128C7E] hover:bg-[#25D366]/25 border border-[#25D366]/30 text-xs font-bold transition-colors shrink-0"
              title="Direct WhatsApp Helpline"
            >
              <MessageCircle className="w-4 h-4 text-[#128C7E] fill-current" />
              <span>WhatsApp</span>
            </a>

            {/* Cart Trigger Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              id="header-cart-button"
              className="relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#941B1B] to-[#EA580C] text-white hover:from-[#7C1313] hover:to-[#C2410C] transition-all shadow-md group active:scale-95 shrink-0"
            >
              <ShoppingBag className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-[#FDEEE4] group-hover:scale-110 transition-transform" />
              {cartItemCount > 0 && (
                <span className="font-bold text-xs sm:text-sm hidden sm:inline-block">
                  ₹{cartSubtotal}
                </span>
              )}
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-[#EA580C] text-white text-[10px] sm:text-[11px] font-extrabold flex items-center justify-center shadow-md animate-bounce">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* User Account / Profile Dropdown */}
            <div className="relative shrink-0">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                id="header-user-menu-btn"
                className="flex items-center gap-1 sm:gap-1.5 p-1.5 sm:px-3 sm:py-2 rounded-xl border border-[#F2DDD0] bg-white hover:bg-[#FDEEE4] text-[#231815] transition-colors"
                aria-label="User Account"
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#FDEEE4] flex items-center justify-center text-[#941B1B] font-bold text-xs">
                  {user ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                </div>
                <span className="text-xs font-semibold max-w-[80px] truncate hidden md:inline-block">
                  {user ? user.name : 'Account'}
                </span>
                <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-stone-400 hidden sm:inline-block" />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-2xl border border-[#F2DDD0] p-2 z-50 text-sm animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  {user ? (
                    <>
                      <div className="px-3 py-2.5 border-b border-[#F2DDD0]/60">
                        <p className="font-bold text-[#231815] truncate">{user.name}</p>
                        <p className="text-xs text-stone-500 truncate">{user.email}</p>
                        <span className={`inline-block mt-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-[#EA580C]/15 text-[#941B1B]'
                        }`}>
                          {user.role}
                        </span>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            setCurrentView('account');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#231815] hover:bg-[#FDEEE4]/60 font-medium"
                        >
                          <PackageCheck className="w-4 h-4 text-[#EA580C]" />
                          My Orders & Addresses
                        </button>

                        {user.role === 'admin' && (
                          <button
                            onClick={() => {
                              setCurrentView('admin');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-purple-900 bg-purple-50 hover:bg-purple-100 font-semibold"
                          >
                            <Settings className="w-4 h-4 text-purple-700" />
                            Admin Dashboard
                          </button>
                        )}
                      </div>

                      <div className="pt-1 border-t border-[#F2DDD0]/60 flex flex-col gap-1">
                        {/* Demo Switcher shortcut */}
                        <div className="px-2 py-1 bg-[#FCF8F5] rounded-lg text-[11px] text-stone-600 flex items-center justify-between">
                          <span>Switch Demo Role:</span>
                          <div className="flex gap-1">
                            <button
                              onClick={() => { switchRoleDemo('customer'); setIsUserMenuOpen(false); }}
                              className="px-1.5 py-0.5 rounded bg-white border border-[#F2DDD0] text-[#231815] font-semibold hover:bg-stone-100"
                            >
                              Customer
                            </button>
                            <button
                              onClick={() => { switchRoleDemo('admin'); setIsUserMenuOpen(false); }}
                              className="px-1.5 py-0.5 rounded bg-purple-600 text-white font-semibold hover:bg-purple-700"
                            >
                              Admin
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-700 hover:bg-rose-50 font-medium"
                        >
                          <LogOut className="w-4 h-4" />
                          Log Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-2 space-y-2">
                      <p className="text-xs text-stone-500 px-1">Welcome to Hari Restaurant</p>
                      <button
                        onClick={() => {
                          setAuthModalMode('login');
                          setIsAuthModalOpen(true);
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-[#941B1B] text-white font-bold text-xs hover:bg-[#781212]"
                      >
                        Sign In / Log In
                      </button>
                      <button
                        onClick={() => {
                          setAuthModalMode('register');
                          setIsAuthModalOpen(true);
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full py-2 px-3 rounded-xl border border-[#F2DDD0] text-[#231815] bg-white font-semibold text-xs hover:bg-[#FDEEE4]"
                      >
                        Create New Account
                      </button>
                      <div className="pt-2 border-t border-[#F2DDD0]/60 flex gap-2">
                        <button
                          onClick={() => { switchRoleDemo('customer'); setIsUserMenuOpen(false); }}
                          className="flex-1 py-1 text-[11px] font-semibold rounded bg-[#FDEEE4] hover:bg-[#FCE3D2] text-[#941B1B]"
                        >
                          Customer Demo
                        </button>
                        <button
                          onClick={() => { switchRoleDemo('admin'); setIsUserMenuOpen(false); }}
                          className="flex-1 py-1 text-[11px] font-semibold rounded bg-purple-100 hover:bg-purple-200 text-purple-900"
                        >
                          Admin Demo
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Hamburger (3-bar button) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              id="mobile-menu-hamburger"
              className="lg:hidden p-2 rounded-xl text-[#231815] hover:bg-[#FDEEE4] active:bg-[#FCE3D2] transition-colors shrink-0 flex items-center justify-center border border-[#F2DDD0] sm:border-transparent bg-white sm:bg-transparent"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6 text-[#941B1B]" /> : <MenuIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#941B1B]" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#F2DDD0] px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-[#F2DDD0]">
            <button
              onClick={() => { setCurrentView('home'); setIsMobileMenuOpen(false); }}
              className={`p-3 rounded-xl text-center font-bold text-sm ${
                currentView === 'home' ? 'bg-gradient-to-r from-[#941B1B] to-[#EA580C] text-white shadow-xs' : 'bg-white border border-[#F2DDD0] text-[#231815]'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => { setCurrentView('menu'); setIsMobileMenuOpen(false); }}
              className={`p-3 rounded-xl text-center font-bold text-sm ${
                currentView === 'menu' ? 'bg-gradient-to-r from-[#941B1B] to-[#EA580C] text-white shadow-xs' : 'bg-white border border-[#F2DDD0] text-[#231815]'
              }`}
            >
              Explore Menu
            </button>
            <button
              onClick={() => { setCurrentView('track-order'); setIsMobileMenuOpen(false); }}
              className={`p-3 rounded-xl text-center font-bold text-sm ${
                currentView === 'track-order' ? 'bg-gradient-to-r from-[#941B1B] to-[#EA580C] text-white shadow-xs' : 'bg-white border border-[#F2DDD0] text-[#231815]'
              }`}
            >
              Track Order
            </button>
            <button
              onClick={() => { setCurrentView('account'); setIsMobileMenuOpen(false); }}
              className={`p-3 rounded-xl text-center font-bold text-sm ${
                currentView === 'account' ? 'bg-gradient-to-r from-[#941B1B] to-[#EA580C] text-white shadow-xs' : 'bg-white border border-[#F2DDD0] text-[#231815]'
              }`}
            >
              My Account
            </button>
          </div>

          <div className="flex items-center justify-between pt-1 text-xs text-[#231815]/80">
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-[#EA580C]" />
              {settings.phone}
            </span>
            <span className="flex items-center gap-1 font-semibold text-emerald-800">
              <Clock className="w-3.5 h-3.5" />
              {settings.open_time} - {settings.close_time}
            </span>
          </div>

          {user?.role === 'admin' && (
            <button
              onClick={() => { setCurrentView('admin'); setIsMobileMenuOpen(false); }}
              className="w-full py-2.5 px-4 rounded-xl bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Open Admin Control Panel
            </button>
          )}
        </div>
      )}
    </header>
  );
};
