import React, { useState, useEffect } from 'react';
import { Smartphone, Copy, Check, X, ShieldAlert, KeyRound, Clock, Lock, Unlock, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SmsDispatchBanner: React.FC = () => {
  const { activeSmsNotice, dismissSmsNotice, isSmsPinUnlocked, verifySmsPin, lockSmsPin } = useApp();
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(300);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  useEffect(() => {
    if (!activeSmsNotice) return;
    const updateCountdown = () => {
      const remaining = Math.max(0, Math.floor((activeSmsNotice.expires_at - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        dismissSmsNotice();
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [activeSmsNotice, dismissSmsNotice]);

  if (!activeSmsNotice) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeSmsNotice.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUnlockWithPin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (verifySmsPin(pinInput)) {
      setPinError('');
      setPinInput('');
    } else {
      setPinError('Incorrect PIN. Access denied.');
    }
  };

  const handlePinChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '');
    setPinInput(cleaned);
    setPinError('');
    if (cleaned === '181818') {
      verifySmsPin('181818');
      setPinInput('');
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const maskedTo = activeSmsNotice.to.length > 5
    ? `${activeSmsNotice.to.slice(0, 3)} ••• ••• ${activeSmsNotice.to.slice(-3)}`
    : 'Authorized Owner Phone';

  return (
    <aside
      aria-label="SMS Mobile Security Dispatch"
      className="fixed top-20 right-4 z-50 max-w-sm sm:max-w-md w-full animate-in slide-in-from-top duration-300 pointer-events-auto"
    >
      <div className="bg-[#1c1b18]/95 backdrop-blur-md border-2 border-[#81b64c]/80 rounded-2xl shadow-2xl p-4 text-white space-y-3 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#81b64c]/20 rounded-full blur-xl pointer-events-none" />

        {/* Header with carrier & mobile badge */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#81b64c]/20 border border-[#81b64c]/40 text-[#81b64c] flex items-center justify-center">
              <Smartphone className="w-4 h-4 text-[#81b64c]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-wide text-white">
                  Mobitel GSM • Secure SMS
                </span>
                <span className="flex h-2 w-2 rounded-full bg-[#81b64c] animate-ping" />
              </div>
              <p className="text-[10px] text-stone-400 font-mono">
                Recipient: <span className="text-[#81b64c] font-bold">{maskedTo}</span>
              </p>
            </div>
          </div>

          <button
            onClick={dismissSmsNotice}
            className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition"
            title="Dismiss SMS notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message body */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-300 font-sans">
            <span>
              {activeSmsNotice.purpose === 'login_2fa'
                ? 'Owner Dynamic 2FA Passcode'
                : 'Credential Reset Passcode'}
            </span>
            <span className="text-[10px] text-[#f5d997] font-semibold bg-[#2e2617] px-2 py-0.5 rounded border border-[#5c4a29]">
              Confidential (Owner Only)
            </span>
          </div>

          {/* Passcode Display (Protected by PIN 181818) */}
          <div className="bg-black/60 border border-[#81b64c]/40 rounded-xl p-3">
            {!isSmsPinUnlocked ? (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#e6b34a]" />
                    <span className="font-mono text-xl tracking-widest text-stone-400 font-bold select-none">
                      ••••••
                    </span>
                  </div>
                  <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-amber-950/70 text-amber-300 border border-amber-800/60 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-amber-300" />
                    <span>PIN Required to see</span>
                  </span>
                </div>

                <form onSubmit={handleUnlockWithPin} className="space-y-1.5 pt-1">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <KeyRound className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-2.5" />
                      <input
                        type="password"
                        maxLength={6}
                        value={pinInput}
                        onChange={(e) => handlePinChange(e.target.value)}
                        placeholder="Enter Owner PIN"
                        className="w-full bg-[#12110f] border border-stone-700 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-white font-mono tracking-wider focus:border-[#81b64c] focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-[#81b64c] hover:bg-[#92cc57] text-black font-black text-xs rounded-lg transition shrink-0 shadow flex items-center gap-1"
                    >
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Unlock</span>
                    </button>
                  </div>

                  {pinError ? (
                    <div className="flex items-center gap-1 text-[11px] text-rose-400 font-medium">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{pinError}</span>
                    </div>
                  ) : (
                    <p className="text-[10px] text-stone-400">
                      Confidential owner security PIN required to view this number
                    </p>
                  )}
                </form>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <KeyRound className="w-4 h-4 text-[#81b64c]" />
                  <span className="font-mono text-xl sm:text-2xl font-black tracking-widest text-[#81b64c] select-all">
                    {activeSmsNotice.code}
                  </span>
                  <button
                    type="button"
                    onClick={lockSmsPin}
                    className="p-1 rounded text-stone-400 hover:text-white transition"
                    title="Lock number again"
                  >
                    <Lock className="w-4 h-4 text-stone-400 hover:text-amber-400" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline-block text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                    PIN Verified
                  </span>
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 bg-[#81b64c] hover:bg-[#92cc57] text-black font-black text-xs rounded-lg transition flex items-center gap-1.5 shadow-md"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer info & expiry */}
        <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1 border-t border-stone-800/80">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#81b64c]" />
            <span>Passcode expires in:</span>
            <span className="font-mono font-bold text-stone-200">{formattedTime}</span>
          </div>
          <span className="text-[10px] text-stone-500 italic">
            PIN Protected
          </span>
        </div>
      </div>
    </aside>
  );
};
