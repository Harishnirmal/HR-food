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
    <header className="sticky top-0 z-40 w-full bg-[#F8F3E8]/95 backdrop-blur-md border-b border-[#E9DDC7] shadow-xs">
      {/* Top Announcement Bar */}
      {settings.announcement_banner && (
        <div className="bg-[#183A32] text-[#F8F3E8] px-4 py-1.5 text-xs font-medium text-center flex items-center justify-center gap-2 border-b border-[#234F45]">
          <Sparkles className="w-3.5 h-3.5 text-[#C49A52] animate-pulse" />
          <span className="truncate">{settings.announcement_banner}</span>
          <span className="hidden md:inline-block text-[#C49A52] font-semibold underline cursor-pointer ml-1" onClick={() => { setCurrentView('menu'); }}>
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
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-[#24221F]">
            <button
              onClick={() => setCurrentView('home')}
              className={`transition-colors hover:text-[#B85C38] ${
                currentView === 'home' ? 'text-[#B85C38] font-bold border-b-2 border-[#B85C38] pb-0.5' : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentView('menu')}
              className={`transition-colors hover:text-[#B85C38] ${
                currentView === 'menu' ? 'text-[#B85C38] font-bold border-b-2 border-[#B85C38] pb-0.5' : ''
              }`}
            >
              Menu
            </button>
            <button
              onClick={() => setCurrentView('about')}
              className={`transition-colors hover:text-[#B85C38] ${
                currentView === 'about' ? 'text-[#B85C38] font-bold border-b-2 border-[#B85C38] pb-0.5' : ''
              }`}
            >
              Our Story
            </button>
            <button
              onClick={() => setCurrentView('track-order')}
              className={`transition-colors hover:text-[#B85C38] ${
                currentView === 'track-order' ? 'text-[#B85C38] font-bold border-b-2 border-[#B85C38] pb-0.5' : ''
              }`}
            >
              Track Order
            </button>
            <button
              onClick={() => setCurrentView('contact')}
              className={`transition-colors hover:text-[#B85C38] ${
                currentView === 'contact' ? 'text-[#B85C38] font-bold border-b-2 border-[#B85C38] pb-0.5' : ''
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
                  ? 'bg-[#3F7D58]/10 text-[#3F7D58] border-[#3F7D58]/30'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${restaurantStatus.isOpen ? 'bg-[#3F7D58] animate-pulse' : 'bg-amber-500'}`} />
              {restaurantStatus.isOpen ? 'Open For Delivery' : 'Closed for Orders'}
            </div>

            {/* Veg-Only Quick Filter Switch */}
            <button
              onClick={() => setVegOnlyFilter(!vegOnlyFilter)}
              id="veg-toggle-header"
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                vegOnlyFilter 
                  ? 'bg-[#3F7D58]/15 text-[#183A32] border-[#3F7D58] shadow-inner' 
                  : 'bg-[#FFFDF8] text-[#24221F] border-[#E9DDC7] hover:border-[#3F7D58]'
              }`}
              title="Filter Vegetarian items only"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#3F7D58] border border-white" />
              <span>Veg Only</span>
            </button>

            {/* Global Search Button */}
            <button
              onClick={() => setIsSearchModalOpen(true)}
              id="header-search-btn"
              className="p-2 sm:p-2.5 rounded-xl text-[#24221F] hover:text-[#183A32] hover:bg-[#E9DDC7] transition-colors shrink-0"
              aria-label="Search dishes"
            >
              <Search className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </button>

            {/* Direct WhatsApp Ordering Hotline Link */}
            <a
              href={`https://wa.me/${cleanWhatsappNumber}?text=Hi%20Hari%20Restaurant%2C%20I%20would%20like%20to%20order%20food`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#3F7D58]/15 text-[#183A32] hover:bg-[#3F7D58]/25 border border-[#3F7D58]/30 text-xs font-bold transition-colors shrink-0"
              title="Direct WhatsApp Helpline"
            >
              <MessageCircle className="w-4 h-4 text-[#3F7D58] fill-current" />
              <span>WhatsApp</span>
            </a>

            {/* Cart Trigger Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              id="header-cart-button"
              className="relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#183A32] text-white hover:bg-[#112923] transition-all shadow-sm group active:scale-95 shrink-0"
            >
              <ShoppingBag className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-[#C49A52] group-hover:scale-110 transition-transform" />
              {cartItemCount > 0 && (
                <span className="font-bold text-xs sm:text-sm hidden sm:inline-block">
                  ₹{cartSubtotal}
                </span>
              )}
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-[#B85C38] text-white text-[10px] sm:text-[11px] font-extrabold flex items-center justify-center shadow-md animate-bounce">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* User Account / Profile Dropdown */}
            <div className="relative shrink-0">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                id="header-user-menu-btn"
                className="flex items-center gap-1 sm:gap-1.5 p-1.5 sm:px-3 sm:py-2 rounded-xl border border-[#E9DDC7] bg-[#FFFDF8] hover:bg-[#E9DDC7] text-[#24221F] transition-colors"
                aria-label="User Account"
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#E9DDC7] flex items-center justify-center text-[#B85C38] font-bold text-xs">
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
                  className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#FFFDF8] shadow-2xl border border-[#E9DDC7] p-2 z-50 text-sm animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  {user ? (
                    <>
                      <div className="px-3 py-2.5 border-b border-[#E9DDC7]/60">
                        <p className="font-bold text-[#24221F] truncate">{user.name}</p>
                        <p className="text-xs text-stone-500 truncate">{user.email}</p>
                        <span className={`inline-block mt-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-[#3F7D58]/15 text-[#183A32]'
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
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[#24221F] hover:bg-[#E9DDC7]/50 font-medium"
                        >
                          <PackageCheck className="w-4 h-4 text-[#B85C38]" />
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

                      <div className="pt-1 border-t border-[#E9DDC7]/60 flex flex-col gap-1">
                        {/* Demo Switcher shortcut */}
                        <div className="px-2 py-1 bg-[#F8F3E8] rounded-lg text-[11px] text-stone-600 flex items-center justify-between">
                          <span>Switch Demo Role:</span>
                          <div className="flex gap-1">
                            <button
                              onClick={() => { switchRoleDemo('customer'); setIsUserMenuOpen(false); }}
                              className="px-1.5 py-0.5 rounded bg-[#FFFDF8] border border-[#E9DDC7] text-[#24221F] font-semibold hover:bg-stone-100"
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
                        className="w-full py-2 px-3 rounded-xl bg-[#183A32] text-white font-bold text-xs hover:bg-[#112923]"
                      >
                        Sign In / Log In
                      </button>
                      <button
                        onClick={() => {
                          setAuthModalMode('register');
                          setIsAuthModalOpen(true);
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full py-2 px-3 rounded-xl border border-[#E9DDC7] text-[#24221F] bg-[#FFFDF8] font-semibold text-xs hover:bg-[#E9DDC7]"
                      >
                        Create New Account
                      </button>
                      <div className="pt-2 border-t border-[#E9DDC7]/60 flex gap-2">
                        <button
                          onClick={() => { switchRoleDemo('customer'); setIsUserMenuOpen(false); }}
                          className="flex-1 py-1 text-[11px] font-semibold rounded bg-[#E9DDC7]/60 hover:bg-[#E9DDC7] text-[#24221F]"
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
              className="lg:hidden p-2 rounded-xl text-[#24221F] hover:bg-[#E9DDC7] active:bg-[#E9DDC7]/80 transition-colors shrink-0 flex items-center justify-center border border-[#E9DDC7] sm:border-transparent bg-[#FFFDF8] sm:bg-transparent"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6 text-[#183A32]" /> : <MenuIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#183A32]" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#FFFDF8] border-b border-[#E9DDC7] px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-[#E9DDC7]">
            <button
              onClick={() => { setCurrentView('home'); setIsMobileMenuOpen(false); }}
              className={`p-3 rounded-xl text-center font-bold text-sm ${
                currentView === 'home' ? 'bg-[#183A32] text-white' : 'bg-[#FFFDF8] border border-[#E9DDC7] text-[#24221F]'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => { setCurrentView('menu'); setIsMobileMenuOpen(false); }}
              className={`p-3 rounded-xl text-center font-bold text-sm ${
                currentView === 'menu' ? 'bg-[#183A32] text-white' : 'bg-[#FFFDF8] border border-[#E9DDC7] text-[#24221F]'
              }`}
            >
              Explore Menu
            </button>
            <button
              onClick={() => { setCurrentView('track-order'); setIsMobileMenuOpen(false); }}
              className={`p-3 rounded-xl text-center font-bold text-sm ${
                currentView === 'track-order' ? 'bg-[#183A32] text-white' : 'bg-[#FFFDF8] border border-[#E9DDC7] text-[#24221F]'
              }`}
            >
              Track Order
            </button>
            <button
              onClick={() => { setCurrentView('account'); setIsMobileMenuOpen(false); }}
              className={`p-3 rounded-xl text-center font-bold text-sm ${
                currentView === 'account' ? 'bg-[#183A32] text-white' : 'bg-[#FFFDF8] border border-[#E9DDC7] text-[#24221F]'
              }`}
            >
              My Account
            </button>
          </div>

          <div className="flex items-center justify-between pt-1 text-xs text-[#24221F]/80">
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-[#B85C38]" />
              {settings.phone}
            </span>
            <span className="flex items-center gap-1 font-semibold text-[#3F7D58]">
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
