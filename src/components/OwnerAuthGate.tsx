import React, { useState } from 'react';
import { 
  ShieldCheck, Lock, Smartphone, KeyRound, ArrowRight, 
  RotateCcw, CheckCircle, AlertCircle, Eye, EyeOff, User, 
  Sparkles, RefreshCw, Key
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface OwnerAuthGateProps {
  onSuccess?: () => void;
  title?: string;
  subtitle?: string;
}

export const OwnerAuthGate: React.FC<OwnerAuthGateProps> = ({
  onSuccess,
  title = 'Restricted Owner Control Center',
  subtitle = 'Only the verified website owner may access this administrative console.'
}) => {
  const { 
    ownerConfig, 
    sendOwnerLoginOtp, 
    verifyOwnerLoginOtp, 
    requestCredentialChangeOtp, 
    verifyAndChangeCredentials, 
    activeSmsNotice,
    setCurrentView,
    isSmsPinUnlocked
  } = useApp();

  // Mode: 'login' (step 1: user/pass, step 2: 2fa otp) or 'change_credentials' (step 1: request otp, step 2: verify & set new)
  const [viewMode, setViewMode] = useState<'login' | 'change_credentials'>('login');
  
  // Login states - DO NOT PRE-FILL CREDENTIALS FOR PRIVACY AND SECURITY
  const [loginStep, setLoginStep] = useState<1 | 2>(1);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Change Credentials states
  const [changeStep, setChangeStep] = useState<1 | 2>(1);
  const [changeOtp, setChangeOtp] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPhone, setNewPhone] = useState(ownerConfig.phone_number);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Mask phone number for privacy
  const maskedPhone = ownerConfig.phone_number.length > 5 
    ? `${ownerConfig.phone_number.slice(0, 3)} ••• ••• ${ownerConfig.phone_number.slice(-3)}`
    : 'Registered Phone';

  // Step 1: Validate Username & Password, trigger dynamic SMS OTP
  const handleLoginStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const res = await sendOwnerLoginOtp(username, password);
      if (res.success) {
        setLoginStep(2);
        setSuccessMessage(`Dynamic security passcode dispatched via SMS. Enter the code received on your mobile phone.`);
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify Dynamic OTP from phone
  const handleLoginStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const res = await verifyOwnerLoginOtp(otpCode);
      if (res.success) {
        setSuccessMessage('Owner authenticated successfully!');
        if (onSuccess) onSuccess();
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  // Trigger OTP to phone for credential change
  const handleRequestChangeOtp = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const res = await requestCredentialChangeOtp();
      if (res.success) {
        setChangeStep(2);
        setSuccessMessage(`Verification passcode dispatched to ${ownerConfig.phone_number}. Check your mobile SMS.`);
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error requesting SMS code.');
    } finally {
      setLoading(false);
    }
  };

  // Submit new credentials with phone OTP
  const handleSaveNewCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (newPassword !== confirmPassword) {
      setErrorMessage('New password and confirmation do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await verifyAndChangeCredentials(changeOtp, newUsername, newPassword, newPhone);
      if (res.success) {
        setSuccessMessage(res.message);
        setUsername(newUsername);
        setPassword(newPassword);
        setLoginStep(1);
        setViewMode('login');
        setChangeStep(1);
        setChangeOtp('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update owner credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-12 p-6 sm:p-8 bg-[#181715] border-2 border-[#3d3731] rounded-3xl shadow-2xl text-white space-y-6">
      {/* Top Security Banner */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#c99738] to-[#8a6520] text-white flex items-center justify-center mx-auto shadow-xl shadow-[#c99738]/20 border border-[#f5d997]/30">
          <ShieldCheck className="w-8 h-8 text-[#fff4d1]" />
        </div>
        <div>
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#3b2d12] text-[#f5d997] border border-[#7d5f21]">
            <Lock className="w-3 h-3 text-[#f5d997]" /> Sovereign Security Gate
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-cinzel text-white mt-1">
            {title}
          </h2>
          <p className="text-xs text-stone-400 mt-1 max-w-md mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Authorized Owner Mobile Phone Badge */}
      <div className="bg-[#24211c] border border-[#3b352b] rounded-2xl p-3.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#81b64c]/20 border border-[#81b64c]/40 text-[#81b64c] flex items-center justify-center">
            <Smartphone className="w-4 h-4 text-[#81b64c]" />
          </div>
          <div>
            <p className="font-bold text-stone-200 text-[11px] uppercase tracking-wider">
              2FA Security Protocol:
            </p>
            <p className="font-mono text-xs text-stone-400">
              Registered Owner Mobile Device Protected
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-stone-400 bg-stone-900/80 px-2 py-1 rounded-lg border border-stone-800">
          Strict 2FA Enforced
        </span>
      </div>

      {/* Feedback Messages */}
      {errorMessage && (
        <div className="p-3.5 bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs rounded-xl flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 bg-[#81b64c]/15 border border-[#81b64c]/40 text-[#b2f073] text-xs rounded-xl flex items-start gap-2.5">
          <CheckCircle className="w-4 h-4 text-[#81b64c] shrink-0 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* MODE 1: OWNER LOGIN */}
      {viewMode === 'login' && (
        <>
          {loginStep === 1 ? (
            <form onSubmit={handleLoginStep1} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-300">
                  Owner Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Enter owner username"
                    className="w-full bg-[#12110f] border border-stone-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white focus:border-[#81b64c] focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-300">
                  Owner Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter owner password"
                    className="w-full bg-[#12110f] border border-stone-700 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white focus:border-[#81b64c] focus:outline-none font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-stone-500 hover:text-stone-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-[#c99738] to-[#8a6520] hover:from-[#d8a543] hover:to-[#9b7226] text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 border border-[#f5d997]/40 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying & Sending SMS...</span>
                  </>
                ) : (
                  <>
                    <span>Verify Credentials & Send SMS Passcode</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Step 2: Dynamic Passcode Verification */
            <form onSubmit={handleLoginStep2} className="space-y-4">
              <div className="p-3 bg-[#24211c] border border-[#81b64c]/40 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#b2f073]">
                  <Smartphone className="w-4 h-4 text-[#81b64c]" />
                  <span>Dynamic Passcode Sent to Registered Mobile ({maskedPhone})</span>
                </div>
                <p className="text-[11px] text-stone-300">
                  A dynamic 6-digit login password that changes regularly has been dispatched to your mobile phone.
                </p>
                {activeSmsNotice && (
                  <div className="flex items-center justify-between bg-black/40 px-3 py-1.5 rounded-lg border border-stone-800">
                    <span className="text-[10px] text-stone-400">Passcode Status:</span>
                    {isSmsPinUnlocked ? (
                      <button
                        type="button"
                        onClick={() => setOtpCode(activeSmsNotice.code)}
                        className="text-[11px] font-mono font-bold text-[#81b64c] hover:underline"
                      >
                        Auto-fill Passcode
                      </button>
                    ) : (
                      <span className="text-[10px] font-mono text-amber-300/90 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-amber-400" />
                        <span>Enter Owner PIN on SMS box to view</span>
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-300">
                  Dynamic SMS Passcode
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit code"
                    className="w-full bg-[#12110f] border border-stone-700 rounded-xl pl-9 pr-3.5 py-3 text-center text-lg font-mono tracking-widest text-[#81b64c] font-black focus:border-[#81b64c] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLoginStep(1)}
                  className="w-1/3 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs rounded-xl transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading || otpCode.length < 6}
                  className="w-2/3 py-2.5 bg-gradient-to-r from-[#81b64c] to-[#638e37] hover:from-[#8ec853] hover:to-[#6fa03d] text-white font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Authenticate & Enter</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={async () => {
                    const res = await sendOwnerLoginOtp(username, password);
                    if (res.success) {
                      setSuccessMessage(`New dynamic passcode dispatched to ${maskedPhone}!`);
                    }
                  }}
                  className="text-[11px] text-[#81b64c] hover:underline inline-flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Resend Dynamic Passcode to Phone
                </button>
              </div>
            </form>
          )}

          {/* Switch to Change Credentials */}
          <div className="pt-4 border-t border-stone-800 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => {
                setViewMode('change_credentials');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className="text-[#f5d997] hover:text-white font-medium flex items-center gap-1.5 transition"
            >
              <Key className="w-3.5 h-3.5 text-[#f5d997]" />
              <span>Change Username & Password via Phone</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('home')}
              className="text-stone-400 hover:text-stone-200 transition"
            >
              Exit to Store
            </button>
          </div>
        </>
      )}

      {/* MODE 2: CHANGE USERNAME & PASSWORD VIA PHONE */}
      {viewMode === 'change_credentials' && (
        <div className="space-y-4">
          <div className="bg-[#24211c] border border-stone-800 rounded-xl p-3 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#f5d997]">
              <KeyRound className="w-4 h-4" />
              <span>Owner Security Credential Reset</span>
            </div>
            <p className="text-stone-400 text-[11px] leading-relaxed">
              To update your owner username and password, an SMS verification passcode will be sent to your registered phone ({maskedPhone}).
            </p>
          </div>

          {changeStep === 1 ? (
            <div className="space-y-4">
              <div className="p-3 bg-black/40 border border-stone-800 rounded-xl space-y-1 text-xs">
                <p className="text-stone-400">Registered Owner Mobile:</p>
                <p className="font-mono text-base font-bold text-[#81b64c]">{maskedPhone}</p>
              </div>

              <button
                type="button"
                onClick={handleRequestChangeOtp}
                disabled={loading}
                className="w-full py-3 bg-[#c99738] hover:bg-[#dbab47] text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Smartphone className="w-4 h-4" />
                    <span>Send Verification Passcode to Phone ({maskedPhone})</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSaveNewCredentials} className="space-y-3.5">
              {/* SMS Passcode Input */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-stone-300">
                  <label>SMS Passcode from Phone</label>
                  {activeSmsNotice && (
                    <button
                      type="button"
                      onClick={() => setChangeOtp(activeSmsNotice.code)}
                      className="text-[10px] text-[#81b64c] font-normal hover:underline"
                    >
                      Fill {activeSmsNotice.code}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={changeOtp}
                    onChange={e => setChangeOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="6-digit code"
                    className="w-full bg-[#12110f] border border-stone-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs font-mono font-bold text-[#81b64c] focus:border-[#81b64c] focus:outline-none"
                  />
                </div>
              </div>

              {/* New Username */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-300">
                  New Owner Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={newUsername}
                    onChange={e => setNewUsername(e.target.value)}
                    placeholder="Enter new username"
                    className="w-full bg-[#12110f] border border-stone-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white focus:border-[#81b64c] focus:outline-none"
                  />
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-300">
                  New Owner Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full bg-[#12110f] border border-stone-700 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white focus:border-[#81b64c] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-2.5 text-stone-500 hover:text-stone-300"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-300">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Re-type new password"
                    className="w-full bg-[#12110f] border border-stone-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white focus:border-[#81b64c] focus:outline-none"
                  />
                </div>
              </div>

              {/* (Optional) Phone Number */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-300">
                  Owner Mobile Phone Number
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={newPhone}
                    onChange={e => setNewPhone(e.target.value)}
                    placeholder="+94 ••• ••• •••"
                    className="w-full bg-[#12110f] border border-stone-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white font-mono focus:border-[#81b64c] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setChangeStep(1)}
                  className="w-1/3 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs rounded-xl transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading || changeOtp.length < 6 || !newUsername || !newPassword}
                  className="w-2/3 py-2.5 bg-gradient-to-r from-[#c99738] to-[#8a6520] hover:from-[#d8a543] hover:to-[#9b7226] text-white font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Save New Credentials</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="pt-3 border-t border-stone-800 text-center">
            <button
              type="button"
              onClick={() => {
                setViewMode('login');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className="text-xs text-stone-400 hover:text-white transition"
            >
              Cancel & Return to Owner Sign In
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
