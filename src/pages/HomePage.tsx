import React, { useState } from 'react';
import { 
  Sparkles, Zap, CheckCircle2, ShieldCheck, ArrowRight, 
  ExternalLink, Crown, HelpCircle, Star, Award, Check, 
  X, AlertCircle, Bot, GraduationCap, BarChart2 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DiamondPlan } from '../types';
import { DiamondShowcase } from '../components/DiamondShowcase';

export const HomePage: React.FC = () => {
  const { plans, startCheckout, features, reviews, settings, setCurrentView } = useApp();
  const [activeInteractiveTab, setActiveInteractiveTab] = useState<'review' | 'puzzles' | 'lessons' | 'bots'>('review');

  return (
    <div className="space-y-24 pb-20 overflow-hidden font-sans">
      {/* 1. HERO SECTION */}
      <section 
        id="hero-section" 
        className="relative pt-12 sm:pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-28"
      >
        {/* Ambient Glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-3/4 h-80 bg-[#81b64c]/10 blur-3xl -z-10 rounded-full pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#81b64c]/15 border border-[#81b64c]/30 text-[#81b64c] text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 animate-spin text-[#81b64c]" />
            Official Chess.com Diamond Membership Store
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white font-cinzel tracking-tight leading-none">
            UNLEASH YOUR TRUE RATING WITH <span className="text-[#81b64c] underline decoration-[#81b64c]/40 underline-offset-8">DIAMOND</span>
          </h1>

          <p className="text-base sm:text-lg text-stone-300 leading-relaxed max-w-2xl mx-auto">
            Get unlimited Game Reviews, AI Virtual Coach insights, unlimited Puzzles, and all Grandmaster video lessons. Upgrade your Chess.com account today with instant voucher codes and <strong>save up to 50%</strong>.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => {
                const popular = plans.find(p => p.popular) || plans[0];
                startCheckout(popular);
              }}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#81b64c] to-[#67913d] hover:from-[#8ec853] hover:to-[#74a145] text-white font-black text-sm rounded-2xl shadow-xl shadow-[#81b64c]/30 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 border border-[#81b64c]/40"
            >
              <span>Get 1-Year Diamond Pass ($60)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={settings.official_chess_url}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-6 py-4 bg-[#282522]/90 hover:bg-[#36322d] text-[#ebecd0] font-bold text-sm rounded-2xl border border-[#443e37] shadow-md transition flex items-center justify-center gap-2 backdrop-blur-md"
            >
              <span>Official Chess.com Pricing</span>
              <ExternalLink className="w-4 h-4 text-stone-400" />
            </a>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-5 text-xs text-stone-300 font-medium">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#352914] border border-[#7d5d1e]/60 text-[#f5dda6] font-bold">
              <span>🇺🇸</span>
              <span>US Citizens Exclusively</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#81b64c]" />
              <span>No Password Needed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#81b64c]" />
              <span>Instant Digital Voucher</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#81b64c]" />
              <span>100% Money-Back Guarantee</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#81b64c]" />
              <span>Verified PayPal Checkout</span>
            </div>
          </div>

          {/* Important Eligibility Callout */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#2e2311]/90 border border-[#78571c]/60 text-[#f5dda6] text-xs text-left shadow-lg max-w-xl mx-auto backdrop-blur-md">
            <span className="text-xl shrink-0">🇺🇸</span>
            <div className="leading-snug">
              <span className="font-bold text-[#fce4ad] uppercase tracking-wider text-[10px] block">Eligibility Notice:</span>
              <span className="text-[#f5dda6] font-medium">This membership is exclusively available to US citizens. Citizens of other countries are not eligible to activate this membership.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. AUTHENTIC CHESS.COM DIAMOND MEMBERSHIP SHOWCASE (FROM m2.jpg + memb.jpg) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#81b64c] bg-[#81b64c]/15 px-3 py-1 rounded-full border border-[#81b64c]/30">
            Chess.com Official Matrix
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-cinzel">
            The Complete Diamond Experience
          </h2>
          <p className="text-xs sm:text-sm text-stone-300">
            Every single feature unlocked without limits. Compare the 9 core perks as featured on Chess.com.
          </p>
        </div>

        <DiamondShowcase />
      </section>

      {/* 3. EXCLUSIVE 1-YEAR DIAMOND MEMBERSHIP PASS */}
      <section id="plans" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#24221f]/95 text-white rounded-3xl p-6 sm:p-10 border-2 border-[#81b64c] shadow-2xl relative overflow-hidden backdrop-blur-md">
          {/* Subtle Ambient Light */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#81b64c]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Top Badges */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 relative z-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-[#81b64c] to-[#587738] text-white shadow-md flex items-center gap-1.5 border border-[#81b64c]/30">
                <span>💎</span>
                <span>Official 1-Year Diamond Pass</span>
              </span>
              <span className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#352914] text-[#f5dda6] border border-[#7d5d1e]/60 shadow-xs flex items-center gap-1">
                <span>🇺🇸</span>
                <span>US Citizens Exclusive</span>
              </span>
            </div>
            <span className="text-xs font-bold text-[#81b64c] bg-[#81b64c]/20 px-3 py-1.5 rounded-full border border-[#81b64c]/40">
              Save 50% vs Official Monthly Billing
            </span>
          </div>

          {/* US Citizen Notice Banner */}
          <div className="mb-6 p-3.5 rounded-2xl bg-[#332612] border border-[#6b4f1b]/50 text-[#f5dda6] text-xs flex items-center gap-2.5 relative z-10">
            <span className="text-lg">🇺🇸</span>
            <p className="leading-snug">
              <strong className="text-[#fce4ad] font-bold">Important Eligibility Requirement:</strong> This membership is exclusively available to US citizens. Citizens of other countries are not eligible to activate this membership.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            <div className="md:col-span-7 space-y-4">
              <h3 className="text-2xl sm:text-3xl font-black font-cinzel text-white">
                1 Year Diamond Membership
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Enjoy 365 days of unrestricted, VIP access to all 9 Chess.com unlimited perks. Instant activation via official voucher code directly to your Chess.com username.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs">
                {plans[0]?.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-stone-200">
                    <Check className="w-3.5 h-3.5 text-[#81b64c] shrink-0" />
                    <span className="text-[11px] leading-tight">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-5 bg-[#1c1a17] rounded-2xl p-6 border border-[#38332d] text-center space-y-4">
              <div>
                <span className="text-xs text-stone-400 line-through font-mono">
                  $16.99 / Month ($203.88/yr)
                </span>
                <div className="flex items-baseline justify-center gap-1.5 mt-1">
                  <span className="text-4xl font-black font-cinzel text-white">
                    ${plans[0]?.price || 60}
                  </span>
                  <span className="text-xs text-[#81b64c] font-bold font-mono">/ 1 Full Year</span>
                </div>
                <span className="text-[11px] text-[#81b64c] font-bold block mt-1">
                  Only $5/mo* equivalent rate
                </span>
              </div>

              <button
                onClick={() => startCheckout(plans[0])}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-[#81b64c] to-[#67913d] hover:from-[#8ec853] hover:to-[#74a145] text-white font-black text-sm rounded-xl shadow-lg shadow-[#81b64c]/25 transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 border border-[#81b64c]/40"
              >
                <span>Activate 1-Year Pass</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-stone-400 leading-normal">
                Official Chess.com 1-Year Voucher Code + Instant Activation • No Password Required
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE CHESS BOARD & GAME REVIEW DEMO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#24221f]/95 rounded-3xl p-6 sm:p-12 border border-[#3d3731] shadow-2xl text-white backdrop-blur-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Interactive Tab Controls */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#81b64c]/15 border border-[#81b64c]/30 text-[#81b64c] text-xs font-bold">
                <Crown className="w-3.5 h-3.5 text-[#f5db9e]" />
                Live Feature Experience
              </div>

              <h2 className="text-2xl sm:text-4xl font-black font-cinzel leading-tight text-white">
                See Why Grandmasters & Amateurs Rely On Diamond
              </h2>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Free accounts are locked after 1 basic review and 3 daily puzzles. Diamond members enjoy continuous, unrestricted Stockfish 16+ engine feedback on every move.
              </p>

              {/* Feature Tab Selector */}
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                {[
                  { id: 'review', label: 'Game Review & Coach', icon: <Sparkles className="w-4 h-4 text-[#81b64c]" /> },
                  { id: 'puzzles', label: 'Unlimited Puzzle Rush', icon: <Zap className="w-4 h-4 text-[#f5db9e]" /> },
                  { id: 'lessons', label: 'Grandmaster Lessons', icon: <GraduationCap className="w-4 h-4 text-[#81b64c]" /> },
                  { id: 'bots', label: '100+ Personality Bots', icon: <Bot className="w-4 h-4 text-[#bca0dc]" /> },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveInteractiveTab(tab.id as any)}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition ${
                      activeInteractiveTab === tab.id
                        ? 'bg-[#1a1917] border-[#81b64c] text-white shadow-lg ring-1 ring-[#81b64c]/30'
                        : 'bg-[#1e1d1a]/60 border-[#38332d] text-stone-400 hover:text-white hover:bg-[#282622]'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    const popular = plans.find(p => p.popular) || plans[0];
                    startCheckout(popular);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-[#81b64c] to-[#67913d] hover:from-[#8ec853] hover:to-[#74a145] text-white font-black text-xs rounded-xl transition flex items-center gap-2 shadow-lg shadow-[#81b64c]/20 border border-[#81b64c]/30"
                >
                  <span>Unlock Unlimited Diamond Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right: Simulated Diamond Game Review Interface */}
            <div className="lg:col-span-6 bg-[#1a1917] rounded-2xl p-6 border border-[#38332d] space-y-4">
              {activeInteractiveTab === 'review' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-[#38332d] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#81b64c] animate-pulse"></span>
                      <span className="text-xs font-black uppercase tracking-wide text-[#81b64c]">Game Review (Stockfish 16)</span>
                    </div>
                    <span className="text-xs font-bold text-[#81b64c] bg-[#81b64c]/15 px-2.5 py-0.5 rounded-full border border-[#81b64c]/30">
                      Accuracy: 98.4%
                    </span>
                  </div>

                  {/* Simulated Chess Position Card */}
                  <div className="bg-[#24221f] rounded-xl p-4 border border-[#38332d] flex items-center gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#779952] to-[#556b2f] rounded-lg flex items-center justify-center text-3xl shadow-inner border border-[#81b64c]/40 text-white">
                      <span>♞</span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 bg-[#81b64c]/20 text-[#a3d969] font-black rounded text-[10px] uppercase border border-[#81b64c]/40">
                          Brilliant !! (Move 24. Bxh7+)
                        </span>
                      </div>
                      <p className="text-stone-300 text-[11px] leading-relaxed">
                        "You sacrificed your Bishop to strip White's king of pawn cover, initiating an unstoppable mating sequence."
                      </p>
                    </div>
                  </div>

                  {/* Virtual Coach Feedback Box */}
                  <div className="p-3.5 bg-[#2a2723] border border-[#443e37] rounded-xl text-xs space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[#81b64c] font-bold">
                      <Bot className="w-3.5 h-3.5" />
                      <span>Coach Persona: Master Danny</span>
                    </div>
                    <p className="text-stone-300 text-[11px]">
                      "Phenomenal tactical awareness! You found the exact move GM Hikaru played in the 2024 Candidates Tournament."
                    </p>
                  </div>
                </div>
              )}

              {activeInteractiveTab === 'puzzles' && (
                <div className="space-y-4 animate-in fade-in duration-300 text-xs">
                  <div className="flex items-center justify-between border-b border-[#38332d] pb-3">
                    <span className="font-bold text-[#f5db9e]">Puzzle Rush 3-Minute Sprint</span>
                    <span className="font-mono font-bold text-white bg-[#352914] border border-[#7d5d1e]/60 px-2 py-0.5 rounded">Score: 42 ⚡</span>
                  </div>
                  <p className="text-stone-300 text-[11px] leading-relaxed">
                    Diamond gives you non-stop Puzzle Rush without the 1-per-day lock. Climb past 2,500+ tactical rating with tailored themes like Pin, Fork, Deflection, and Smothered Mate.
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
                    <div className="p-2 bg-[#24221f] rounded-lg border border-[#38332d]">
                      <span className="text-stone-400 block">Survival</span>
                      <span className="text-[#81b64c] text-xs">Unlimited</span>
                    </div>
                    <div className="p-2 bg-[#24221f] rounded-lg border border-[#38332d]">
                      <span className="text-stone-400 block">Puzzle Battle</span>
                      <span className="text-[#81b64c] text-xs">Live PvP</span>
                    </div>
                    <div className="p-2 bg-[#24221f] rounded-lg border border-[#38332d]">
                      <span className="text-stone-400 block">Custom Tactics</span>
                      <span className="text-[#f5db9e] text-xs">Rated</span>
                    </div>
                  </div>
                </div>
              )}

              {activeInteractiveTab === 'lessons' && (
                <div className="space-y-4 animate-in fade-in duration-300 text-xs">
                  <div className="flex items-center justify-between border-b border-[#38332d] pb-3">
                    <span className="font-bold text-[#81b64c]">Grandmaster Video Curriculum</span>
                    <span className="text-[10px] text-stone-400">5,000+ Video Lessons</span>
                  </div>
                  <p className="text-stone-300 text-[11px] leading-relaxed">
                    Watch interactive masterclasses from Magnus Carlsen, Hikaru Nakamura, Daniel Naroditsky, and Judit Polgar with move-by-move challenge questions.
                  </p>
                  <div className="p-3 bg-[#24221f] rounded-xl border border-[#38332d] space-y-1">
                    <span className="font-bold text-white block">Next Recommended: Master the Sicilian Najdorf</span>
                    <span className="text-[10px] text-stone-400">12 chapters • Interactive drills included</span>
                  </div>
                </div>
              )}

              {activeInteractiveTab === 'bots' && (
                <div className="space-y-4 animate-in fade-in duration-300 text-xs">
                  <div className="flex items-center justify-between border-b border-[#38332d] pb-3">
                    <span className="font-bold text-[#bca0dc]">All 100+ Bots Unlocked</span>
                    <span className="text-[10px] text-stone-400">From 250 to 3200 Rating</span>
                  </div>
                  <p className="text-stone-300 text-[11px] leading-relaxed">
                    Spar against famous personas like Beth Harmon, Nelson, Mittens, and adaptive bots that scale their tactical difficulty based on your blunders.
                  </p>
                  <div className="flex items-center gap-3 bg-[#24221f] p-3 rounded-xl border border-[#38332d]">
                    <div className="w-10 h-10 rounded-full bg-[#587738] flex items-center justify-center text-white font-bold">
                      GM
                    </div>
                    <div>
                      <span className="font-bold text-white block">Hikaru Nakamura Bot (2850)</span>
                      <span className="text-[10px] text-stone-400">Plays fast, aggressive blitz attacks</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. CHESS.COM MEMBERSHIP COMPARISON MATRIX */}
      <section id="comparison" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#81b64c] bg-[#81b64c]/15 px-3 py-1 rounded-full border border-[#81b64c]/30">
            Tier Breakdown
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-cinzel">
            Why Diamond is the Only Choice
          </h2>
          <p className="text-xs sm:text-sm text-stone-300">
            Compare all Chess.com membership levels as seen on{' '}
            <a href={settings.official_chess_url} target="_blank" rel="noreferrer" className="text-[#81b64c] underline font-semibold">
              chess.com/membership
            </a>
          </p>
        </div>

        <div className="bg-[#24221f]/95 rounded-3xl border border-[#3d3731] overflow-hidden shadow-2xl backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#1a1917] border-b border-[#38332d] text-stone-300 font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Features</th>
                  <th className="py-4 px-4 text-center">Free</th>
                  <th className="py-4 px-4 text-center">Gold</th>
                  <th className="py-4 px-4 text-center">Platinum</th>
                  <th className="py-4 px-6 text-center bg-[#81b64c]/15 text-[#ebecd0] font-black border-l border-r border-[#81b64c]/30">
                    DIAMOND (Chess Shop)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#38332d]/60 text-stone-300">
                <tr>
                  <td className="py-3.5 px-6 font-bold text-white">1. Puzzles & Puzzle Rush</td>
                  <td className="py-3.5 px-4 text-center text-stone-500">3 per day</td>
                  <td className="py-3.5 px-4 text-center text-[#81b64c] font-bold">Unlimited</td>
                  <td className="py-3.5 px-4 text-center text-[#81b64c] font-bold">Unlimited</td>
                  <td className="py-3.5 px-6 text-center bg-[#81b64c]/10 font-black text-[#81b64c] border-l border-r border-[#81b64c]/20">
                    Unlimited All Modes & Battle
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-bold text-white">2. Lessons (5,000+ GM Video Library)</td>
                  <td className="py-3.5 px-4 text-center text-stone-500">Intro only</td>
                  <td className="py-3.5 px-4 text-center text-[#81b64c] font-bold">Unlimited</td>
                  <td className="py-3.5 px-4 text-center text-[#81b64c] font-bold">Unlimited</td>
                  <td className="py-3.5 px-6 text-center bg-[#81b64c]/10 font-black text-[#81b64c] border-l border-r border-[#81b64c]/20">
                    Unlimited 5,000+ Masterclasses
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-bold text-white">3. Bots (100+ Personas & Masters)</td>
                  <td className="py-3.5 px-4 text-center text-stone-500">Basic only</td>
                  <td className="py-3.5 px-4 text-center text-stone-500">Basic only</td>
                  <td className="py-3.5 px-4 text-center text-[#81b64c] font-bold">Unlocked</td>
                  <td className="py-3.5 px-6 text-center bg-[#81b64c]/10 font-black text-[#81b64c] border-l border-r border-[#81b64c]/20">
                    100% Unlocked + Coach Commentary
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-bold text-white">4. Play Coach (Live Tips & Takebacks)</td>
                  <td className="py-3.5 px-4 text-center"><X className="w-4 h-4 text-stone-600 mx-auto" /></td>
                  <td className="py-3.5 px-4 text-center"><X className="w-4 h-4 text-stone-600 mx-auto" /></td>
                  <td className="py-3.5 px-4 text-center"><X className="w-4 h-4 text-stone-600 mx-auto" /></td>
                  <td className="py-3.5 px-6 text-center bg-[#81b64c]/10 font-bold text-[#81b64c] border-l border-r border-[#81b64c]/20">
                    <Check className="w-4 h-4 mx-auto stroke-[3]" />
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-bold text-white">5. No Ads (Zero Banners or Video Ads)</td>
                  <td className="py-3.5 px-4 text-center"><X className="w-4 h-4 text-stone-600 mx-auto" /></td>
                  <td className="py-3.5 px-4 text-center text-[#81b64c] font-bold">Zero Ads</td>
                  <td className="py-3.5 px-4 text-center text-[#81b64c] font-bold">Zero Ads</td>
                  <td className="py-3.5 px-6 text-center bg-[#81b64c]/10 font-black text-[#81b64c] border-l border-r border-[#81b64c]/20">
                    100% Ad-Free Everywhere
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-bold text-white">6. Game Review (Stockfish 16+ Depth)</td>
                  <td className="py-3.5 px-4 text-center text-stone-500">1 per day</td>
                  <td className="py-3.5 px-4 text-center text-stone-500">1 per day</td>
                  <td className="py-3.5 px-4 text-center text-stone-300">Unlimited (Depth 18)</td>
                  <td className="py-3.5 px-6 text-center bg-[#81b64c]/10 font-black text-[#81b64c] border-l border-r border-[#81b64c]/20">
                    Unlimited (Depth 24+ & Full Coach)
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-bold text-white">7. Move Explanations & Brilliant (!!)</td>
                  <td className="py-3.5 px-4 text-center"><X className="w-4 h-4 text-stone-600 mx-auto" /></td>
                  <td className="py-3.5 px-4 text-center"><X className="w-4 h-4 text-stone-600 mx-auto" /></td>
                  <td className="py-3.5 px-4 text-center"><X className="w-4 h-4 text-stone-600 mx-auto" /></td>
                  <td className="py-3.5 px-6 text-center bg-[#81b64c]/10 font-bold text-[#81b64c] border-l border-r border-[#81b64c]/20">
                    <Check className="w-4 h-4 mx-auto stroke-[3]" />
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-bold text-white">8. Advanced Stats & Insights</td>
                  <td className="py-3.5 px-4 text-center"><X className="w-4 h-4 text-stone-600 mx-auto" /></td>
                  <td className="py-3.5 px-4 text-center"><X className="w-4 h-4 text-stone-600 mx-auto" /></td>
                  <td className="py-3.5 px-4 text-center"><X className="w-4 h-4 text-stone-600 mx-auto" /></td>
                  <td className="py-3.5 px-6 text-center bg-[#81b64c]/10 font-bold text-[#81b64c] border-l border-r border-[#81b64c]/20">
                    <Check className="w-4 h-4 mx-auto stroke-[3]" />
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-bold text-white">9. Courses Perks & VIP Benefits</td>
                  <td className="py-3.5 px-4 text-center"><X className="w-4 h-4 text-stone-600 mx-auto" /></td>
                  <td className="py-3.5 px-4 text-center"><X className="w-4 h-4 text-stone-600 mx-auto" /></td>
                  <td className="py-3.5 px-4 text-center"><X className="w-4 h-4 text-stone-600 mx-auto" /></td>
                  <td className="py-3.5 px-6 text-center bg-[#81b64c]/10 font-bold text-[#81b64c] border-l border-r border-[#81b64c]/20">
                    <Check className="w-4 h-4 mx-auto stroke-[3]" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. HOW ACTIVATION WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#1c1b18] via-[#24221f] to-[#1c1b18] rounded-3xl p-8 sm:p-14 text-white space-y-10 border border-[#3d3731] shadow-2xl backdrop-blur-md">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#81b64c]">Simple 3-Step Process</span>
            <h2 className="text-3xl font-black font-cinzel text-white">How Activation Works</h2>
            <p className="text-xs text-stone-300">
              No complicated setups. We never ask for your account password.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#1a1917] rounded-2xl p-6 border border-[#38332d] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#81b64c] text-white font-black flex items-center justify-center text-sm shadow-md">
                1
              </div>
              <h3 className="text-base font-bold text-white font-cinzel">Choose Your 1-Year Pass</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Choose the official 1-Year Diamond Membership Pass to unlock 365 days of unlimited access.
              </p>
            </div>

            <div className="bg-[#1a1917] rounded-2xl p-6 border border-[#38332d] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#81b64c] text-white font-black flex items-center justify-center text-sm shadow-md">
                2
              </div>
              <h3 className="text-base font-bold text-white font-cinzel">Provide Username & PayPal</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Type your Chess.com public handle and complete payment securely through PayPal.me buyer protection.
              </p>
            </div>

            <div className="bg-[#1a1917] rounded-2xl p-6 border border-[#38332d] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#81b64c] text-white font-black flex items-center justify-center text-sm shadow-md">
                3
              </div>
              <h3 className="text-base font-bold text-white font-cinzel">Instant Diamond Activation</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Receive your official voucher code and instructions. Redeem with 1-click on Chess.com and start analyzing!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. VERIFIED CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#81b64c] bg-[#81b64c]/15 px-3 py-1 rounded-full border border-[#81b64c]/30">
            Player Feedback
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-cinzel">
            Loved by Rated Players Worldwide
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map(rev => (
            <div key={rev.id} className="bg-[#24221f]/95 rounded-3xl p-6 border border-[#3d3731] shadow-xl space-y-4 flex flex-col justify-between backdrop-blur-md">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#f5db9e]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#81b64c]/20 text-[#81b64c] border border-[#81b64c]/30">
                    {rev.plan}
                  </span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              <div className="border-t border-[#38332d] pt-3 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-white">{rev.author}</h4>
                  <p className="text-[11px] text-stone-400">@{rev.chess_username} • {rev.fide_rating}</p>
                </div>
                <span className="text-[10px] text-[#81b64c] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. EXPLORE MORE: PRODUCTS, MISSION & CONTACT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#24221f]/95 rounded-3xl border border-[#3d3731] p-6 sm:p-10 shadow-2xl space-y-8 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#81b64c]">
                Explore Chess Shop
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-cinzel text-white mt-1">
                More Than Just A Single Pass
              </h2>
            </div>
            <p className="text-xs text-stone-400 max-w-sm">
              Discover our full spectrum of club team licensing, two-year passes, and our zero-password security promise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Services */}
            <div className="bg-[#1c1a17] rounded-2xl p-6 border border-[#38332d] space-y-4 flex flex-col justify-between hover:border-[#81b64c]/40 transition group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#81b64c]/15 border border-[#81b64c]/30 flex items-center justify-center text-xl">
                  👑
                </div>
                <h3 className="text-lg font-bold font-cinzel text-white group-hover:text-[#81b64c] transition">
                  Products & Services
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Compare individual 1-year and 2-year passes, scholastic club bulk packages, and VIP tournament prep tools.
                </p>
              </div>
              <button
                onClick={() => setCurrentView('services')}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#282522] hover:bg-[#332f2a] text-[#81b64c] font-bold text-xs flex items-center justify-center gap-2 border border-[#443e37] transition cursor-pointer"
              >
                <span>View All Products</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 2: About */}
            <div className="bg-[#1c1a17] rounded-2xl p-6 border border-[#38332d] space-y-4 flex flex-col justify-between hover:border-[#81b64c]/40 transition group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#81b64c]/15 border border-[#81b64c]/30 flex items-center justify-center text-xl">
                  📖
                </div>
                <h3 className="text-lg font-bold font-cinzel text-white group-hover:text-[#81b64c] transition">
                  About Our Mission
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Learn how we provide 50% savings to US chess players with zero credential sharing and 99.8% positive ratings.
                </p>
              </div>
              <button
                onClick={() => setCurrentView('about')}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#282522] hover:bg-[#332f2a] text-[#81b64c] font-bold text-xs flex items-center justify-center gap-2 border border-[#443e37] transition cursor-pointer"
              >
                <span>Read Our Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 3: Contact */}
            <div className="bg-[#1c1a17] rounded-2xl p-6 border border-[#38332d] space-y-4 flex flex-col justify-between hover:border-[#81b64c]/40 transition group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#81b64c]/15 border border-[#81b64c]/30 flex items-center justify-center text-xl">
                  💬
                </div>
                <h3 className="text-lg font-bold font-cinzel text-white group-hover:text-[#81b64c] transition">
                  Support & Concierge
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Have questions about voucher activation or payment? Reach our dedicated player concierge 7 days a week.
                </p>
              </div>
              <button
                onClick={() => setCurrentView('contact')}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#282522] hover:bg-[#332f2a] text-[#81b64c] font-bold text-xs flex items-center justify-center gap-2 border border-[#443e37] transition cursor-pointer"
              >
                <span>Contact Concierge</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-3xl font-black text-white font-cinzel">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-stone-300">
            Everything you need to know about buying Diamond Memberships on Chess Shop.
          </p>
        </div>

        <div className="space-y-4 text-xs">
          <div className="bg-[#2e2311]/90 rounded-2xl p-5 border border-[#78571c]/60 shadow-lg space-y-1.5 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="text-base">🇺🇸</span>
              <h4 className="font-bold text-[#fce4ad] text-sm">Who is eligible to purchase and activate this membership?</h4>
            </div>
            <p className="text-[#f5dda6] leading-relaxed font-medium">
              <strong>This membership is exclusively available to US citizens. Citizens of other countries are not eligible to activate this membership.</strong> Please ensure you meet this requirement prior to placing your order.
            </p>
          </div>

          <div className="bg-[#24221f]/95 rounded-2xl p-5 border border-[#3d3731] shadow-md space-y-1.5 backdrop-blur-md">
            <h4 className="font-bold text-[#ebecd0] text-sm">Do you ever require my Chess.com password?</h4>
            <p className="text-stone-300 leading-relaxed">
              <strong>Never.</strong> We only require your public Chess.com username or delivery email address. We supply official Chess.com voucher redemption codes and gift memberships that apply directly to your account.
            </p>
          </div>

          <div className="bg-[#24221f]/95 rounded-2xl p-5 border border-[#3d3731] shadow-md space-y-1.5 backdrop-blur-md">
            <h4 className="font-bold text-[#ebecd0] text-sm">How fast is my Diamond Membership activated?</h4>
            <p className="text-stone-300 leading-relaxed">
              Automated orders generate your official voucher code immediately on the confirmation page. For manual orders, our team verifies PayPal payments within 5 to 15 minutes.
            </p>
          </div>

          <div className="bg-[#24221f]/95 rounded-2xl p-5 border border-[#3d3731] shadow-md space-y-1.5 backdrop-blur-md">
            <h4 className="font-bold text-[#ebecd0] text-sm">Does this work on existing accounts with games and ratings?</h4>
            <p className="text-stone-300 leading-relaxed">
              Yes! You retain 100% of your game archives, current ratings, friends, clubs, and stats. It simply upgrades your existing account tier to Diamond.
            </p>
          </div>

          <div className="bg-[#24221f]/95 rounded-2xl p-5 border border-[#3d3731] shadow-md space-y-1.5 backdrop-blur-md">
            <h4 className="font-bold text-[#ebecd0] text-sm">Where can I contact support?</h4>
            <p className="text-stone-300 leading-relaxed">
              Our concierge team is available at <span className="font-bold text-[#81b64c]">{settings.support_email}</span> or via our Contact Page.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
