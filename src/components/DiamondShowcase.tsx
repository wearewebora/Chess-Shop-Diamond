import React, { useState } from 'react';
import { 
  Check, Info, Sparkles, ExternalLink, ArrowRight, 
  Puzzle, GraduationCap, Bot, User, MegaphoneOff, 
  Star, BarChart2, BookOpen, ShieldCheck, X 
} from 'lucide-react';
import { OFFICIAL_DIAMOND_FEATURES, OfficialDiamondFeature } from '../data/chessData';
import { useApp } from '../context/AppContext';
import { DiamondPlan } from '../types';

export const DiamondShowcase: React.FC = () => {
  const { plans, startCheckout, settings } = useApp();
  const [activeTooltip, setActiveTooltip] = useState<OfficialDiamondFeature | null>(null);

  const currentPlan = plans[0] || {
    id: 'diamond-1-year',
    name: '1 Year Diamond Membership',
    duration_label: '12 Months Unlimited Access',
    duration_months: 12,
    price: 60,
    original_price: 203.88,
    savings_percent: 50,
    popular: true,
    badge: 'MOST POPULAR',
    tagline: 'Get full access for only $5/mo* (Save 50% vs regular monthly rate)',
    features: [],
    deliverable: 'Official Chess.com 1-Year Voucher Code + Instant Activation'
  };

  // Helper to render icon for each feature matching m2.jpg
  const renderFeatureIcon = (feature: OfficialDiamondFeature) => {
    switch (feature.icon_type) {
      case 'puzzles':
        return (
          <div className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center shrink-0 shadow-xs">
            <Puzzle className="w-4 h-4 fill-orange-400/20" />
          </div>
        );
      case 'lessons':
        return (
          <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-400 flex items-center justify-center shrink-0 shadow-xs">
            <GraduationCap className="w-4 h-4 fill-sky-400/20" />
          </div>
        );
      case 'bots':
        return (
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-400 flex items-center justify-center shrink-0 shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
        );
      case 'coach':
        return (
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center shrink-0 shadow-xs">
            <User className="w-4 h-4 fill-amber-300/20" />
          </div>
        );
      case 'no_ads':
        return (
          <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0 shadow-xs">
            <MegaphoneOff className="w-4 h-4" />
          </div>
        );
      case 'game_review':
        return (
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 shadow-xs">
            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 font-bold text-[10px]">
              <Star className="w-3 h-3 fill-slate-950 stroke-[1.5]" />
            </div>
          </div>
        );
      case 'move_explanations':
        return (
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center shrink-0 shadow-xs">
            <div className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center font-black text-[10px] tracking-tighter">
              !!
            </div>
          </div>
        );
      case 'advanced_stats':
        return (
          <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-400 flex items-center justify-center shrink-0 shadow-xs">
            <BarChart2 className="w-4 h-4" />
          </div>
        );
      case 'courses_perks':
        return (
          <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-300 flex items-center justify-center shrink-0 shadow-xs">
            <BookOpen className="w-4 h-4 fill-teal-300/20" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center shrink-0">
            <Check className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div className="relative max-w-5xl mx-auto font-sans">
      {/* 1 Year Exclusive Pass Badge */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-950/80 border border-sky-800/60 text-sky-300 text-xs font-bold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>Full 1 Year Access • 12 Months All-Inclusive Diamond Pass</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-950/80 border border-amber-600/60 text-amber-300 text-xs font-bold shadow-xs">
          <span>🇺🇸</span>
          <span>US Citizens Exclusive</span>
        </div>
      </div>

      {/* US Citizen Exclusivity Notice Box */}
      <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-950/70 via-slate-900/90 to-amber-950/70 border border-amber-500/40 text-amber-200 flex items-start sm:items-center gap-3.5 shadow-lg">
        <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center shrink-0 font-bold text-lg">
          🇺🇸
        </div>
        <div className="text-xs space-y-0.5">
          <span className="font-bold text-amber-300 block uppercase tracking-wider text-[10px]">
            Important Eligibility Restriction
          </span>
          <p className="text-slate-200 leading-relaxed font-medium text-[11px] sm:text-xs">
            <strong>This membership is exclusively available to US citizens.</strong> Citizens of other countries are not eligible to activate this membership.
          </p>
        </div>
      </div>

      {/* Main Two-Column Container replicating m2.jpg + memb.jpg */}
      <div 
        id="features"
        className="bg-[#24221f]/95 rounded-3xl border border-[#3d3731] shadow-2xl p-4 sm:p-8 relative overflow-hidden backdrop-blur-md scroll-mt-28 transition-all duration-300 hover:border-[#81b64c]/40"
      >
        {/* Subtle background glow */}
        <div className="absolute -top-24 right-1/4 w-96 h-96 bg-[#81b64c]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: UNLIMITED FEATURES (from m2.jpg) */}
          <div className="md:col-span-7 space-y-3">
            <div className="border-b border-[#38332d] pb-3 mb-2 flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-stone-200">
                UNLIMITED
              </h3>
              <span className="text-[11px] text-[#81b64c] font-bold bg-[#81b64c]/15 px-2.5 py-0.5 rounded-full border border-[#81b64c]/30">
                All 9 Perks Included
              </span>
            </div>

            <div className="divide-y divide-[#38332d]/60">
              {OFFICIAL_DIAMOND_FEATURES.map((feature, idx) => (
                <div 
                  key={feature.id} 
                  className="py-3 px-2 rounded-xl hover:bg-[#2c2925]/60 transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    {renderFeatureIcon(feature)}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-white group-hover:text-[#81b64c] transition">
                          {feature.name}
                        </span>
                        <button
                          onClick={() => setActiveTooltip(feature)}
                          className="text-stone-400 hover:text-[#81b64c] p-0.5 rounded transition"
                          title="Click to learn more about this perk"
                        >
                          <Info className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-[11px] text-stone-300 hidden sm:block line-clamp-1">
                        {feature.short_desc}
                      </span>
                    </div>
                  </div>

                  <div className="text-right hidden sm:block shrink-0 pl-3">
                    <span className="text-[11px] font-bold text-[#81b64c] bg-[#81b64c]/15 px-2 py-0.5 rounded border border-[#81b64c]/30">
                      Unlimited
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: THE OFFICIAL DIAMOND CARD (from memb.jpg) */}
          <div className="md:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[320px] pt-8">
              {/* Glowing Diamond Icon at the Top (from memb.jpg) */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                <div className="relative">
                  {/* Diamond SVG Graphic with Chess Green Glow */}
                  <svg className="w-16 h-16 drop-shadow-[0_0_15px_rgba(129,182,76,0.7)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Top facet */}
                    <polygon points="50,15 25,35 75,35" fill="#a5d674" />
                    <polygon points="50,15 75,35 68,22" fill="#c4eb9b" />
                    <polygon points="50,15 25,35 32,22" fill="#81b64c" />
                    {/* Left & right side facets */}
                    <polygon points="25,35 12,38 32,58" fill="#587738" />
                    <polygon points="75,35 88,38 68,58" fill="#47622c" />
                    {/* Main lower body */}
                    <polygon points="25,35 75,35 50,85" fill="#81b64c" />
                    <polygon points="25,35 50,85 32,58" fill="#587738" />
                    <polygon points="75,35 50,85 68,58" fill="#69923e" />
                    {/* Sparkles */}
                    <circle cx="20" cy="18" r="2.5" fill="#ffffff" className="animate-pulse" />
                    <circle cx="82" cy="24" r="2" fill="#ffffff" className="animate-ping" />
                    <circle cx="50" cy="8" r="3" fill="#ffffff" />
                  </svg>
                </div>
              </div>

              {/* The Glowing Border Card */}
              <div className="rounded-3xl border-2 border-[#81b64c] bg-[#1a1917] p-5 shadow-[0_0_30px_rgba(129,182,76,0.25)] flex flex-col justify-between text-center relative overflow-hidden">
                {/* Header */}
                <div className="pt-5 pb-3 border-b border-[#38332d] space-y-1">
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#f5db9e] bg-[#3a2c13] px-2 py-0.5 rounded border border-[#7d5c1f]/60">
                      🇺🇸 US CITIZENS ONLY
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-white font-cinzel tracking-tight mt-0.5">
                    Diamond
                  </h3>
                  <p className="text-[10px] text-stone-400 mt-0.5">
                    {currentPlan.duration_label} VIP Pass
                  </p>
                </div>

                {/* 9 Checkmark Rows (aligned with the 9 features in m2.jpg) */}
                <div className="py-2 divide-y divide-[#38332d]/40">
                  {OFFICIAL_DIAMOND_FEATURES.map((feat) => (
                    <div key={feat.id} className="py-3 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-[#81b64c] text-white flex items-center justify-center shadow-[0_0_8px_rgba(129,182,76,0.6)]">
                        <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Action & Pricing */}
                <div className="pt-4 border-t border-[#38332d] space-y-2">
                  <button
                    onClick={() => startCheckout(currentPlan)}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-[#81b64c] to-[#67913d] hover:from-[#8ec853] hover:to-[#74a145] text-white font-black text-sm rounded-2xl shadow-lg shadow-[#81b64c]/30 transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 border border-[#81b64c]/40"
                  >
                    <span>Get Full Access</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="p-2 rounded-xl bg-[#332612] border border-[#6b4f1b]/50 text-left">
                    <p className="text-[10px] text-[#f5dda6] leading-snug">
                      <strong className="text-[#fce4ad]">Notice:</strong> Exclusively available to US citizens. Non-US citizens are not eligible to activate.
                    </p>
                  </div>

                  {/* Pricing as shown in memb.jpg: $16.99 / Month crossed out, $5/mo* */}
                  <div className="pt-1">
                    <span className="text-xs text-stone-400 line-through block font-mono">
                      $16.99 / Month
                    </span>
                    <div className="text-[#81b64c] font-bold text-base sm:text-lg font-mono flex items-center justify-center gap-1.5">
                      <span>$5/mo*</span>
                      <span className="text-xs text-stone-300 font-sans font-normal">(${currentPlan.price}/year)</span>
                    </div>
                    <span className="text-[9px] text-stone-400 block mt-0.5">
                      *Save 50% • Billed once annually • Instant voucher code
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Details Modal (when clicking info icon) */}
      {activeTooltip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#1e2124] rounded-2xl border border-sky-400/40 p-6 max-w-md w-full shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {renderFeatureIcon(activeTooltip)}
                <div>
                  <h4 className="text-lg font-bold text-white font-cinzel">
                    {activeTooltip.name}
                  </h4>
                  <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wider">
                    {activeTooltip.category}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveTooltip(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {activeTooltip.full_desc}
            </p>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓ Diamond:</span>
                <span className="text-slate-200">{activeTooltip.diamond_benefit}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✗ Free Tier:</span>
                <span className="text-slate-400">{activeTooltip.free_limitation}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveTooltip(null);
                startCheckout(currentPlan);
              }}
              className="w-full py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs transition"
            >
              Unlock {activeTooltip.name} with Diamond
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
