import React from 'react';
import { 
  ShieldCheck, Award, Zap, Users, CheckCircle2, 
  ArrowRight, HeartHandshake, Lock, Sparkles, 
  Target, BookOpen, Clock, HelpCircle, ExternalLink 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AboutPage: React.FC = () => {
  const { setCurrentView, plans, startCheckout, settings } = useApp();

  const milestones = [
    { number: '15,000+', label: 'Vouchers Delivered', desc: 'To US chess competitors and enthusiasts' },
    { number: '50%', label: 'Average Savings', desc: 'Compared to monthly retail billing rates' },
    { number: '99.8%', label: 'Positive Rating', desc: 'Verified buyer satisfaction on every order' },
    { number: '< 15 Min', label: 'Average Verification', desc: 'Fast digital turnaround 7 days a week' },
  ];

  const pillars = [
    {
      icon: ShieldCheck,
      title: 'Zero Password Requirement',
      desc: 'We never ask for your account password, email access, or 2FA codes. Your account security remains 100% in your hands at all times.'
    },
    {
      icon: Award,
      title: 'Official Voucher Redemption',
      desc: 'You receive an authentic, single-use Chess.com digital voucher code redeemable directly on the official Chess.com membership portal.'
    },
    {
      icon: HeartHandshake,
      title: 'US Citizen Exclusive Focus',
      desc: 'Our licensing agreements are tailored specifically for eligible US chess players, scholastic teams, and tournament competitors.'
    },
    {
      icon: Zap,
      title: 'Instant Buyer Protection',
      desc: 'All payments are securely processed through PayPal.me with full buyer protection and transparent transaction logging.'
    }
  ];

  const team = [
    {
      name: 'Michael Vance',
      role: 'Head of Player Relations',
      rating: 'USCF 2040 Candidate Master',
      bio: 'Lifelong competitive player passionate about bringing high-level game analytics within reach of every aspiring club player.'
    },
    {
      name: 'Elena Rostova',
      role: 'Concierge Verification Lead',
      rating: 'FIDE 1980 / Chess.com 2200',
      bio: 'Oversees digital fulfillment, order verification, and 24/7 voucher dispatch to ensure lightning-fast member activation.'
    },
    {
      name: 'David Chen',
      role: 'Technical Security Advisor',
      rating: 'Club Tournament Organizer',
      bio: 'Specialist in secure API integration, transactional integrity, and maintaining zero-trust architecture for customer data.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 font-sans space-y-16 sm:space-y-24 text-stone-200">
      {/* 1. HERO SECTION */}
      <section className="text-center max-w-3xl mx-auto space-y-6 pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#81b64c]/15 border border-[#81b64c]/30 text-[#81b64c] text-xs font-bold uppercase tracking-wider backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-[#81b64c]" />
          About Chess Shop
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white font-cinzel tracking-tight leading-tight">
          Democratizing Grandmaster Insights For <span className="text-[#81b64c] underline decoration-[#81b64c]/40 underline-offset-8">Every Player</span>
        </h1>

        <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-2xl mx-auto">
          Chess Shop was founded with a single mission: to provide serious chess competitors, scholastic club members, and adult improvers with legitimate, discounted access to the world&apos;s most advanced training tools.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => {
              const popular = plans.find(p => p.popular) || plans[0];
              startCheckout(popular);
            }}
            className="w-full sm:w-auto min-h-[48px] px-6 py-3.5 bg-gradient-to-r from-[#81b64c] to-[#67913d] hover:from-[#8ec853] hover:to-[#74a145] text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-[#81b64c]/25 transition active:scale-95 flex items-center justify-center gap-2 border border-[#81b64c]/40"
          >
            <span>Claim 1-Year Diamond Pass ($60)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setCurrentView('services')}
            className="w-full sm:w-auto min-h-[48px] px-6 py-3.5 bg-[#26231f] hover:bg-[#332f2a] text-stone-200 font-bold text-xs sm:text-sm rounded-xl border border-[#443e36] transition active:scale-95 flex items-center justify-center gap-2"
          >
            <span>View All Membership Plans</span>
          </button>
        </div>
      </section>

      {/* 2. STATS & MILESTONES */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {milestones.map((m, idx) => (
          <div 
            key={idx} 
            className="bg-[#24221f]/90 border border-[#3d3731] rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-center space-y-2 shadow-lg backdrop-blur-md"
          >
            <span className="text-2xl sm:text-4xl font-black font-cinzel text-[#81b64c] block">
              {m.number}
            </span>
            <h4 className="text-xs sm:text-sm font-bold text-white">{m.label}</h4>
            <p className="text-[11px] sm:text-xs text-stone-400">{m.desc}</p>
          </div>
        ))}
      </section>

      {/* 3. OUR STORY & MISSION */}
      <section className="bg-[#24221f]/95 rounded-3xl border border-[#3d3731] shadow-2xl p-6 sm:p-10 lg:p-12 relative overflow-hidden backdrop-blur-md">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#81b64c]/15 border border-[#81b64c]/30 text-[#81b64c] text-xs font-bold">
              <BookOpen className="w-3.5 h-3.5" />
              Our Story
            </div>

            <h2 className="text-2xl sm:text-4xl font-black font-cinzel text-white leading-tight">
              Why We Built Chess Shop
            </h2>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Standard retail pricing for full Diamond benefits on Chess.com totals over <strong>$203 per year</strong> when billed monthly. For scholastic players, students, and tournament regulars, this steep cost can become a barrier to proper game analysis and mastery.
            </p>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Through strategic institutional voucher allocations and bulk procurement for eligible US competitors, Chess Shop bridges this divide. We offer the full 1-Year Diamond Membership for a flat <strong>$60 per year (50% savings)</strong> — with zero compromise on safety or legitimacy.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-stone-200">
                <CheckCircle2 className="w-4 h-4 text-[#81b64c] shrink-0" />
                <span>Stockfish 16+ Engine Unlimited</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-stone-200">
                <CheckCircle2 className="w-4 h-4 text-[#81b64c] shrink-0" />
                <span>Unlimited Game Reviews</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-stone-200">
                <CheckCircle2 className="w-4 h-4 text-[#81b64c] shrink-0" />
                <span>All Grandmaster Video Lessons</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-stone-200">
                <CheckCircle2 className="w-4 h-4 text-[#81b64c] shrink-0" />
                <span>AI Virtual Coach Personality</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#1b1916] rounded-2xl p-6 border border-[#38332d] space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#81b64c]/20 border border-[#81b64c]/40 flex items-center justify-center text-2xl">
                ♟️
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Authenticity Guarantee</h3>
                <span className="text-[11px] text-[#81b64c] font-semibold">100% Genuine Digital Codes</span>
              </div>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              Every voucher is verified against official Chess.com membership redemption endpoints. You simply enter your Chess.com username at checkout, complete payment, and apply the voucher key directly at{' '}
              <a 
                href={settings.official_chess_url} 
                target="_blank" 
                rel="noreferrer" 
                className="text-[#81b64c] underline hover:text-[#a3d969] font-medium"
              >
                chess.com/membership
              </a>.
            </p>

            <div className="p-3.5 rounded-xl bg-[#292621] border border-[#474035] text-[11px] text-stone-300 space-y-1">
              <strong className="text-white flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#81b64c]" />
                Security First
              </strong>
              <span>No credentials ever leave your possession. Your Chess.com account remains untouched and safe.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CORE COMMITMENTS */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#81b64c]">Our Principles</span>
          <h2 className="text-2xl sm:text-4xl font-black font-cinzel text-white">
            Built on Trust, Speed, and Security
          </h2>
          <p className="text-xs sm:text-sm text-stone-400">
            How we protect every single transaction and guarantee satisfaction.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div 
                key={idx}
                className="bg-[#24221f]/90 rounded-2xl p-6 border border-[#3d3731] space-y-3 hover:border-[#81b64c]/40 transition-all duration-300 shadow-md"
              >
                <div className="w-10 h-10 rounded-xl bg-[#81b64c]/15 border border-[#81b64c]/30 flex items-center justify-center text-[#81b64c]">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">{p.title}</h3>
                <p className="text-xs text-stone-300 leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. MEET THE CONCIERGE TEAM */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#81b64c]">Dedicated Concierge</span>
          <h2 className="text-2xl sm:text-4xl font-black font-cinzel text-white">
            Players Helping Players
          </h2>
          <p className="text-xs sm:text-sm text-stone-400">
            Our support and fulfillment team are rated tournament competitors who understand chess.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {team.map((member, idx) => (
            <div 
              key={idx}
              className="bg-[#24221f]/90 rounded-2xl p-6 border border-[#3d3731] space-y-4 hover:border-[#81b64c]/40 transition shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#81b64c] to-[#4e702e] flex items-center justify-center text-white font-black font-cinzel text-lg shadow-md">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{member.name}</h3>
                  <span className="text-[11px] text-[#81b64c] font-semibold block">{member.role}</span>
                  <span className="text-[10px] text-stone-400 font-mono">{member.rating}</span>
                </div>
              </div>

              <p className="text-xs text-stone-300 leading-relaxed">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="bg-gradient-to-br from-[#2a2622] via-[#211e1a] to-[#1a1815] rounded-3xl border border-[#4d4439] p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#81b64c]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-2xl mx-auto space-y-3 relative z-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#81b64c] bg-[#81b64c]/15 px-3 py-1 rounded-full border border-[#81b64c]/30">
            Ready To Train Like A Master?
          </span>
          <h2 className="text-2xl sm:text-4xl font-black font-cinzel text-white">
            Upgrade Your Chess.com Experience Today
          </h2>
          <p className="text-xs sm:text-sm text-stone-300">
            Join thousands of satisfied players who upgraded their rating and analysis capabilities with our 1-Year Diamond Pass.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10 pt-2">
          <button
            onClick={() => {
              const popular = plans.find(p => p.popular) || plans[0];
              startCheckout(popular);
            }}
            className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 bg-gradient-to-r from-[#81b64c] to-[#67913d] hover:from-[#8ec853] hover:to-[#74a145] text-white font-black text-sm rounded-xl shadow-lg shadow-[#81b64c]/25 transition active:scale-95 flex items-center justify-center gap-2 border border-[#81b64c]/40"
          >
            <span>Activate Diamond Pass ($60)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setCurrentView('contact')}
            className="w-full sm:w-auto min-h-[48px] px-6 py-3.5 bg-transparent hover:bg-white/5 text-stone-300 font-bold text-sm rounded-xl border border-stone-600 transition active:scale-95"
          >
            <span>Questions? Contact Concierge</span>
          </button>
        </div>
      </section>
    </div>
  );
};
