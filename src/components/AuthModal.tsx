import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, Shield, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalMode, login, register, quickLogin, setCurrentView } = useApp();
  
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [chessUsername, setChessUsername] = useState('');
  const [mode, setMode] = useState<'login' | 'register'>(authModalMode || 'login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await login(email);
        if (!res.success) setError(res.message);
      } else {
        const res = await register(fullName, email, chessUsername);
        if (!res.success) setError(res.message);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl text-white space-y-6 relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/30 text-sky-400 flex items-center justify-center mx-auto text-xl">
            💎
          </div>
          <h3 className="text-2xl font-black font-cinzel text-white">
            {mode === 'login' ? 'Customer Sign In' : 'Create Customer Account'}
          </h3>
          <p className="text-xs text-slate-400">
            Track your Chess.com Diamond membership orders & voucher codes
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'register' && (
            <>
              <div>
                <label className="block font-bold text-slate-300 mb-1">Your Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Magnus Carlsen"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-white focus:border-sky-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Chess.com Username (Optional)</label>
                <div className="relative">
                  <span className="text-xs font-bold text-sky-400 absolute left-3 top-2.5">@</span>
                  <input
                    type="text"
                    placeholder="e.g. MagnusC"
                    value={chessUsername}
                    onChange={e => setChessUsername(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-white focus:border-sky-400 focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block font-bold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-white focus:border-sky-400 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold rounded-xl transition shadow-lg shadow-sky-500/20 disabled:opacity-50"
          >
            {loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        {/* Quick Testing Preset */}
        <div className="pt-2 border-t border-slate-800 space-y-2 text-center">
          <p className="text-[11px] text-slate-400 font-medium">Quick Access Profile:</p>
          <div>
            <button
              onClick={() => quickLogin('customer')}
              className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-sky-300 rounded-xl font-bold transition flex items-center justify-center gap-1.5 border border-slate-700"
            >
              <UserIcon className="w-3.5 h-3.5" /> Customer Demo
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-400">
          {mode === 'login' ? (
            <p>
              New customer?{' '}
              <button 
                type="button"
                onClick={() => setMode('register')} 
                className="text-sky-400 font-bold hover:underline"
              >
                Create Account
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button 
                type="button"
                onClick={() => setMode('login')} 
                className="text-sky-400 font-bold hover:underline"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
