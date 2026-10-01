import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Shield, User as UserIcon, LogOut, 
  ExternalLink, CheckCircle, Search, ArrowRight, Lock, KeyRound,
  Menu, X, Crown, Info, MessageSquare, BookOpen, Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const { 
    user, 
    logout, 
    openAuthModal, 
    quickLogin, 
    currentView, 
    setCurrentView, 
    settings, 
    plans,
    startCheckout,
    setIsBackendHubOpen,
    ownerConfig,
    isOwnerAuthenticated,
    logoutOwner
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close mobile menu when view changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentView]);

  const goToPayment = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setMobileMenuOpen(false);
    const popularPlan = plans.find(p => p.popular) || plans[0];
    startCheckout(popularPlan);
  };

  const handleLogoClick = () => {
    if (currentView !== 'home') {
      setCurrentView('home');
      setTimeout(() => {
        const heroSection = document.getElementById('hero-section');
        if (heroSection) {
          heroSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 60);
    } else {
      const heroSection = document.getElementById('hero-section');
      if (heroSection) {
        heroSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#22201d]/95 backdrop-blur-md border-b border-[#3d3731] text-[#edeae4]">
      {/* Top Banner announcing Official Chess.com Diamond Memberships & US Citizen Exclusivity */}
      <div className="bg-[#2a2112]/95 border-b border-[#6e511b]/50 text-[#f3dba1] text-[11px] py-1.5 px-4 text-center flex items-center justify-center gap-2 font-medium">
        <span className="inline-flex items-center gap-1 font-bold text-[#f5e1b2] bg-[#3d2e16] px-2 py-0.5 rounded border border-[#8a6520]/60">
          <span>🇺🇸</span>
          <span>US CITIZENS EXCLUSIVE</span>
        </span>
        <span className="hidden sm:inline">
          This membership is exclusively available to US citizens. Citizens of other countries are not eligible to activate this membership.
        </span>
        <span className="sm:hidden">
          Exclusively available to US citizens only. Non-US citizens are not eligible.
        </span>
      </div>

      <div className="bg-[#181715] border-b border-[#36322d] text-[#ebecd0] text-[11px] py-1.5 px-4 text-center flex items-center justify-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-[#81b64c] animate-pulse"></span>
        <span className="font-semibold">
          Official 1-Year Diamond Pass ($60 total • Save 50%)
        </span>
        <a 
          href={settings.official_chess_url} 
          target="_blank" 
          rel="noreferrer"
          className="hidden md:inline-flex items-center gap-1 text-[#81b64c] font-bold underline hover:text-[#a2dc66] transition ml-1"
        >
          Verify on Chess.com <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <div 
            onClick={handleLogoClick}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleLogoClick();
              }
            }}
            role="button"
            tabIndex={0}
            title="Go to top section area"
            aria-label="Go to top section area"
            className="flex items-center gap-3.5 cursor-pointer group select-none transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#81b64c] rounded-xl py-2 px-2.5 -my-1 -mx-2 hover:bg-white/[0.04]"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#81b64c] to-[#587738] flex items-center justify-center shadow-lg shadow-[#81b64c]/20 group-hover:scale-105 transition border border-[#81b64c]/30 shrink-0">
              <span className="text-xl">💎</span>
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex flex-col">
                <span className="block text-base sm:text-lg font-black font-cinzel tracking-tight text-white leading-none pt-1 pb-1">
                  CHESS
                </span>
                <div className="flex items-baseline gap-2 leading-none">
                  <span className="text-base sm:text-lg font-black font-cinzel tracking-tight text-white group-hover:text-stone-100 transition">
                    SHOP
                  </span>
                  <span className="relative inline-flex items-center">
                    <span 
                      className="diamond-text-animate text-xs sm:text-sm font-bold font-cinzel tracking-wider uppercase select-none pointer-events-none"
                    >
                      DIAMOND
                    </span>
                    <span 
                      className="absolute -top-1 -right-2 text-[10px] text-[#e8ffb5] animate-diamond-sparkle select-none pointer-events-none"
                      aria-hidden="true"
                    >
                      ✦
                    </span>
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-stone-400 -mt-1 -mb-[14px] pb-[17px] font-sans tracking-wide whitespace-nowrap leading-tight">
                Official Chess.com Memberships
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-stone-300">
            <button
              onClick={goToPayment}
              title="Go to payment area (1-Year Diamond Pass)"
              aria-label="Go to payment area (1-Year Diamond Pass)"
              className="hover:text-[#81b64c] transition-all duration-200 flex items-center gap-1 px-2 py-1.5 rounded-lg active:scale-95 cursor-pointer hover:bg-white/5 text-stone-300 focus:outline-none select-none"
            >
              1-Year Diamond Pass
            </button>
            <button
              onClick={() => {
                if (currentView !== 'home') {
                  setCurrentView('home');
                  setTimeout(() => {
                    const el = document.getElementById('features');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }, 80);
                } else {
                  const el = document.getElementById('features');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }
              }}
              title="Go to Diamond Features area"
              aria-label="Go to Diamond Features area"
              className="hover:text-[#81b64c] transition-all duration-200 flex items-center gap-1 px-2 py-1.5 rounded-lg active:scale-95 cursor-pointer hover:bg-white/5 text-stone-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#81b64c]"
            >
              Diamond Features
            </button>
            <button
              onClick={() => setCurrentView('services')}
              className={`hover:text-[#81b64c] transition-all duration-200 px-2 py-1.5 rounded-lg cursor-pointer ${
                currentView === 'services' ? 'text-[#81b64c] font-bold bg-[#81b64c]/15 border border-[#81b64c]/40' : 'hover:bg-white/5 text-stone-300'
              }`}
            >
              Services & Products
            </button>
            <button
              onClick={() => setCurrentView('about')}
              className={`hover:text-[#81b64c] transition-all duration-200 px-2 py-1.5 rounded-lg cursor-pointer ${
                currentView === 'about' ? 'text-[#81b64c] font-bold bg-[#81b64c]/15 border border-[#81b64c]/40' : 'hover:bg-white/5 text-stone-300'
              }`}
            >
              About
            </button>
            <button
              onClick={() => setCurrentView('order-status')}
              className={`hover:text-[#81b64c] transition flex items-center gap-1 px-2 py-1.5 rounded-lg ${currentView === 'order-status' ? 'text-[#81b64c] font-bold bg-[#81b64c]/15 border border-[#81b64c]/40' : 'hover:bg-white/5 text-stone-300'}`}
            >
              <Search className="w-3 h-3 text-[#81b64c]" />
              Lookup Order
            </button>
            <button
              onClick={() => setCurrentView('contact')}
              className={`hover:text-[#81b64c] transition pl-2 pr-2 pt-[6px] ml-0 mr-2 pb-1.5 rounded-lg ${currentView === 'contact' ? 'text-[#81b64c] font-bold bg-[#81b64c]/15 border border-[#81b64c]/40' : 'hover:bg-white/5 text-stone-300'}`}
            >
              Contact
            </button>
          </nav>

          {/* Right Action Buttons & Mobile Hamburger Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Owner Access & Admin Desk (Restricted solely to verified owner) */}
            {isOwnerAuthenticated ? (
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentView('admin')}
                  className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border shadow-sm ${
                    currentView === 'admin'
                      ? 'bg-gradient-to-r from-[#c99738] to-[#9b7226] text-white border-[#f5d997]'
                      : 'bg-[#332610] text-[#f5d997] border-[#8a6520] hover:bg-[#453315]'
                  }`}
                  title="Owner Admin Desk (Verified Session)"
                >
                  <Shield className="w-3.5 h-3.5 text-[#f5d997]" />
                  <span>Admin Desk</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/50 text-[#b2f073] font-mono font-bold">
                    Owner
                  </span>
                </button>
                <button
                  onClick={logoutOwner}
                  className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl bg-stone-900 border border-stone-800 text-stone-400 hover:text-rose-400 hover:border-rose-900 transition"
                  title="Lock & Log Out"
                >
                  <Lock className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentView('admin')}
                className={`hidden md:flex min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-bold transition items-center gap-1.5 border ${
                  currentView === 'admin'
                    ? 'bg-[#c99738] text-white border-[#f5d997]'
                    : 'bg-[#221f1a] text-stone-300 border-[#423b32] hover:bg-[#2e2923] hover:text-[#f5d997]'
                }`}
                title="Owner Administration Portal"
              >
                <Lock className="w-3.5 h-3.5 text-[#c99738]" />
                <span>Admin Login</span>
              </button>
            )}

            {/* Buy Diamond Pass Primary Button */}
            <button
              onClick={() => {
                const popularPlan = plans.find(p => p.popular) || plans[0];
                startCheckout(popularPlan);
              }}
              className="min-h-[42px] px-3 sm:px-4 py-2 bg-gradient-to-r from-[#81b64c] to-[#67913d] hover:from-[#8ec853] hover:to-[#74a145] text-white text-xs font-black rounded-xl shadow-lg shadow-[#81b64c]/25 transition flex items-center gap-1.5 group border border-[#81b64c]/40 active:scale-95 cursor-pointer shrink-0"
            >
              <span className="hidden xs:inline">Get 1-Year Pass</span>
              <span className="xs:hidden">Pass $60</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
            </button>

            {/* Mobile / Tablet Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden min-w-[44px] min-h-[44px] p-2.5 rounded-xl bg-[#221f1a] text-stone-200 border border-[#3d3731] hover:text-[#81b64c] hover:border-[#81b64c]/50 transition flex items-center justify-center cursor-pointer active:scale-95"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-[#81b64c]" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Hamburger Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#38332d] bg-[#1a1815]/98 backdrop-blur-xl px-4 py-4 space-y-4 shadow-2xl animate-in slide-in-from-top-2 duration-200 max-h-[calc(100vh-100px)] overflow-y-auto">
          <div className="grid grid-cols-1 gap-1 text-xs font-semibold">
            <button
              onClick={() => {
                setCurrentView('home');
                setMobileMenuOpen(false);
              }}
              className={`w-full min-h-[44px] px-3.5 py-2 rounded-xl text-left flex items-center gap-3 transition ${
                currentView === 'home' 
                  ? 'bg-[#81b64c]/20 text-[#81b64c] font-bold border border-[#81b64c]/40' 
                  : 'text-stone-200 hover:bg-white/5'
              }`}
            >
              <span className="text-base">🏠</span>
              <span>Home</span>
            </button>

            <button
              onClick={() => {
                setCurrentView('services');
                setMobileMenuOpen(false);
              }}
              className={`w-full min-h-[44px] px-3.5 py-2 rounded-xl text-left flex items-center gap-3 transition ${
                currentView === 'services' 
                  ? 'bg-[#81b64c]/20 text-[#81b64c] font-bold border border-[#81b64c]/40' 
                  : 'text-stone-200 hover:bg-white/5'
              }`}
            >
              <Crown className="w-4 h-4 text-[#81b64c]" />
              <span>Products & Services</span>
            </button>

            <button
              onClick={() => {
                setCurrentView('about');
                setMobileMenuOpen(false);
              }}
              className={`w-full min-h-[44px] px-3.5 py-2 rounded-xl text-left flex items-center gap-3 transition ${
                currentView === 'about' 
                  ? 'bg-[#81b64c]/20 text-[#81b64c] font-bold border border-[#81b64c]/40' 
                  : 'text-stone-200 hover:bg-white/5'
              }`}
            >
              <Info className="w-4 h-4 text-[#81b64c]" />
              <span>About Us</span>
            </button>

            <button
              onClick={() => {
                if (currentView !== 'home') {
                  setCurrentView('home');
                  setTimeout(() => {
                    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 80);
                } else {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                setMobileMenuOpen(false);
              }}
              className="w-full min-h-[44px] px-3.5 py-2 rounded-xl text-left flex items-center gap-3 text-stone-200 hover:bg-white/5 transition"
            >
              <Sparkles className="w-4 h-4 text-[#81b64c]" />
              <span>Diamond Features (9 Perks)</span>
            </button>

            <button
              onClick={() => {
                if (currentView !== 'home') {
                  setCurrentView('home');
                  setTimeout(() => {
                    document.getElementById('comparison')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 80);
                } else {
                  document.getElementById('comparison')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                setMobileMenuOpen(false);
              }}
              className="w-full min-h-[44px] px-3.5 py-2 rounded-xl text-left flex items-center gap-3 text-stone-200 hover:bg-white/5 transition"
            >
              <Layers className="w-4 h-4 text-[#81b64c]" />
              <span>Why Diamond? (Comparison Table)</span>
            </button>

            <button
              onClick={() => {
                setCurrentView('order-status');
                setMobileMenuOpen(false);
              }}
              className={`w-full min-h-[44px] px-3.5 py-2 rounded-xl text-left flex items-center gap-3 transition ${
                currentView === 'order-status' 
                  ? 'bg-[#81b64c]/20 text-[#81b64c] font-bold border border-[#81b64c]/40' 
                  : 'text-stone-200 hover:bg-white/5'
              }`}
            >
              <Search className="w-4 h-4 text-[#81b64c]" />
              <span>Lookup Order Status</span>
            </button>

            <button
              onClick={() => {
                setCurrentView('contact');
                setMobileMenuOpen(false);
              }}
              className={`w-full min-h-[44px] px-3.5 py-2 rounded-xl text-left flex items-center gap-3 transition ${
                currentView === 'contact' 
                  ? 'bg-[#81b64c]/20 text-[#81b64c] font-bold border border-[#81b64c]/40' 
                  : 'text-stone-200 hover:bg-white/5'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-[#81b64c]" />
              <span>Contact & Support</span>
            </button>

            <button
              onClick={() => {
                setCurrentView('admin');
                setMobileMenuOpen(false);
              }}
              className={`w-full min-h-[44px] px-3.5 py-2 rounded-xl text-left flex items-center gap-3 transition ${
                currentView === 'admin' 
                  ? 'bg-[#c99738]/20 text-[#f5d997] font-bold border border-[#c99738]/40' 
                  : 'text-stone-300 hover:bg-white/5'
              }`}
            >
              <Lock className="w-4 h-4 text-[#c99738]" />
              <span>{isOwnerAuthenticated ? 'Admin Desk (Logged In)' : 'Admin Portal Login'}</span>
            </button>
          </div>

          {/* Mobile CTA */}
          <div className="pt-3 border-t border-[#38332d] space-y-2">
            <button
              onClick={goToPayment}
              className="w-full min-h-[48px] py-3 px-4 bg-gradient-to-r from-[#81b64c] to-[#67913d] hover:from-[#8ec853] text-white font-black text-sm rounded-xl shadow-lg shadow-[#81b64c]/25 flex items-center justify-center gap-2 border border-[#81b64c]/40"
            >
              <span>Get 1-Year Pass ($60)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-[11px] text-center text-stone-400">
              Exclusively available to US citizens • Zero passwords needed
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
