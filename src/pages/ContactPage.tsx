import React, { useState } from 'react';
import { 
  Mail, Send, CheckCircle2, MessageSquare, ShieldCheck, 
  User as UserIcon, HelpCircle, MapPin, Globe, 
  Clock, MessageCircle, ExternalLink, Share2 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { InteractiveContactMap } from '../components/InteractiveContactMap';

export const ContactPage: React.FC = () => {
  const { submitContact, settings, user } = useApp();
  
  const [name, setName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [chessUsername, setChessUsername] = useState(user?.chess_com_username || '');
  const [subject, setSubject] = useState('Membership Activation');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitContact(name, email, chessUsername, subject, message);
      setSubmitted(true);
    } catch (err) {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const socialLinks = [
    { name: 'Discord Community', icon: '💬', url: 'https://discord.gg/chess', count: '45,000+ Members' },
    { name: 'Reddit r/chess', icon: '♟️', url: 'https://reddit.com/r/chess', count: 'Discussions' },
    { name: 'Twitter / X', icon: '⚡', url: 'https://x.com/chesscom', count: 'Realtime Updates' },
    { name: 'YouTube Lessons', icon: '▶️', url: 'https://youtube.com', count: 'GM Video Guides' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 font-sans space-y-12 sm:space-y-16 text-stone-200">
      {/* 1. HEADER */}
      <div className="text-center max-w-2xl mx-auto space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#81b64c]/15 border border-[#81b64c]/30 text-[#81b64c] text-xs font-bold uppercase tracking-wider backdrop-blur-md">
          <MessageSquare className="w-3.5 h-3.5 text-[#81b64c]" />
          Support & Concierge Desk
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white font-cinzel tracking-tight leading-tight">
          We&apos;re Here To Assist Your <span className="text-[#81b64c] underline decoration-[#81b64c]/40 underline-offset-8">Chess Journey</span>
        </h1>
        <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
          Have an activation question regarding your Chess.com Diamond membership order, bulk club licensing, or PayPal payment? Our concierge is available 7 days a week.
        </p>
      </div>

      {/* 2. MAIN GRID: CONTACT CHANNELS & INQUIRY FORM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Contact Info & Support Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#24221f]/95 text-stone-200 rounded-3xl p-6 sm:p-8 border border-[#3d3731] shadow-xl space-y-6 backdrop-blur-md">
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#81b64c] uppercase tracking-wider">
                Direct Assistance
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-cinzel text-white">
                Player Support Concierge
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Our support desk is staffed by rated tournament players who understand Chess.com account settings, voucher redemptions, and PayPal transaction verification.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              {/* Email */}
              <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-[#1c1a17] border border-[#38332d]">
                <div className="w-10 h-10 rounded-xl bg-[#81b64c]/15 border border-[#81b64c]/30 flex items-center justify-center text-[#81b64c] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-stone-400 text-[10px] uppercase font-bold block">Official Email</span>
                  <span className="font-bold text-white select-all text-xs sm:text-sm break-all">
                    {settings.support_email}
                  </span>
                  <span className="text-[10px] text-[#81b64c] block mt-0.5 font-medium">Under 24 hours during peak hours</span>
                </div>
              </div>

              {/* Security */}
              <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-[#1c1a17] border border-[#38332d]">
                <div className="w-10 h-10 rounded-xl bg-[#81b64c]/15 border border-[#81b64c]/30 flex items-center justify-center text-[#81b64c] shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-stone-400 text-[10px] uppercase font-bold block">Zero Credential Policy</span>
                  <span className="text-stone-300 text-xs">
                    We never request passwords, session tokens, or private login data.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Location & Concierge Hub */}
          <div className="bg-[#24221f]/95 rounded-3xl p-6 border border-[#3d3731] shadow-xl space-y-4">
            <div className="flex items-center gap-2.5">
              <MapPin className="w-5 h-5 text-[#81b64c]" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Digital Headquarters & Fulfillment
              </h4>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              Operating out of San Francisco, CA with distributed 24/7 digital fulfillment nodes ensuring rapid voucher code delivery across all US time zones.
            </p>

            {/* Stylized Map Preview Card with Real Interactive Google Map */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs px-1">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#81b64c]" /> San Francisco, California
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#81b64c]/20 text-[#81b64c] border border-[#81b64c]/40 font-mono">
                  Online 24/7
                </span>
              </div>
              <InteractiveContactMap />
            </div>
          </div>
        </div>

        {/* Right: Message Form */}
        <div className="lg:col-span-7">
          <div className="bg-[#24221f]/95 rounded-3xl p-6 sm:p-8 border border-[#3d3731] shadow-xl backdrop-blur-md">
            {submitted ? (
              <div className="py-12 text-center space-y-5 animate-in fade-in duration-300">
                <div className="w-16 h-16 rounded-2xl bg-[#81b64c]/20 border border-[#81b64c]/40 text-[#81b64c] flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-cinzel text-white">
                  Message Dispatched!
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong>{name}</strong>. A member of our player support concierge has logged your inquiry and will reply to <span className="font-mono text-[#81b64c] font-bold">{email}</span> shortly.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setMessage('');
                    }}
                    className="min-h-[44px] px-6 py-2.5 bg-gradient-to-r from-[#81b64c] to-[#67913d] hover:from-[#8ec853] text-white rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer shadow-md"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 text-xs">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold font-cinzel text-white">
                    Send An Inquiry
                  </h3>
                  <p className="text-xs text-stone-400 mt-1">
                    Fill in your details below and we will respond promptly with resolution steps.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-stone-300 mb-1.5">
                      Your Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Magnus Carlsen"
                      className="w-full min-h-[44px] bg-[#1c1a17] border border-[#38332d] rounded-xl px-3.5 py-2.5 text-stone-100 placeholder-stone-500 focus:border-[#81b64c] focus:outline-none focus:ring-1 focus:ring-[#81b64c] transition"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-300 mb-1.5">
                      Email Address <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@domain.com"
                      className="w-full min-h-[44px] bg-[#1c1a17] border border-[#38332d] rounded-xl px-3.5 py-2.5 text-stone-100 placeholder-stone-500 focus:border-[#81b64c] focus:outline-none focus:ring-1 focus:ring-[#81b64c] transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-stone-300 mb-1.5">
                      Chess.com Username (Optional)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-[#81b64c] font-bold">@</span>
                      <input
                        type="text"
                        value={chessUsername}
                        onChange={e => setChessUsername(e.target.value)}
                        placeholder="TacticalKnight"
                        className="w-full min-h-[44px] bg-[#1c1a17] border border-[#38332d] rounded-xl pl-8 pr-3.5 py-2.5 text-stone-100 placeholder-stone-500 focus:border-[#81b64c] focus:outline-none focus:ring-1 focus:ring-[#81b64c] transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-300 mb-1.5">
                      Inquiry Category
                    </label>
                    <select
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      className="w-full min-h-[44px] bg-[#1c1a17] border border-[#38332d] rounded-xl px-3.5 py-2.5 text-stone-100 focus:border-[#81b64c] focus:outline-none focus:ring-1 focus:ring-[#81b64c] transition cursor-pointer"
                    >
                      <option value="Membership Activation">Membership Activation</option>
                      <option value="PayPal Transaction Verification">PayPal Transaction Verification</option>
                      <option value="Membership Reactivation To New Username - Account Terminated">Membership Reactivation To New Username - Account Terminated</option>
                      <option value="Eligibility Inquiry">US Citizen Eligibility</option>
                      <option value="General Question">General Inquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-300 mb-1.5">
                    Your Message <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Describe your question or include your PayPal transaction reference ID..."
                    className="w-full bg-[#1c1a17] border border-[#38332d] rounded-xl p-3.5 text-stone-100 placeholder-stone-500 focus:border-[#81b64c] focus:outline-none focus:ring-1 focus:ring-[#81b64c] transition text-xs leading-relaxed"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full min-h-[48px] py-3.5 px-6 bg-gradient-to-r from-[#81b64c] to-[#67913d] hover:from-[#8ec853] hover:to-[#74a145] text-white font-black text-sm rounded-xl shadow-lg shadow-[#81b64c]/25 transition flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50 border border-[#81b64c]/40"
                  >
                    {loading ? (
                      <span>Sending inquiry...</span>
                    ) : (
                      <>
                        <span>Submit Inquiry</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-stone-400 text-center leading-normal">
                  Your information is strictly protected. We never distribute email addresses or contact details.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* 3. SOCIAL & COMMUNITY LINKS */}
      <section className="bg-[#24221f]/95 rounded-3xl p-6 sm:p-8 border border-[#3d3731] shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg sm:text-xl font-bold font-cinzel text-white">
              Connect With The Chess Community
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Join tactical discussions, game review workshops, and community blitz tournaments.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#81b64c] font-bold">
            <Share2 className="w-4 h-4" />
            <span>Active Channels</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {socialLinks.map((s, idx) => (
            <a
              key={idx}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="p-4 rounded-2xl bg-[#1c1a17] border border-[#38332d] hover:border-[#81b64c]/40 transition flex items-center justify-between group active:scale-95 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-[#81b64c] transition">
                    {s.name}
                  </h4>
                  <span className="text-[10px] text-stone-400">{s.count}</span>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-stone-500 group-hover:text-[#81b64c] transition" />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};
