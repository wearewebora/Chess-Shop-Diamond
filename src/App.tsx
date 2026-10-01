import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { BackendHubModal } from './components/BackendHubModal';
import { SmsDispatchBanner } from './components/SmsDispatchBanner';

import { ChessWallpaperBackground } from './components/ChessWallpaperBackground';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderStatusPage } from './pages/OrderStatusPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ContactPage } from './pages/ContactPage';

const AppContent: React.FC = () => {
  const { currentView } = useApp();

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentView]);

  return (
    <div className="min-h-screen flex flex-col font-sans text-[#edeae4] antialiased selection:bg-[#81b64c] selection:text-white relative">
      {/* Dynamic Fullscreen Chess Wallpaper & Ambient Effects */}
      <ChessWallpaperBackground />

      <Navbar />

      <main className="flex-1 relative z-10">
        {currentView === 'home' && <HomePage />}
        {currentView === 'about' && <AboutPage />}
        {currentView === 'services' && <ServicesPage />}
        {currentView === 'checkout' && <CheckoutPage />}
        {currentView === 'order-status' && <OrderStatusPage />}
        {currentView === 'admin' && <AdminDashboardPage />}
        {currentView === 'contact' && <ContactPage />}
      </main>

      <Footer />

      {/* Global Modals & Live SMS Dispatch Alert */}
      <SmsDispatchBanner />
      <AuthModal />
      <BackendHubModal />
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
