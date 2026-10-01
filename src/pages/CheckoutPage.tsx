import React, { useState } from 'react';
import { 
  CheckCircle2, Copy, ExternalLink, ShieldCheck, 
  ArrowLeft, CreditCard, Sparkles, AlertCircle, 
  Check, User as UserIcon, Mail, Info 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import { PayWithCardButton, PayWithPayPalGoldButton } from '../components/PayWithCardButton';
import { PayPalHostedSection } from '../components/PayPalHostedSection';

export const CheckoutPage: React.FC = () => {
  const { 
    selectedPlan, 
    user, 
    settings, 
    submitOrder, 
    setCurrentView 
  } = useApp();

  const [chessUsername, setChessUsername] = useState(user?.chess_com_username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [paypalTransactionId, setPaypalTransactionId] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'details' | 'payment'>('details');

  const handleGoToPayment = () => {
    setError('');
    setCheckoutStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!selectedPlan) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-2xl font-black font-cinzel text-slate-900">No Plan Selected</h2>
        <p className="text-xs text-slate-500">Please choose a Diamond Membership pass to continue.</p>
        <button
          onClick={() => setCurrentView('home')}
          className="px-6 py-2.5 bg-sky-500 text-slate-950 font-bold rounded-xl text-xs"
        >
          View Diamond Plans
        </button>
      </div>
    );
  }

  const paypalDirectPaymentUrl = 'https://www.paypal.com/ncp/payment/M9DVCWNF6Q6RG?locale.x=en-US&country.x=US';
  const paypalMeLink = `https://paypal.me/${settings.paypal_me_username}/${selectedPlan.price}`;

  const handleOpenPayPalPaymentTab = () => {
    window.open(paypalDirectPaymentUrl, '_blank', 'noopener,noreferrer');
  };

  const handleOrderSubmit = async (autoApprove = false) => {
    setError('');
    if (!chessUsername.trim()) {
      setError('Please enter your Chess.com username.');
      return;
    }
    if (!autoApprove && !paypalTransactionId.trim()) {
      setError('Please enter your PayPal Transaction Reference ID after completing payment.');
      return;
    }

    setLoading(true);
    try {
      const res = await submitOrder(
        chessUsername.trim(),
        paypalTransactionId.trim() || `PP_DEMO_${Date.now()}`,
        autoApprove,
        notes
      );

      if (res.success && res.order) {
        setCompletedOrder(res.order);
      } else {
        setError(res.message || 'Failed to submit order');
      }
    } catch (err: any) {
      setError(err.message || 'Error processing order');
    } finally {
      setLoading(false);
    }
  };

  const copyVoucherCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans">
      <button
        onClick={() => setCurrentView('home')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Plans
      </button>

      {completedOrder ? (
        /* ORDER CONFIRMATION / VOUCHER DELIVERY SCREEN */
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-8 animate-in fade-in duration-300">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black font-cinzel text-slate-900">
              Diamond Order Confirmed!
            </h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Order ID: <span className="font-mono font-bold text-slate-900">{completedOrder.order_id}</span> • Targeted Chess.com Account: <span className="font-bold text-sky-600">@{completedOrder.chess_com_username}</span>
            </p>
          </div>

          {/* Voucher Code Card */}
          {completedOrder.activation_code ? (
            <div className="bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white rounded-2xl p-6 border border-sky-500/40 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Official Chess.com Voucher Key
                </span>
                <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase">
                  Ready to Redeem
                </span>
              </div>

              <div className="bg-slate-950/80 border border-sky-400/30 rounded-xl p-4 flex items-center justify-between gap-4">
                <span className="font-mono text-base sm:text-xl font-bold tracking-widest text-sky-200 select-all">
                  {completedOrder.activation_code}
                </span>
                <button
                  onClick={() => copyVoucherCode(completedOrder.activation_code!)}
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0"
                >
                  {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300">
                <h4 className="font-bold text-white">How to Redeem:</h4>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-300">
                  <li>Visit official membership page: <a href={settings.official_chess_url} target="_blank" rel="noreferrer" className="text-sky-400 underline">chess.com/membership</a></li>
                  <li>Log in to your account <strong>@{completedOrder.chess_com_username}</strong></li>
                  <li>Enter or paste this voucher key to immediately activate your Diamond benefits!</li>
                </ol>
              </div>

              <div className="pt-2 flex justify-end">
                <a
                  href={settings.official_chess_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold rounded-xl transition inline-flex items-center gap-1.5"
                >
                  <span>Go to Chess.com Membership Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-900 space-y-2">
              <h4 className="font-bold text-sm flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-600" /> Pending Admin Verification
              </h4>
              <p className="text-xs text-amber-800 leading-relaxed">
                Your payment reference <span className="font-mono font-bold">{completedOrder.paypal_transaction_id}</span> has been received. Our team verifies orders within 5-15 minutes and will credit Diamond access directly to <strong>@{completedOrder.chess_com_username}</strong>.
              </p>
            </div>
          )}

          <div className="flex justify-center gap-4 pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentView('order-status')}
              className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition"
            >
              Check Order Status Anytime
            </button>
            <button
              onClick={() => setCurrentView('home')}
              className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition"
            >
              Return to Storefront
            </button>
          </div>
        </div>
      ) : checkoutStep === 'payment' ? (
        /* DEDICATED PAYMENT PAGE */
        <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
          <button
            onClick={() => setCheckoutStep('details')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Account Details
          </button>

          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-6 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-sky-600 block">
                  Secure Checkout
                </span>
                <h2 className="text-xl sm:text-2xl font-black font-cinzel text-slate-900">
                  PayPal Payment Page
                </h2>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Buyer Protected
              </span>
            </div>

            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Plan & Account Summary Banner */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-sky-400 block">
                  Activating Diamond Pass
                </span>
                <h3 className="font-bold text-base text-white">{selectedPlan.name}</h3>
                <p className="text-xs text-slate-300">
                  Target account: <span className="font-bold text-sky-300">@{chessUsername || 'Not provided'}</span>
                </p>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-slate-400 block">Total Due</span>
                <span className="font-mono text-2xl font-black text-[#81b64c]">
                  {settings.currency_symbol}{selectedPlan.price}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                Official Payment Gateway:
              </h4>
              <p className="text-xs text-slate-500">
                Complete your transaction below via official PayPal checkout:
              </p>
            </div>

            {/* Official PayPal Hosted Button Container */}
            <PayPalHostedSection 
              hostedButtonId="M9DVCWNF6Q6RG" 
              paypalMeFallbackUrl={paypalDirectPaymentUrl}
            />

            {/* Transaction Reference ID Input */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div>
                <label className="block font-bold text-slate-700 text-xs mb-1">
                  PayPal Transaction Reference ID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={paypalTransactionId}
                  onChange={e => setPaypalTransactionId(e.target.value)}
                  placeholder="e.g. 9X827104KL (from confirmation email or PayPal screen)"
                  style={{ 
                    color: '#000000',
                    WebkitTextFillColor: '#000000',
                    caretColor: '#000000',
                    colorScheme: 'light'
                  }}
                  className="input-typing-black w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-mono text-xs !text-black text-black focus:!text-black focus:text-black focus:border-sky-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Enter your PayPal transaction receipt ID to activate your voucher key.
                </span>
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={() => handleOrderSubmit(false)}
                className="w-full py-3.5 bg-[#81b64c] hover:bg-[#90ca55] text-white font-black rounded-xl text-xs transition shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Submitting Order...' : 'Submit Order & Claim Voucher Key'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* CHECKOUT FORM */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Account Details & Payment */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div>
                <h2 className="text-2xl font-black font-cinzel text-slate-900">
                  Checkout & Activation
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter your target Chess.com account to apply your Diamond membership.
                </p>
              </div>

              {error && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Account Input */}
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Your Chess.com Username <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 font-bold text-sky-500">@</span>
                    <input
                      type="text"
                      required
                      value={chessUsername}
                      onChange={e => setChessUsername(e.target.value)}
                      placeholder="e.g. TacticalKnight99"
                      style={{ 
                        color: '#000000',
                        WebkitTextFillColor: '#000000',
                        caretColor: '#000000',
                        colorScheme: 'light'
                      }}
                      className="input-typing-black w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3.5 py-2.5 font-medium !text-black text-black focus:!text-black focus:text-black focus:border-sky-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                  {chessUsername.trim() && (
                    <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                      <span>Preview account:</span>
                      <a 
                        href={`https://www.chess.com/member/${chessUsername.trim()}`}
                        target="_blank" 
                        rel="noreferrer"
                        className="text-sky-600 underline font-medium hover:text-sky-800 flex items-center gap-0.5"
                      >
                        chess.com/member/{chessUsername.trim()} <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Delivery Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@domain.com"
                      style={{ 
                        color: '#000000',
                        WebkitTextFillColor: '#000000',
                        caretColor: '#000000',
                        colorScheme: 'light'
                      }}
                      className="input-typing-black w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 !text-black text-black font-medium focus:!text-black focus:text-black focus:border-sky-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Notes / Gift Instructions (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="e.g. Please activate as a gift for my tournament prep!"
                    style={{ 
                      color: '#000000',
                      WebkitTextFillColor: '#000000',
                      caretColor: '#000000',
                      colorScheme: 'light'
                    }}
                    className="input-typing-black w-full bg-slate-50 border border-slate-200 rounded-xl p-3 !text-black text-black focus:!text-black focus:text-black focus:border-sky-500 focus:bg-white focus:outline-none text-xs"
                  />
                </div>
              </div>

              {/* Payment Action Box */}
              <div className="border-t border-slate-100 pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-[#1A1F71]" />
                    Card & PayPal Checkout
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Buyer Protected</span>
                </div>

                <div className="bg-transparent space-y-2.5">
                  {/* Official PayPal Button */}
                  <PayWithPayPalGoldButton 
                    amount={selectedPlan.price}
                    currencySymbol={settings.currency_symbol}
                    onClick={handleOpenPayPalPaymentTab}
                  />

                  {/* Visa / Mastercard / Cards Button */}
                  <PayWithCardButton 
                    amount={selectedPlan.price}
                    currencySymbol={settings.currency_symbol}
                    label="Pay with Visa / Mastercard"
                    showPayPal={true}
                    onClick={handleOpenPayPalPaymentTab}
                  />

                  {/* Transaction Reference ID Input */}
                  <div className="pt-2">
                    <label className="block font-bold text-slate-700 text-[11px] mb-1">
                      Transaction Reference ID <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={paypalTransactionId}
                      onChange={e => setPaypalTransactionId(e.target.value)}
                      placeholder="e.g. 9X827104KL (from confirmation email/screen)"
                      style={{ 
                        color: '#000000',
                        WebkitTextFillColor: '#000000',
                        caretColor: '#000000',
                        colorScheme: 'light'
                      }}
                      className="input-typing-black w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 font-mono text-xs !text-black text-black focus:!text-black focus:text-black focus:border-sky-500 focus:outline-none shadow-2xs"
                    />
                  </div>
                </div>

                {/* Submit Order Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleOrderSubmit(false)}
                    className="w-full py-3.5 bg-[#81b64c] hover:bg-[#90ca55] text-white font-black rounded-xl text-xs transition shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? 'Submitting Order...' : 'Submit Order with Transaction ID'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="font-bold font-cinzel text-base">Order Summary</h3>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  {selectedPlan.name}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Regular Chess.com Price:</span>
                  <span className="line-through text-slate-500 font-mono">
                    {settings.currency_symbol}{selectedPlan.original_price}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Chess Shop Discount:</span>
                  <span>-Save {selectedPlan.savings_percent}%</span>
                </div>
                <div className="flex justify-between text-white font-bold text-base pt-3 border-t border-slate-800">
                  <span>Total Due:</span>
                  <span className="font-mono text-xl text-sky-400">
                    {settings.currency_symbol}{selectedPlan.price}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                <span className="font-bold text-slate-300 block text-xs">Package Highlights:</span>
                {selectedPlan.features.slice(0, 4).map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center gap-1 text-slate-300 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                  <span>100% Replacement Warranty</span>
                </div>
                <p>
                  Official Chess.com voucher keys are backed by our full money-back guarantee.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
