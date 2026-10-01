import React, { useState, useMemo } from 'react';
import { 
  Shield, DollarSign, Users, CheckCircle2, XCircle, 
  Clock, Sparkles, Settings as SettingsIcon, Mail, 
  ExternalLink, Edit, Check, AlertCircle, RefreshCw, Database,
  Lock, KeyRound, Smartphone, Key, TrendingUp, BarChart3,
  Calendar, ChevronDown, ChevronUp, ArrowUpRight, RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order, DiamondPlan } from '../types';
import { OwnerAuthGate } from '../components/OwnerAuthGate';

export type RevenuePeriod = 'today' | '1m' | '3m' | '6m' | '1y' | 'all';

export interface RevenuePeriodConfig {
  id: RevenuePeriod;
  label: string;
  short: string;
  badge: string;
  desc: string;
}

export const REVENUE_PERIODS: RevenuePeriodConfig[] = [
  { id: 'today', label: "Today's Income", short: "Today", badge: "24h Live", desc: "Today / Past 24 hours" },
  { id: '1m', label: "1 Month Income", short: "1 Month", badge: "Past 30d", desc: "Past 30 days" },
  { id: '3m', label: "3 Months Income", short: "3 Months", badge: "Past 90d", desc: "Past 90 days" },
  { id: '6m', label: "6 Months Income", short: "6 Months", badge: "Past 180d", desc: "Past 180 days" },
  { id: '1y', label: "1 Year Income", short: "1 Year", badge: "Past 365d", desc: "Past 365 days" },
  { id: 'all', label: "All-Time Income", short: "All-Time", badge: "Lifetime", desc: "All historical verified revenue" },
];

export const AdminDashboardPage: React.FC = () => {
  const { 
    orders, 
    plans, 
    contactMessages, 
    settings, 
    approveOrder, 
    rejectOrder, 
    setOrderRejectionReason,
    rejectionReasons,
    addRejectionReason,
    deleteRejectionReason,
    resetRevenue,
    updateSettings, 
    updatePlanPrice,
    setIsBackendHubOpen,
    ownerConfig,
    isOwnerAuthenticated,
    logoutOwner,
    requestCredentialChangeOtp,
    verifyAndChangeCredentials,
    activeSmsNotice,
    isSmsPinUnlocked
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'revenue' | 'plans' | 'inquiries' | 'settings' | 'security'>('orders');
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [revenuePeriod, setRevenuePeriod] = useState<RevenuePeriod>('all');
  const [showPeriodBreakdown, setShowPeriodBreakdown] = useState<boolean>(false);
  const [showResetRevenueModal, setShowResetRevenueModal] = useState<boolean>(false);
  const [resetNotification, setResetNotification] = useState<string>('');
  const [customVoucherInput, setCustomVoucherInput] = useState<Record<string, string>>({});
  
  // Rejection Reason Modal States
  const [rejectModalOrder, setRejectModalOrder] = useState<Order | null>(null);
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [customReasonInput, setCustomReasonInput] = useState<string>('');
  const [saveAsTemplate, setSaveAsTemplate] = useState<boolean>(true);
  const [isCreatingCustom, setIsCreatingCustom] = useState<boolean>(false);

  const openRejectModal = (order: Order) => {
    setRejectModalOrder(order);
    const initialReason = order.rejection_reason || rejectionReasons[0];
    setSelectedReason(initialReason);
    setCustomReasonInput('');
    setIsCreatingCustom(false);
  };

  const handleConfirmReject = () => {
    if (!rejectModalOrder) return;
    let finalReason = selectedReason.trim();

    if (isCreatingCustom && customReasonInput.trim()) {
      finalReason = customReasonInput.trim();
      if (saveAsTemplate) {
        addRejectionReason(customReasonInput.trim());
      }
    }

    if (!finalReason) {
      finalReason = rejectionReasons[0];
    }

    rejectOrder(rejectModalOrder.order_id, finalReason);
    setRejectModalOrder(null);
  };

  // Settings Form
  const [settingsForm, setSettingsForm] = useState({ ...settings });
  const [savedSettingsSuccess, setSavedSettingsSuccess] = useState(false);

  // In-Dashboard Credential Change States
  const [changeOtp, setChangeOtp] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPhone, setNewPhone] = useState(ownerConfig?.phone_number || '+94718080807');
  const [credOtpSent, setCredOtpSent] = useState(false);
  const [credError, setCredError] = useState('');
  const [credSuccess, setCredSuccess] = useState('');
  const [credLoading, setCredLoading] = useState(false);

  // If not authenticated as the owner via credentials + SMS OTP, block access!
  if (!isOwnerAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <OwnerAuthGate
          title="Owner Administration Desk"
          subtitle="Access is restricted solely to the verified website owner. Please authenticate with your username, password, and the dynamic SMS passcode sent to your mobile phone."
        />
      </div>
    );
  }

  // Financial Metrics & Multi-Period Revenue Tracking
  const approvedOrders = orders.filter(o => o.payment_status === 'verified' || o.payment_status === 'approved' || o.payment_status === 'activated');
  const totalRevenue = approvedOrders.reduce((sum, o) => sum + o.amount, 0);
  const pendingOrders = orders.filter(o => o.payment_status === 'pending');

  const isOrderInPeriod = (order: Order, period: RevenuePeriod, now = new Date()): boolean => {
    if (period === 'all') return true;
    const dateStr = order.verified_at || order.created_at;
    if (!dateStr) return false;
    const orderDate = new Date(dateStr);
    if (isNaN(orderDate.getTime())) return false;

    const nowTime = now.getTime();
    const orderTime = orderDate.getTime();
    const diffMs = nowTime - orderTime;
    if (diffMs < 0) return true; // Clock skew protection

    switch (period) {
      case 'today': {
        const isSameCalendarDay = 
          orderDate.getFullYear() === now.getFullYear() &&
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getDate() === now.getDate();
        return isSameCalendarDay || diffMs <= 24 * 60 * 60 * 1000;
      }
      case '1m':
        return diffMs <= 30 * 24 * 60 * 60 * 1000;
      case '3m':
        return diffMs <= 90 * 24 * 60 * 60 * 1000;
      case '6m':
        return diffMs <= 180 * 24 * 60 * 60 * 1000;
      case '1y':
        return diffMs <= 365 * 24 * 60 * 60 * 1000;
      default:
        return true;
    }
  };

  const revenueStats = useMemo(() => {
    const now = new Date();
    const map: Record<RevenuePeriod, { total: number; count: number; orders: Order[] }> = {
      today: { total: 0, count: 0, orders: [] },
      '1m': { total: 0, count: 0, orders: [] },
      '3m': { total: 0, count: 0, orders: [] },
      '6m': { total: 0, count: 0, orders: [] },
      '1y': { total: 0, count: 0, orders: [] },
      all: { total: 0, count: 0, orders: [] },
    };

    approvedOrders.forEach(o => {
      (['today', '1m', '3m', '6m', '1y', 'all'] as RevenuePeriod[]).forEach(p => {
        if (isOrderInPeriod(o, p, now)) {
          map[p].total += o.amount;
          map[p].count += 1;
          map[p].orders.push(o);
        }
      });
    });

    return map;
  }, [approvedOrders]);

  const activePeriodConfig = REVENUE_PERIODS.find(p => p.id === revenuePeriod) || REVENUE_PERIODS[5];
  const currentPeriodStats = revenueStats[revenuePeriod];

  const filteredOrders = orders.filter(o => {
    if (orderFilter === 'all') return true;
    if (orderFilter === 'pending') return o.payment_status === 'pending';
    if (orderFilter === 'verified') return o.payment_status === 'verified' || o.payment_status === 'approved';
    if (orderFilter === 'rejected') return o.payment_status === 'rejected';
    return true;
  });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    setSavedSettingsSuccess(true);
    setTimeout(() => setSavedSettingsSuccess(false), 2500);
  };

  const handleRequestDashboardOtp = async () => {
    setCredError('');
    setCredSuccess('');
    setCredLoading(true);
    try {
      const res = await requestCredentialChangeOtp();
      if (res.success) {
        setCredOtpSent(true);
        setCredSuccess(`Verification passcode dispatched to registered phone ${ownerConfig.phone_number}.`);
      } else {
        setCredError(res.message);
      }
    } catch (err: any) {
      setCredError(err.message || 'Failed to dispatch SMS passcode.');
    } finally {
      setCredLoading(false);
    }
  };

  const handleUpdateOwnerCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setCredError('');
    setCredSuccess('');

    if (newPassword !== confirmPassword) {
      setCredError('New password and confirmation do not match.');
      return;
    }

    setCredLoading(true);
    try {
      const res = await verifyAndChangeCredentials(changeOtp, newUsername, newPassword, newPhone);
      if (res.success) {
        setCredSuccess(res.message);
        setChangeOtp('');
        setNewPassword('');
        setConfirmPassword('');
        setCredOtpSent(false);
      } else {
        setCredError(res.message);
      }
    } catch (err: any) {
      setCredError(err.message || 'Failed to update credentials.');
    } finally {
      setCredLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#3b2d12] text-[#f5d997] border border-[#7d5f21] text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <Shield className="w-3 h-3 text-[#f5d997]" /> Sovereign Owner Console
            </span>
            <span className="text-xs text-stone-400 font-mono">Chess Shop Security v2.0</span>
          </div>
          <h1 className="text-3xl font-black font-cinzel text-white mt-1">
            Diamond Administration Desk
          </h1>
          <p className="text-xs text-stone-400 mt-0.5">
            Manage Chess.com Diamond memberships, verify PayPal payments, manage pricing, and maintain owner security credentials.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Owner Identity & Phone Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#24211c] border border-[#81b64c]/40 rounded-xl text-xs">
            <div className="w-2 h-2 rounded-full bg-[#81b64c] animate-pulse" />
            <div>
              <span className="text-[9px] uppercase font-bold text-[#81b64c] block -mb-0.5">Owner Verified</span>
              <span className="font-mono font-bold text-white">{ownerConfig.username}</span>
              <span className="text-stone-400 text-[10px] ml-1">({ownerConfig.phone_number})</span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
              activeTab === 'security'
                ? 'bg-gradient-to-r from-[#c99738] to-[#9b7226] text-white border-[#f5d997]'
                : 'bg-[#2a2620] hover:bg-[#38322a] text-[#f5d997] border-[#5e4b28]'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-[#f5d997]" />
            <span>Owner Security & 2FA</span>
          </button>

          <button
            onClick={() => setIsBackendHubOpen(true)}
            className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <Database className="w-3.5 h-3.5 text-[#81b64c]" />
            <span>Google Sheets</span>
          </button>

          <button
            onClick={() => setShowResetRevenueModal(true)}
            className="px-3 py-2 bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border border-amber-800/60 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            title="Reset tracked Diamond Membership revenue"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset Revenue</span>
          </button>

          <button
            onClick={logoutOwner}
            className="px-3 py-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            title="Lock Console & Log Out Owner"
          >
            <Lock className="w-3.5 h-3.5 text-rose-400" />
            <span>Lock Desk</span>
          </button>
        </div>
      </div>

      {/* Revenue Reset Notification Banner */}
      {resetNotification && (
        <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/50 rounded-2xl text-emerald-300 text-xs flex items-center justify-between gap-2 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{resetNotification}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setResetNotification('')} 
            className="text-emerald-400 hover:text-white text-xs px-2 py-0.5 rounded cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Diamond Revenue Card with 6-Period Real-Time Switcher */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2.5 transition-all hover:border-emerald-300">
          <div className="flex items-center justify-between text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-700">Diamond Revenue</span>
              <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-mono text-[9px] font-bold border border-emerald-200">
                {activePeriodConfig.short}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowResetRevenueModal(true)}
                className="text-[10px] font-bold text-slate-500 hover:text-amber-700 hover:bg-amber-50 px-2 py-0.5 rounded-lg border border-slate-200 hover:border-amber-200 transition flex items-center gap-1 cursor-pointer"
                title="Reset tracked Diamond revenue"
              >
                <RotateCcw className="w-3 h-3 text-amber-600" />
                <span>Reset</span>
              </button>
              <button
                type="button"
                onClick={() => setShowPeriodBreakdown(prev => !prev)}
                className="text-[10px] font-bold text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 px-2 py-0.5 rounded-lg border border-slate-200 hover:border-emerald-200 transition flex items-center gap-1 cursor-pointer"
                title="Toggle breakdown for Today, 1M, 3M, 6M, 1Y, and All-Time"
              >
                <BarChart3 className="w-3 h-3 text-emerald-600" />
                <span>{showPeriodBreakdown ? 'Hide' : 'Compare'}</span>
              </button>
              <div className="w-7 h-7 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl sm:text-3xl font-black font-cinzel text-slate-900 tracking-tight">
                {settings.currency_symbol}{currentPeriodStats.total.toFixed(2)}
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full font-mono">
                {currentPeriodStats.count} {currentPeriodStats.count === 1 ? 'sale' : 'sales'}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">
              {activePeriodConfig.label}: {currentPeriodStats.count} verified memberships ({activePeriodConfig.desc})
            </p>
          </div>

          {/* 6 Income Period Switcher Buttons */}
          <div className="pt-2 border-t border-slate-100 space-y-1.5">
            <div className="flex items-center justify-between text-[9px] text-slate-400 font-bold uppercase tracking-wider">
              <span>Select Period:</span>
              <button 
                type="button"
                onClick={() => setActiveTab('revenue')}
                className="text-[#81b64c] hover:underline flex items-center gap-0.5 normal-case cursor-pointer font-bold"
              >
                <span>Full report</span>
                <ArrowUpRight className="w-2.5 h-2.5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-1 bg-slate-100/80 p-1 rounded-xl">
              {REVENUE_PERIODS.map(period => {
                const isSelected = revenuePeriod === period.id;
                const stat = revenueStats[period.id];
                return (
                  <button
                    key={period.id}
                    type="button"
                    onClick={() => setRevenuePeriod(period.id)}
                    className={`py-1.5 px-1 rounded-lg text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#81b64c] text-white shadow-xs font-black ring-1 ring-[#81b64c]'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/80 font-bold'
                    }`}
                    title={`${period.label} - ${settings.currency_symbol}${stat.total.toFixed(2)} (${stat.count} orders)`}
                  >
                    <div className="text-[10px] leading-tight">{period.short}</div>
                    <div className={`text-[8.5px] font-mono leading-tight mt-0.5 ${isSelected ? 'text-white/95' : 'text-slate-500'}`}>
                      {settings.currency_symbol}{stat.total}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Expandable Period Comparison Drawer */}
          {showPeriodBreakdown && (
            <div className="pt-2.5 border-t border-slate-200 space-y-1.5 bg-slate-50 -mx-5 -mb-5 p-3.5 rounded-b-2xl animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                <span className="text-[10px] font-bold text-slate-700 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-600" />
                  All 6 Revenue Tiers
                </span>
                <span className="text-[9px] font-mono text-slate-400">
                  {settings.currency}
                </span>
              </div>

              <div className="space-y-1 max-h-48 overflow-y-auto pr-0.5">
                {REVENUE_PERIODS.map(p => {
                  const s = revenueStats[p.id];
                  const isCur = revenuePeriod === p.id;
                  const pct = revenueStats.all.total > 0 ? Math.round((s.total / revenueStats.all.total) * 100) : 0;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setRevenuePeriod(p.id)}
                      className={`flex items-center justify-between p-1.5 rounded-lg text-[10px] cursor-pointer transition ${
                        isCur ? 'bg-emerald-100/80 text-emerald-950 font-bold border border-emerald-300' : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${isCur ? 'bg-emerald-600' : 'bg-slate-300'}`} />
                        <span>{p.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-[8.5px] font-mono">{pct}%</span>
                        <span className="font-mono font-bold text-slate-900">{settings.currency_symbol}{s.total.toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-wider">Pending Orders</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black font-cinzel text-slate-900">
            {pendingOrders.length}
          </div>
          <p className="text-[10px] text-amber-600 font-medium">Awaiting PayPal payment verification</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-wider">Total Orders</span>
            <Sparkles className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-black font-cinzel text-slate-900">
            {orders.length}
          </div>
          <p className="text-[10px] text-slate-500 font-medium">Across all Diamond duration tiers</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-wider">Customer Inquiries</span>
            <Mail className="w-4 h-4 text-violet-500" />
          </div>
          <div className="text-2xl font-black font-cinzel text-slate-900">
            {contactMessages.length}
          </div>
          <p className="text-[10px] text-violet-600 font-medium">Direct questions to {settings.support_email}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`py-3 px-4 border-b-2 transition ${
            activeTab === 'orders'
              ? 'border-indigo-600 text-indigo-600 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Orders & Vouchers ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('revenue')}
          className={`py-3 px-4 border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'revenue'
              ? 'border-emerald-600 text-emerald-600 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Revenue Analytics ({settings.currency_symbol}{currentPeriodStats.total.toFixed(0)})</span>
        </button>
        <button
          onClick={() => setActiveTab('plans')}
          className={`py-3 px-4 border-b-2 transition ${
            activeTab === 'plans'
              ? 'border-indigo-600 text-indigo-600 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Pricing & Plans ({plans.length})
        </button>
        <button
          onClick={() => setActiveTab('inquiries')}
          className={`py-3 px-4 border-b-2 transition ${
            activeTab === 'inquiries'
              ? 'border-indigo-600 text-indigo-600 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Inquiries ({contactMessages.length})
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`py-3 px-4 border-b-2 transition ${
            activeTab === 'settings'
              ? 'border-indigo-600 text-indigo-600 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Store Settings
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`py-3 px-4 border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'security'
              ? 'border-[#c99738] text-[#c99738] font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5 text-[#c99738]" />
          <span>Owner Security & 2FA Phone</span>
        </button>
      </div>

      {/* TAB 1: ORDERS & VOUCHERS DESK */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              {(['all', 'pending', 'verified', 'rejected'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setOrderFilter(tab)}
                  className={`px-3 py-1 rounded-lg capitalize transition ${
                    orderFilter === tab
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <span className="text-xs text-slate-400">
              Showing {filteredOrders.length} orders
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                    <th className="py-3.5 px-4">Order ID</th>
                    <th className="py-3.5 px-4">Chess.com Account</th>
                    <th className="py-3.5 px-4">Plan & Amount</th>
                    <th className="py-3.5 px-4">PayPal Ref</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No orders in this category.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order: Order) => (
                      <tr key={order.order_id} className="hover:bg-slate-50/60">
                        <td className="py-4 px-4 font-mono font-bold text-slate-900">
                          {order.order_id}
                          <span className="block text-[10px] text-slate-400 font-sans font-normal">
                            {new Date(order.created_at).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <a
                            href={`https://www.chess.com/member/${order.chess_com_username}`}
                            target="_blank"
                            rel="noreferrer"
                            className="font-bold text-sky-600 hover:underline inline-flex items-center gap-1"
                          >
                            @{order.chess_com_username} <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                          <span className="block text-[10px] text-slate-400">{order.user_email}</span>
                        </td>
                        <td className="py-4 px-4 font-medium text-slate-900">
                          {order.item_title}
                          <span className="block font-bold text-emerald-600 font-mono text-[11px]">
                            {order.currency} ${order.amount}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-mono text-[11px] text-slate-700">
                          {order.paypal_transaction_id}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col items-start gap-1">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase inline-flex items-center gap-1 ${
                              order.payment_status === 'verified' || order.payment_status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : order.payment_status === 'rejected'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {order.payment_status === 'verified' || order.payment_status === 'approved'
                                ? 'Activated'
                                : order.payment_status}
                            </span>

                            {order.payment_status === 'rejected' ? (
                              <div className="mt-1 p-2 bg-rose-50 border border-rose-200/80 rounded-xl text-[10px] text-rose-900 max-w-xs space-y-1">
                                <div className="flex items-center justify-between font-bold text-rose-800 gap-1">
                                  <span className="flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3 text-rose-600 shrink-0" /> Reason:
                                  </span>
                                  <button
                                    onClick={() => openRejectModal(order)}
                                    className="text-[9px] text-rose-700 hover:text-rose-900 underline font-semibold flex items-center gap-0.5 cursor-pointer"
                                    title="Edit rejection reason"
                                  >
                                    <Edit className="w-2.5 h-2.5" /> Edit
                                  </button>
                                </div>
                                <p className="line-clamp-3 leading-snug font-sans text-rose-800">
                                  {order.rejection_reason || rejectionReasons[0]}
                                </p>
                              </div>
                            ) : order.payment_status === 'pending' ? (
                              <button
                                onClick={() => openRejectModal(order)}
                                className="text-[10px] text-slate-500 hover:text-rose-700 font-medium hover:underline flex items-center gap-1 mt-0.5 cursor-pointer"
                                title="Admin option: Set rejection reason"
                              >
                                <span>+ Set Reject Reason</span>
                              </button>
                            ) : null}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          {order.payment_status === 'pending' ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => approveOrder(order.order_id)}
                                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                                title="Approve payment & issue Diamond membership"
                              >
                                <Check className="w-3 h-3" /> Approve
                              </button>
                              <button
                                onClick={() => openRejectModal(order)}
                                className="px-2.5 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg text-[11px] font-bold transition cursor-pointer"
                                title="Reject payment & configure reason"
                              >
                                Reject
                              </button>
                            </div>
                          ) : order.payment_status === 'rejected' ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => openRejectModal(order)}
                                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold transition cursor-pointer"
                                title="Change rejection reason"
                              >
                                Reason
                              </button>
                              <button
                                onClick={() => approveOrder(order.order_id)}
                                className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-bold transition cursor-pointer"
                                title="Reactivate order"
                              >
                                Activate
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">Settled</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: REVENUE ANALYTICS & MULTI-PERIOD INCOME */}
      {activeTab === 'revenue' && (
        <div className="space-y-6">
          {/* Revenue Analytics Header */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider border border-emerald-200 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-emerald-600" /> Executive Financial Ledger
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Real-Time Sync</span>
                </div>
                <h3 className="text-2xl font-black font-cinzel text-slate-900 mt-1">
                  Income & Revenue Performance
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Detailed earnings overview for Today, 1 Month, 3 Months, 6 Months, 1 Year, and All-Time.
                </p>
              </div>

              {/* Active Selection Badge & Reset Button */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowResetRevenueModal(true)}
                  className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  title="Reset tracked revenue metrics"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                  <span>Reset Revenue</span>
                </button>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Focus</span>
                  <span className="text-sm font-black text-emerald-700">{activePeriodConfig.label}</span>
                </div>
                <div className="px-3 py-2 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="text-xl font-black font-cinzel text-emerald-900">
                    {settings.currency_symbol}{currentPeriodStats.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* 6 Large Interactive Period Revenue Cards */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Select Income Timeframe to Filter Orders:
                </span>
                <span className="text-xs text-slate-400">
                  Click any card to filter the transaction audit below
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {REVENUE_PERIODS.map(period => {
                  const stat = revenueStats[period.id];
                  const isSelected = revenuePeriod === period.id;
                  const percentOfAll = revenueStats.all.total > 0
                    ? Math.round((stat.total / revenueStats.all.total) * 100)
                    : 0;

                  return (
                    <div
                      key={period.id}
                      onClick={() => setRevenuePeriod(period.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                        isSelected
                          ? 'bg-gradient-to-b from-emerald-50/90 to-white border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                          : 'bg-slate-50/70 hover:bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-0 left-0 right-0 h-1 bg-[#81b64c]" />
                      )}

                      <div>
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className={isSelected ? 'text-emerald-900 font-black' : 'text-slate-700'}>
                            {period.label}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                          {period.badge}
                        </span>

                        <div className="text-2xl font-black font-cinzel text-slate-900 mt-3 tracking-tight">
                          {settings.currency_symbol}{stat.total.toFixed(2)}
                        </div>
                      </div>

                      <div className="mt-4 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                        <span className="text-slate-500 font-medium">
                          {stat.count} {stat.count === 1 ? 'order' : 'orders'}
                        </span>
                        <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                          {percentOfAll}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Income Comparison Distribution Bars */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
                  Comparative Income Distribution vs Lifetime All-Time
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">
                  Lifetime Total: {settings.currency_symbol}{revenueStats.all.total.toFixed(2)}
                </span>
              </div>

              <div className="space-y-2">
                {REVENUE_PERIODS.map(p => {
                  const stat = revenueStats[p.id];
                  const pct = revenueStats.all.total > 0
                    ? Math.min(100, Math.round((stat.total / revenueStats.all.total) * 100))
                    : 0;
                  const isCurrent = revenuePeriod === p.id;

                  return (
                    <div 
                      key={p.id}
                      onClick={() => setRevenuePeriod(p.id)}
                      className={`p-2.5 rounded-xl transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                        isCurrent ? 'bg-white shadow-xs border border-emerald-300' : 'hover:bg-white/60'
                      }`}
                    >
                      <div className="w-40 sm:w-48 flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-emerald-600' : 'bg-slate-300'}`} />
                        <span className={`text-xs ${isCurrent ? 'font-black text-slate-900' : 'font-medium text-slate-700'}`}>
                          {p.label}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">({p.short})</span>
                      </div>

                      <div className="flex-1 max-w-md mx-2">
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isCurrent ? 'bg-[#81b64c]' : 'bg-slate-400'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-3 min-w-[140px] text-right">
                        <span className="text-xs text-slate-400 font-mono">{stat.count} orders</span>
                        <span className="text-xs font-mono font-bold text-slate-900">
                          {settings.currency_symbol}{stat.total.toFixed(2)}
                        </span>
                        <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded w-10 text-center">
                          {pct}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Orders list for the selected period */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h4 className="text-lg font-bold font-cinzel text-slate-900 flex items-center gap-2">
                  <span>Transactions in {activePeriodConfig.label}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold">
                    {currentPeriodStats.orders.length} verified
                  </span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Showing all verified and activated orders completed within {activePeriodConfig.desc.toLowerCase()}.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Period Subtotal:</span>
                <span className="text-lg font-black font-cinzel text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                  {settings.currency_symbol}{currentPeriodStats.total.toFixed(2)}
                </span>
              </div>
            </div>

            {currentPeriodStats.orders.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <Clock className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-700">No verified sales found in {activePeriodConfig.label}.</p>
                <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                  Orders will automatically appear here once approved or when new PayPal payments are completed.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-6 -mb-6">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                      <th className="py-3 px-6">Order ID</th>
                      <th className="py-3 px-4">Chess.com Username</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Date & Time</th>
                      <th className="py-3 px-4">PayPal Ref</th>
                      <th className="py-3 px-4">Voucher Key</th>
                      <th className="py-3 px-6 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentPeriodStats.orders.map(order => (
                      <tr key={order.order_id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-6 font-mono font-bold text-slate-900">
                          {order.order_id}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-800">@{order.chess_com_username}</span>
                          <span className="text-[11px] text-slate-400 block">{order.user_email}</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-700 text-sm">
                          {settings.currency_symbol}{order.amount.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                          {order.verified_at ? new Date(order.verified_at).toLocaleString() : new Date(order.created_at).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-600 text-[11px]">
                          {order.paypal_transaction_id}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-800 text-[11px]">
                          {order.activation_code || 'Voucher Generated'}
                        </td>
                        <td className="py-3.5 px-6 text-right">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Verified
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PLANS & PRICING */}
      {activeTab === 'plans' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold font-cinzel text-slate-900">Diamond Plan Pricing</h3>
            <p className="text-xs text-slate-500">
              Customize the selling price for the official 1-Year Chess.com Diamond membership pass.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((p: DiamondPlan) => (
              <div key={p.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">{p.name}</h4>
                  <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded">
                    {p.duration_label}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-500">Selling Price:</span>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={p.price}
                      onChange={e => updatePlanPrice(p.id, parseFloat(e.target.value) || 0)}
                      className="bg-white border border-slate-200 rounded-xl pl-7 pr-3 py-1.5 text-xs font-mono font-bold text-slate-900 w-28 focus:border-sky-500"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Regular: ${p.original_price}
                  </span>
                </div>

                <p className="text-[11px] text-slate-500">{p.tagline}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CONTACT INQUIRIES */}
      {activeTab === 'inquiries' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden space-y-4 p-6">
          <h3 className="text-xl font-bold font-cinzel text-slate-900">Support Inquiries</h3>
          {contactMessages.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No messages received yet.</p>
          ) : (
            <div className="space-y-3">
              {contactMessages.map(msg => (
                <div key={msg.message_id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{msg.name}</span>
                      <span className="text-slate-400">&lt;{msg.email}&gt;</span>
                      {msg.chess_com_username && (
                        <span className="font-bold text-sky-600">@{msg.chess_com_username}</span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(msg.created_at).toLocaleString()}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800">{msg.subject}</h4>
                  <p className="text-slate-600 bg-white p-3 rounded-xl border border-slate-100 leading-relaxed">
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 max-w-2xl space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold font-cinzel text-slate-900">Payment & Store Settings</h3>
            <p className="text-xs text-slate-500">Configure your PayPal.me username, support email, and Google Apps Script integration.</p>
          </div>

          {savedSettingsSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Settings updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Store Name</label>
              <input
                type="text"
                value={settingsForm.site_name}
                onChange={e => setSettingsForm({ ...settingsForm, site_name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">PayPal.me Username</label>
              <input
                type="text"
                value={settingsForm.paypal_me_username}
                onChange={e => setSettingsForm({ ...settingsForm, paypal_me_username: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-mono"
                placeholder="e.g. chesshop"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Used to construct customer payment link: https://paypal.me/{settingsForm.paypal_me_username}/[amount]
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Official Support Email</label>
              <input
                type="email"
                value={settingsForm.support_email}
                onChange={e => setSettingsForm({ ...settingsForm, support_email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Official Chess.com Membership URL</label>
              <input
                type="text"
                value={settingsForm.official_chess_url}
                onChange={e => setSettingsForm({ ...settingsForm, official_chess_url: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-mono"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 5: OWNER SECURITY & 2FA PHONE */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="bg-[#181715] border border-[#3b352b] rounded-3xl p-6 text-white space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#3b2d12] text-[#f5d997] border border-[#7d5f21]">
                  Strict Owner Access Control
                </span>
                <h2 className="text-xl font-black font-cinzel text-white mt-1">
                  Owner Authentication & Dynamic 2FA Phone Configuration
                </h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  Only the verified site owner with the registered 2FA mobile phone can log in and change owner credentials.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 text-xs font-mono font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Active Owner: {ownerConfig.username}
                </span>
              </div>
            </div>

            {/* Current Security Profile */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#24211c] border border-stone-800 rounded-2xl p-4 space-y-1">
                <div className="flex items-center justify-between text-stone-400 text-xs">
                  <span>Current Username</span>
                  <Shield className="w-4 h-4 text-[#c99738]" />
                </div>
                <p className="font-mono text-lg font-black text-white">{ownerConfig.username}</p>
                <p className="text-[10px] text-stone-500">Confidential Owner Identity</p>
              </div>

              <div className="bg-[#24211c] border border-stone-800 rounded-2xl p-4 space-y-1">
                <div className="flex items-center justify-between text-stone-400 text-xs">
                  <span>Owner Mobile Phone</span>
                  <Smartphone className="w-4 h-4 text-[#81b64c]" />
                </div>
                <p className="font-mono text-lg font-black text-[#81b64c]">
                  {ownerConfig.phone_number.length > 5
                    ? `${ownerConfig.phone_number.slice(0, 3)} ••• ••• ${ownerConfig.phone_number.slice(-3)}`
                    : 'Registered Phone'}
                </p>
                <p className="text-[10px] text-stone-500">Authorized 2FA Device</p>
              </div>

              <div className="bg-[#24211c] border border-stone-800 rounded-2xl p-4 space-y-1">
                <div className="flex items-center justify-between text-stone-400 text-xs">
                  <span>2FA SMS System</span>
                  <KeyRound className="w-4 h-4 text-sky-400" />
                </div>
                <p className="font-mono text-base font-bold text-sky-300">Dynamic OTP (Active)</p>
                <p className="text-[10px] text-stone-500">Changes regularly on every login</p>
              </div>
            </div>

            {/* Credential Reset Workflow */}
            <div className="border border-[#3b352b] bg-[#1f1c18] rounded-2xl p-6 space-y-5">
              <div>
                <h3 className="text-base font-black font-cinzel text-white flex items-center gap-2">
                  <Key className="w-4 h-4 text-[#f5d997]" />
                  Change Owner Username & Password
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  To protect against unauthorized takeovers, changing owner credentials requires entering the one-time passcode dispatched via SMS to your verified registered mobile phone.
                </p>
              </div>

              {credError && (
                <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-200 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{credError}</span>
                </div>
              )}

              {credSuccess && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-700 text-emerald-200 text-xs rounded-xl flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{credSuccess}</span>
                </div>
              )}

              {!credOtpSent ? (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-black/40 border border-stone-800 rounded-xl">
                  <div>
                    <p className="text-xs font-bold text-stone-200">Step 1: Request SMS Security Code</p>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      A 6-digit passcode will be dispatched directly to your registered mobile phone.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRequestDashboardOtp}
                    disabled={credLoading}
                    className="px-4 py-2.5 bg-gradient-to-r from-[#c99738] to-[#8a6520] hover:from-[#d8a543] hover:to-[#9b7226] text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-2 shrink-0 disabled:opacity-50"
                  >
                    {credLoading ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Smartphone className="w-3.5 h-3.5" />
                    )}
                    <span>Send SMS Passcode to Phone</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleUpdateOwnerCredentials} className="space-y-4">
                  <div className="p-3 bg-[#24211c] border border-[#81b64c]/40 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#b2f073]">SMS Passcode Dispatched</p>
                      <p className="text-[11px] text-stone-300">
                        Check your registered mobile phone or the secure SMS banner.
                      </p>
                    </div>
                    {activeSmsNotice && (
                      isSmsPinUnlocked ? (
                        <button
                          type="button"
                          onClick={() => setChangeOtp(activeSmsNotice.code)}
                          className="px-2.5 py-1 bg-[#81b64c] text-black font-mono font-bold text-xs rounded-lg hover:bg-[#92cc57] transition"
                        >
                          Auto-Fill Code
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono text-amber-300/90 flex items-center gap-1 bg-black/40 px-2.5 py-1 rounded-lg border border-stone-800">
                          <Lock className="w-3 h-3 text-amber-400" />
                          <span>Enter Owner PIN on SMS box</span>
                        </span>
                      )
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-stone-300 mb-1">
                        SMS Passcode from Mobile Phone *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={changeOtp}
                        onChange={e => setChangeOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="e.g. 6-digit code"
                        className="w-full bg-[#12110f] border border-stone-700 rounded-xl px-3.5 py-2.5 font-mono text-base tracking-widest text-[#81b64c] font-black focus:border-[#81b64c] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-300 mb-1">
                        New Owner Username *
                      </label>
                      <input
                        type="text"
                        required
                        value={newUsername}
                        onChange={e => setNewUsername(e.target.value)}
                        placeholder="New username"
                        className="w-full bg-[#12110f] border border-stone-700 rounded-xl px-3.5 py-2.5 text-white font-medium focus:border-[#81b64c] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-300 mb-1">
                        New Owner Password *
                      </label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full bg-[#12110f] border border-stone-700 rounded-xl px-3.5 py-2.5 text-white focus:border-[#81b64c] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-300 mb-1">
                        Confirm New Password *
                      </label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="Re-type new password"
                        className="w-full bg-[#12110f] border border-stone-700 rounded-xl px-3.5 py-2.5 text-white focus:border-[#81b64c] focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold text-stone-300 mb-1">
                        Owner Mobile Phone Number
                      </label>
                      <input
                        type="text"
                        required
                        value={newPhone}
                        onChange={e => setNewPhone(e.target.value)}
                        placeholder="+94 ••• ••• •••"
                        className="w-full bg-[#12110f] border border-stone-700 rounded-xl px-3.5 py-2.5 text-white font-mono focus:border-[#81b64c] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={credLoading || changeOtp.length < 6 || !newUsername || !newPassword}
                      className="px-6 py-2.5 bg-gradient-to-r from-[#c99738] to-[#8a6520] hover:from-[#d8a543] hover:to-[#9b7226] text-white font-bold rounded-xl text-xs transition flex items-center gap-2 shadow disabled:opacity-50"
                    >
                      {credLoading ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}
                      <span>Verify SMS Code & Save New Credentials</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCredOtpSent(false)}
                      className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold rounded-xl text-xs transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Revenue Reset Confirmation Modal */}
      {showResetRevenueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 text-slate-900 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
                <RotateCcw className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-black text-base font-cinzel text-slate-900">Reset Diamond Revenue</h3>
                <p className="text-xs text-slate-500">Revenue Ledger Zeroing & Management</p>
              </div>
            </div>

            <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-xs space-y-2 text-amber-950">
              <p className="font-semibold">
                Current Tracked Revenue: <span className="font-mono font-bold text-amber-900">{settings.currency_symbol}{totalRevenue.toFixed(2)}</span> ({approvedOrders.length} verified orders)
              </p>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Choose an action below to reset your earnings analytics across Today, 1M, 3M, 6M, 1Y, and All-Time trackers.
              </p>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  resetRevenue('zero');
                  setShowResetRevenueModal(false);
                  setResetNotification('Revenue successfully reset to $0.00. Verified orders cleared from revenue calculation.');
                  setTimeout(() => setResetNotification(''), 4500);
                }}
                className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Revenue to {settings.currency_symbol}0.00</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  resetRevenue('clear');
                  setShowResetRevenueModal(false);
                  setResetNotification('All orders cleared. Order history and revenue reset to zero.');
                  setTimeout(() => setResetNotification(''), 4500);
                }}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Clear All Orders & Reset</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  resetRevenue('restore');
                  setShowResetRevenueModal(false);
                  setResetNotification('Default sample demonstration orders and revenue restored.');
                  setTimeout(() => setResetNotification(''), 4500);
                }}
                className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Restore Sample Demonstration Revenue</span>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowResetRevenueModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition rounded-xl cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECTION REASON CONFIGURATION MODAL */}
      {rejectModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-xl w-full border border-slate-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-rose-100 text-rose-700 rounded-xl">
                  <AlertCircle className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-black text-slate-900 font-cinzel">
                    Rejection Reason & Notification
                  </h3>
                  <p className="text-xs text-slate-500">
                    Order <span className="font-mono font-bold text-slate-800">{rejectModalOrder.order_id}</span> • User: <span className="font-bold text-sky-600">@{rejectModalOrder.chess_com_username}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setRejectModalOrder(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Presets and Options */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Choose Rejection Reason Preset or Create Option:
              </label>

              <div className="space-y-2">
                {rejectionReasons.map((reason, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setIsCreatingCustom(false);
                      setSelectedReason(reason);
                    }}
                    className={`p-3 rounded-2xl border transition cursor-pointer text-xs ${
                      !isCreatingCustom && selectedReason === reason
                        ? 'bg-rose-50/80 border-rose-300 ring-2 ring-rose-200 text-rose-950 font-medium'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <input
                        type="radio"
                        name="rejection_preset_radio"
                        checked={!isCreatingCustom && selectedReason === reason}
                        onChange={() => {
                          setIsCreatingCustom(false);
                          setSelectedReason(reason);
                        }}
                        className="mt-0.5 text-rose-600 focus:ring-rose-500 cursor-pointer"
                      />
                      <div className="w-full">
                        {idx === 0 && (
                          <span className="inline-block px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-rose-200 text-rose-900 rounded-full mb-1">
                            Primary Option: US Citizens Only Requirement
                          </span>
                        )}
                        <p className="leading-relaxed">{reason}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Option to create a new custom reason */}
                <div
                  onClick={() => setIsCreatingCustom(true)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer text-xs ${
                    isCreatingCustom
                      ? 'bg-rose-50/80 border-rose-300 ring-2 ring-rose-200 text-rose-950'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <input
                      type="radio"
                      name="rejection_preset_radio"
                      checked={isCreatingCustom}
                      onChange={() => setIsCreatingCustom(true)}
                      className="mt-0.5 text-rose-600 focus:ring-rose-500 cursor-pointer"
                    />
                    <div className="w-full">
                      <span className="font-bold text-slate-900 block mb-0.5">
                        + Create New Custom Reason Option
                      </span>
                      <p className="text-[11px] text-slate-500 mb-2">
                        Write a new rejection reason. You can save it to the admin list for one-click use on future orders.
                      </p>

                      {isCreatingCustom && (
                        <div className="space-y-2 mt-2" onClick={e => e.stopPropagation()}>
                          <textarea
                            rows={3}
                            value={customReasonInput}
                            onChange={e => setCustomReasonInput(e.target.value)}
                            placeholder="Type rejection reason details for the customer..."
                            className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-hidden font-sans text-slate-900"
                          />
                          <label className="flex items-center gap-2 text-[11px] text-slate-600 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={saveAsTemplate}
                              onChange={e => setSaveAsTemplate(e.target.checked)}
                              className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                            />
                            <span>Save this reason as a reusable admin template</span>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Editable Selected Reason */}
            {!isCreatingCustom && (
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Edit Reason Text Before Applying:
                </label>
                <textarea
                  rows={3}
                  value={selectedReason}
                  onChange={e => setSelectedReason(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-400 focus:border-rose-400 outline-hidden font-sans text-slate-900 leading-relaxed"
                />
              </div>
            )}

            {/* Customer Status Portal Preview */}
            <div className="p-3.5 bg-rose-50/80 border border-rose-200 rounded-2xl text-xs space-y-1 text-rose-950">
              <span className="font-bold text-[10px] uppercase tracking-wider text-rose-800 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-rose-600" /> Customer Status Portal Preview:
              </span>
              <p className="text-[11px] text-rose-900 leading-relaxed font-sans italic bg-white/80 p-2.5 rounded-xl border border-rose-100">
                "{isCreatingCustom && customReasonInput.trim() ? customReasonInput.trim() : selectedReason || rejectionReasons[0]}"
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRejectModalOrder(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                <span>Apply Rejection</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
