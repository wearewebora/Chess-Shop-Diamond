import React, { useState } from 'react';
import { 
  Sparkles, Check, ArrowRight, ShieldCheck, Zap, 
  Crown, Users, Cpu, Trophy, Clock, HelpCircle, 
  ExternalLink, CheckCircle2, ChevronRight, Filter 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DiamondPlan } from '../types';

export const ServicesPage: React.FC = () => {
  const { plans, startCheckout, setCurrentView, settings } = useApp();

  // Exclusive 1-Year Diamond Pass
  const allServices = [
    {
      id: 'diamond-1-year',
      category: 'individual',
      title: '1-Year Diamond Membership',
      badge: 'Official Pass • Save 50%',
      price: '$60',
      period: 'per 1 full year',
      originalPrice: '$203.88',
      desc: '365 days of unrestricted, VIP access to all 9 Chess.com unlimited perks. Instant digital voucher key delivered directly to your account.',
      popular: true,
      features: [
        'Exclusively available to US citizens',
        'Unlimited Game Reviews with full engine evaluations (Stockfish 16+)',
        'Unlimited Puzzles, Puzzle Rush & live Puzzle Battles',
        'AI Virtual Coach feedback on every critical blunder and brilliant move',
        'Complete Grandmaster Video Library (5,000+ interactive lessons)',
        'Unlimited Practice against all 100+ Master Personalities & Bots',
        '100% Ad-Free across web, iOS, and Android applications',
        'Official Chess.com 1-Year voucher code with zero password required'
      ],
      ctaText: 'Activate 1-Year Pass ($60)',
      action: () => {
        const plan = plans.find(p => p.id === 'diamond-1-year') || plans[0];
        startCheckout(plan);
      }
    }
  ];

  const steps = [
    {
      step: '01',
      title: 'Select 1-Year Diamond Pass',
      desc: 'Choose the official 1-Year Diamond Pass ($60/year) and click activate.'
    },
    {
      step: '02',
      title: 'Enter Username & Pay Securely',
      desc: 'Enter your Chess.com username and complete payment via PayPal.me with buyer protection.'
    },
    {
      step: '03',
      title: 'Instant Voucher Activation',
      desc: 'Receive your unique official voucher code to redeem directly on chess.com/membership.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 font-sans space-y-16 sm:space-y-24 text-stone-200">
      {/* 1. HEADER & HERO */}
      <section className="text-center max-w-3xl mx-auto space-y-6 pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#81b64c]/15 border border-[#81b64c]/30 text-[#81b64c] text-xs font-bold uppercase tracking-wider backdrop-blur-md">
          <Crown className="w-3.5 h-3.5" />
          Official Membership
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white font-cinzel tracking-tight leading-tight">
          Official 1-Year <span className="text-[#81b64c] underline decoration-[#81b64c]/40 underline-offset-8">Diamond Membership</span>
        </h1>

        <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-2xl mx-auto">
          Get 365 days of unrestricted, VIP access to all 9 Chess.com unlimited perks. Instant activation via official voucher code directly to your Chess.com username.
        </p>

        {/* Eligibility Notice Badge */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#352914] text-[#f5dda6] border border-[#7d5d1e]/60 text-xs font-bold shadow-xs">
            <span>🇺🇸</span>
            <span>US Citizens Exclusively</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#81b64c]/15 text-[#81b64c] border border-[#81b64c]/30 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Zero Password Required</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#81b64c]/15 text-[#81b64c] border border-[#81b64c]/30 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Instant Digital Voucher</span>
          </div>
        </div>
      </section>

      {/* 2. RESPONSIVE PRODUCT CARD (1-YEAR DIAMOND PASS ONLY) */}
      <section className="max-w-2xl mx-auto w-full">
        {allServices.map(service => (
          <div 
            key={service.id}
            className="rounded-3xl p-6 sm:p-10 flex flex-col justify-between border-2 border-[#81b64c] bg-[#25221d] shadow-2xl shadow-[#81b64c]/15 relative overflow-hidden backdrop-blur-md"
          >
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#81b64c]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-6 relative z-10">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full bg-[#81b64c]/20 text-[#81b64c] border border-[#81b64c]/40">
                  {service.badge}
                </span>

                <span className="text-xs text-stone-400 line-through font-mono">
                  Retail: {service.originalPrice}
                </span>
              </div>

              {/* US Citizen Eligibility Alert */}
              <div className="p-3.5 rounded-2xl bg-[#332612] border border-[#6b4f1b]/50 text-[#f5dda6] text-xs flex items-center gap-2.5">
                <span className="text-lg">🇺🇸</span>
                <p className="leading-snug">
                  <strong className="text-[#fce4ad] font-bold">Eligibility Notice:</strong> This membership is exclusively available to US citizens. Citizens of other countries are not eligible to activate.
                </p>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-black font-cinzel text-white">
                  {service.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 mt-2 leading-relaxed">
                  {service.desc}
                </p>
              </div>

              {/* Price Display */}
              <div className="bg-[#191815] rounded-2xl p-5 border border-[#332f29] flex items-baseline justify-between">
                <div>
                  <span className="text-4xl sm:text-5xl font-black font-cinzel text-white">
                    {service.price}
                  </span>
                  <span className="text-xs text-[#81b64c] font-bold font-mono ml-2">
                    {service.period}
                  </span>
                  <span className="text-[11px] text-[#81b64c] font-bold block mt-1">
                    Only $5/mo* equivalent rate
                  </span>
                </div>
                <span className="text-[11px] text-stone-400 font-mono">
                  Instant Voucher Delivery
                </span>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-2.5 pt-1">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Included Benefits:
                </h4>
                <div className="space-y-2">
                  {service.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs text-stone-300">
                      <Check className="w-4 h-4 text-[#81b64c] shrink-0 mt-0.5" />
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-8 mt-6 border-t border-[#332f29] relative z-10">
              <button
                onClick={service.action}
                className="w-full min-h-[48px] py-4 px-6 font-black text-sm rounded-xl transition flex items-center justify-center gap-2 active:scale-98 cursor-pointer bg-gradient-to-r from-[#81b64c] to-[#67913d] hover:from-[#8ec853] hover:to-[#74a145] text-white shadow-lg shadow-[#81b64c]/25 border border-[#81b64c]/40"
              >
                <span>{service.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[10px] text-stone-400 text-center mt-2 font-sans">
                Official Chess.com 1-Year Voucher Code + Instant Activation • No Password Required
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* 3. HOW REDEMPTION WORKS */}
      <section className="bg-[#24221f]/95 rounded-3xl border border-[#3d3731] shadow-2xl p-6 sm:p-10 lg:p-12 space-y-10 backdrop-blur-md">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#81b64c]">Simple & Fast</span>
          <h2 className="text-2xl sm:text-4xl font-black font-cinzel text-white">
            How Your Membership Is Activated
          </h2>
          <p className="text-xs sm:text-sm text-stone-400">
            From checkout to full Diamond training in 3 straightforward steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, idx) => (
            <div 
              key={idx}
              className="bg-[#1b1916] rounded-2xl p-6 border border-[#38332d] space-y-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black font-cinzel text-[#81b64c]/30">
                  {s.step}
                </span>
                <CheckCircle2 className="w-5 h-5 text-[#81b64c]" />
              </div>

              <h3 className="text-sm sm:text-base font-bold text-white">{s.title}</h3>
              <p className="text-xs text-stone-300 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-2xl bg-[#1c1a17] border border-[#38332d] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#81b64c] shrink-0" />
            <div>
              <strong className="text-white block">Official Verification Portal</strong>
              <span className="text-stone-400">All vouchers are officially redeemed at chess.com/membership</span>
            </div>
          </div>

          <a 
            href={settings.official_chess_url}
            target="_blank"
            rel="noreferrer"
            className="text-[#81b64c] hover:underline font-bold inline-flex items-center gap-1 shrink-0"
          >
            <span>View Chess.com Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>
    </div>
  );
};
