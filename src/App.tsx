import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomeView } from './components/home/HomeView';
import { MenuView } from './components/menu/MenuView';
import { AboutView } from './components/about/AboutView';
import { TrackOrderView } from './components/order/TrackOrderView';
import { CustomerAccountView } from './components/account/CustomerAccountView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { SearchModal } from './components/common/SearchModal';
import { Toast } from './components/common/Toast';
import { CartDrawer } from './components/cart/CartDrawer';
import { MobileStickyCart } from './components/cart/MobileStickyCart';
import { FoodDetailsModal } from './components/menu/FoodDetailsModal';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { OrderConfirmationModal } from './components/order/OrderConfirmationModal';
import { AuthModal } from './components/auth/AuthModal';

const AppContent: React.FC = () => {
  const { currentView } = useApp();

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFAF6] text-[#2D241E] font-sans antialiased selection:bg-[#E6C687] selection:text-[#183928]">
      {/* Toast Notifications */}
      <Toast />

      {/* Global Navigation Header */}
      <Header />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && <HomeView />}
        {currentView === 'menu' && <MenuView />}
        {currentView === 'about' && <AboutView />}
        {currentView === 'track-order' && <TrackOrderView />}
        {currentView === 'account' && <CustomerAccountView />}
        {currentView === 'admin' && <AdminDashboard />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Overlays & Modals */}
      <SearchModal />
      <CartDrawer />
      <MobileStickyCart />
      <FoodDetailsModal />
      <CheckoutModal />
      <OrderConfirmationModal />
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
