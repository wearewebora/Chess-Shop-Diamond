import React from 'react';
import { 
  ExternalLink, Mail, ShieldCheck, Zap, 
  CheckCircle2, CreditCard, Lock, Sparkles 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { setCurrentView, settings, setIsBackendHubOpen, plans, startCheckout } = useApp();

  return (
    <footer className="bg-[#171614] border-t border-[#38332d] text-stone-400 font-sans text-xs">
      {/* Guarantees Ribbon */}
      <div className="border-b border-[#38332d] bg-[#1e1d1a]/80 py-8 px-4 sm:px-6 lg:px-8 backdrop-blur-md">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#81b64c]/15 border border-[#81b64c]/30 flex items-center justify-center text-[#81b64c] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs">100% Safe & Guaranteed</h4>
              <p className="text-[11px] text-stone-400 mt-0.5">No passwords required. Only your Chess.com username.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#81b64c]/15 border border-[#81b64c]/30 flex items-center justify-center text-[#81b64c] shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs">Fast Digital Delivery</h4>
              <p className="text-[11px] text-stone-400 mt-0.5">Instant voucher code generation & direct account credit.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#81b64c]/15 border border-[#81b64c]/30 flex items-center justify-center text-[#81b64c] shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs">Secure PayPal Checkout</h4>
              <p className="text-[11px] text-stone-400 mt-0.5">Buyer protection and verified PayPal.me payment processing.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#81b64c]/15 border border-[#81b64c]/30 flex items-center justify-center text-[#81b64c] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs">Official Diamond Benefits</h4>
              <p className="text-[11px] text-stone-400 mt-0.5">Full access to Game Review, Coach, Puzzles & GM Lessons.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#81b64c] flex items-center justify-center text-white shadow-md shadow-[#81b64c]/30">
                <span className="text-base">💎</span>
              </div>
              <span className="text-lg font-black font-cinzel text-white tracking-tight">
                CHESS SHOP
              </span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed max-w-sm">
              The premier online merchant for Chess.com Diamond Memberships. We deliver authentic digital voucher keys and direct account upgrades at unbeatable rates for chess players worldwide.
            </p>
            <div className="pt-2 text-[11px] text-stone-400">
              <p>Official Verification Reference:</p>
              <a 
                href={settings.official_chess_url} 
                target="_blank" 
                rel="noreferrer"
                className="text-[#81b64c] hover:text-[#a3d969] font-semibold inline-flex items-center gap-1 mt-0.5 underline"
              >
                https://www.chess.com/membership?c=navbar <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Navigation & Pages */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Pages</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => setCurrentView('home')} 
                  className="hover:text-white transition cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('services')} 
                  className="hover:text-white transition cursor-pointer"
                >
                  Products & Services
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('about')} 
                  className="hover:text-white transition cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('contact')} 
                  className="hover:text-white transition cursor-pointer"
                >
                  Contact & Support
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    const plan = plans.find(p => p.id === 'diamond-1-year') || plans[0];
                    startCheckout(plan);
                  }} 
                  className="hover:text-white transition text-[#81b64c] font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <span>1-Year Pass</span>
                  <span className="text-[10px] bg-[#81b64c]/20 text-[#81b64c] px-1 py-0.5 rounded border border-[#81b64c]/30">50% Off</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Self-Service */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Features & Lookup</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => {
                    setCurrentView('home');
                    setTimeout(() => {
                      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }} 
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  9 Unlimited Perks
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setCurrentView('home');
                    setTimeout(() => {
                      document.getElementById('comparison')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }} 
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  Feature Comparison
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('order-status')} className="hover:text-white transition cursor-pointer text-left">
                  Track Order & Voucher
                </button>
              </li>
              <li>
                <button onClick={() => setIsBackendHubOpen(true)} className="hover:text-white transition cursor-pointer text-left">
                  Google Sheets Hub
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('admin')} 
                  className="hover:text-[#81b64c] transition cursor-pointer text-left flex items-center gap-1.5 text-stone-400"
                >
                  <span>Admin Desk</span>
                  <span className="text-[10px] font-mono text-[#81b64c] bg-[#81b64c]/15 px-1.5 py-0.5 rounded border border-[#81b64c]/30">/wearewebora/admin</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Official Support</h4>
            <p className="text-xs text-stone-300">
              Have a question regarding your Chess.com username or PayPal transaction? Reach our dedicated concierge:
            </p>
            <div className="p-3 bg-[#1e1d1a] rounded-xl border border-[#38332d] text-xs">
              <div className="flex items-center gap-2 text-stone-200">
                <Mail className="w-4 h-4 text-[#81b64c]" />
                <span className="font-bold text-white select-all">{settings.support_email}</span>
              </div>
              <p className="text-[10px] text-stone-400 mt-1">Average reply time: under 24 hours during peak hours</p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-[#38332d] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-400">
          <p>© {new Date().getFullYear()} Chess Shop. All rights reserved.</p>
          <p className="text-[10px] text-stone-500 max-w-lg text-center sm:text-right">
            Chess Shop is an independent merchant providing Chess.com membership gift vouchers and services. Chess.com is a registered trademark of Chess.com, LLC.
          </p>
        </div>
      </div>
    </footer>
  );
};
