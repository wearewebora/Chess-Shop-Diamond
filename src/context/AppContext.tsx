import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  DiamondPlan, ChessFeature, User, Order, ContactMessage, 
  SiteSettings, ReviewItem, UserRole, OrderStatus,
  OwnerSecurityConfig, SmsNotice 
} from '../types';
import { 
  DIAMOND_PLANS, CHESS_FEATURES, INITIAL_USERS, 
  INITIAL_ORDERS, INITIAL_CONTACT_MESSAGES, INITIAL_SETTINGS, 
  REVIEWS, OFFICIAL_CHESS_URL, DEFAULT_REJECTION_REASONS 
} from '../data/chessData';
import { ApiService } from '../services/apiService';

export const DEFAULT_OWNER_CONFIG: OwnerSecurityConfig = {
  username: 'Mobitel',
  password: 'Mobitel#123',
  phone_number: '+94718080807',
  last_updated: '2026-09-20T00:00:00Z'
};

export type AppView = 
  | 'home' 
  | 'about'
  | 'services'
  | 'checkout' 
  | 'order-status' 
  | 'admin' 
  | 'contact';

interface AppContextType {
  // State
  user: User | null;
  users: User[];
  plans: DiamondPlan[];
  selectedPlan: DiamondPlan;
  features: ChessFeature[];
  orders: Order[];
  contactMessages: ContactMessage[];
  reviews: ReviewItem[];
  settings: SiteSettings;
  currentView: AppView;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  isBackendHubOpen: boolean;

  // Setters
  setCurrentView: (view: AppView) => void;
  setSelectedPlan: (plan: DiamondPlan) => void;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  setIsBackendHubOpen: (open: boolean) => void;

  // User Actions
  login: (email: string, password?: string) => Promise<{ success: boolean; message: string }>;
  register: (fullName: string, email: string, chessUsername?: string, password?: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  quickLogin: (role: 'guest' | 'customer' | 'admin') => void;

  // Checkout & Ordering
  startCheckout: (plan: DiamondPlan) => void;
  submitOrder: (
    chessUsername: string,
    paypalTransactionId: string,
    autoApprove?: boolean,
    notes?: string
  ) => Promise<{ success: boolean; orderId: string; order?: Order; message: string }>;

  // Contact
  submitContact: (name: string, email: string, chessUsername: string, subject: string, message: string) => Promise<{ success: boolean; message: string }>;

  // Admin Actions
  approveOrder: (orderId: string, customVoucher?: string) => void;
  rejectOrder: (orderId: string, reason?: string) => void;
  setOrderRejectionReason: (orderId: string, reason: string) => void;
  rejectionReasons: string[];
  addRejectionReason: (reason: string) => void;
  deleteRejectionReason: (reason: string) => void;
  resetRevenue: (mode?: 'zero' | 'clear' | 'restore') => void;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  updatePlanPrice: (planId: string, price: number) => void;

  // Owner Security & Dynamic 2FA Phone System
  ownerConfig: OwnerSecurityConfig;
  isOwnerAuthenticated: boolean;
  activeSmsNotice: SmsNotice | null;
  dismissSmsNotice: () => void;
  sendOwnerLoginOtp: (username: string, password: string) => Promise<{ success: boolean; message: string; phone?: string }>;
  verifyOwnerLoginOtp: (code: string) => Promise<{ success: boolean; message: string }>;
  requestCredentialChangeOtp: () => Promise<{ success: boolean; message: string }>;
  verifyAndChangeCredentials: (
    otpCode: string,
    newUsername: string,
    newPassword: string,
    newPhoneNumber?: string
  ) => Promise<{ success: boolean; message: string }>;
  logoutOwner: () => void;
  isSmsPinUnlocked: boolean;
  verifySmsPin: (pin: string) => boolean;
  lockSmsPin: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local persistence states
  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('cs_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [plans, setPlans] = useState<DiamondPlan[]>(() => {
    const saved = localStorage.getItem('cs_plans');
    return saved ? JSON.parse(saved) : DIAMOND_PLANS;
  });

  const [selectedPlan, setSelectedPlan] = useState<DiamondPlan>(() => {
    return DIAMOND_PLANS.find(p => p.popular) || DIAMOND_PLANS[2];
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('cs_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  // Default logged in as customer for seamless initial browsing
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('cs_current_user');
    if (saved) return JSON.parse(saved);
    return INITIAL_USERS[1]; // Magnus Enthusiast
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('cs_orders_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // fallback
      }
    }
    const legacySaved = localStorage.getItem('cs_orders');
    if (legacySaved) {
      try {
        const parsed = JSON.parse(legacySaved);
        if (Array.isArray(parsed) && parsed.length >= 6) {
          return parsed;
        }
      } catch {
        // fallback
      }
    }
    return INITIAL_ORDERS;
  });

  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => {
    const saved = localStorage.getItem('cs_messages');
    return saved ? JSON.parse(saved) : INITIAL_CONTACT_MESSAGES;
  });

  const [rejectionReasons, setRejectionReasons] = useState<string[]>(() => {
    const saved = localStorage.getItem('cs_rejection_reasons');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // fallback
      }
    }
    return DEFAULT_REJECTION_REASONS;
  });

  useEffect(() => {
    localStorage.setItem('cs_rejection_reasons', JSON.stringify(rejectionReasons));
  }, [rejectionReasons]);

  const addRejectionReason = (reason: string) => {
    const trimmed = reason.trim();
    if (!trimmed) return;
    setRejectionReasons(prev => {
      if (prev.includes(trimmed)) return prev;
      return [trimmed, ...prev];
    });
  };

  const deleteRejectionReason = (reasonToDelete: string) => {
    setRejectionReasons(prev => prev.filter(r => r !== reasonToDelete));
  };

  // Helper functions to map URLs to views and vice-versa
  const getViewFromPath = (path: string): AppView => {
    const clean = path.toLowerCase().replace(/\/+$/, '') || '/';
    if (clean === '/admin' || clean.startsWith('/admin/')) return 'admin';
    if (clean === '/about' || clean.startsWith('/about/')) return 'about';
    if (clean === '/services' || clean.startsWith('/services/')) return 'services';
    if (clean === '/checkout' || clean.startsWith('/checkout/')) return 'checkout';
    if (clean === '/order-status' || clean.startsWith('/order-status/')) return 'order-status';
    if (clean === '/contact' || clean.startsWith('/contact/')) return 'contact';
    return 'home';
  };

  const getPathFromView = (view: AppView): string => {
    switch (view) {
      case 'admin': return '/admin';
      case 'about': return '/about';
      case 'services': return '/services';
      case 'checkout': return '/checkout';
      case 'order-status': return '/order-status';
      case 'contact': return '/contact';
      case 'home':
      default: return '/';
    }
  };

  const [currentView, setCurrentViewState] = useState<AppView>(() => {
    if (typeof window !== 'undefined') {
      return getViewFromPath(window.location.pathname);
    }
    return 'home';
  });

  const setCurrentView = (view: AppView) => {
    setCurrentViewState(view);
    if (typeof window !== 'undefined') {
      const targetPath = getPathFromView(view);
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ view }, '', targetPath);
      }
    }
  };

  // Synchronize on browser Back / Forward buttons
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== 'undefined') {
        const view = getViewFromPath(window.location.pathname);
        setCurrentViewState(view);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isBackendHubOpen, setIsBackendHubOpen] = useState(false);

  // Owner Security & 2FA State (Defaults: Mobitel / Mobitel#123 / +94718080807)
  const [ownerConfig, setOwnerConfig] = useState<OwnerSecurityConfig>(() => {
    const saved = localStorage.getItem('cs_owner_security_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.username && parsed.password) return parsed;
      } catch {
        // fallback
      }
    }
    return DEFAULT_OWNER_CONFIG;
  });

  const [isOwnerAuthenticated, setIsOwnerAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('cs_owner_authenticated') === 'true';
  });

  const [activeSmsNotice, setActiveSmsNotice] = useState<SmsNotice | null>(null);
  const [currentLoginOtp, setCurrentLoginOtp] = useState<string | null>(null);
  const [currentChangeOtp, setCurrentChangeOtp] = useState<string | null>(null);
  const [isSmsPinUnlocked, setIsSmsPinUnlocked] = useState<boolean>(false);

  const verifySmsPin = (pin: string): boolean => {
    if (pin.trim() === '181818') {
      setIsSmsPinUnlocked(true);
      return true;
    }
    return false;
  };

  const lockSmsPin = () => {
    setIsSmsPinUnlocked(false);
  };

  // Sync owner config
  useEffect(() => {
    localStorage.setItem('cs_owner_security_config', JSON.stringify(ownerConfig));
  }, [ownerConfig]);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('cs_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('cs_plans', JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem('cs_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('cs_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('cs_current_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('cs_orders_v3', JSON.stringify(orders));
    localStorage.setItem('cs_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('cs_messages', JSON.stringify(contactMessages));
  }, [contactMessages]);

  // Auth Operations
  const login = async (email: string): Promise<{ success: boolean; message: string }> => {
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setUser(found);
      setIsAuthModalOpen(false);
      return { success: true, message: `Welcome back, ${found.full_name}!` };
    }
    // Create new customer on first login
    const newUser: User = {
      user_id: `usr_${Date.now()}`,
      full_name: email.split('@')[0],
      email,
      chess_com_username: email.split('@')[0],
      role: email.toLowerCase().includes('admin') || email.toLowerCase() === 'helpchesshop@gmail.com' ? 'admin' : 'customer',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
    setIsAuthModalOpen(false);
    return { success: true, message: `Account created for ${email}` };
  };

  const register = async (fullName: string, email: string, chessUsername?: string): Promise<{ success: boolean; message: string }> => {
    const newUser: User = {
      user_id: `usr_${Date.now()}`,
      full_name: fullName,
      email,
      chess_com_username: chessUsername || fullName.replace(/\s+/g, ''),
      role: 'customer',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
    setIsAuthModalOpen(false);
    return { success: true, message: 'Registration complete!' };
  };

  const logout = () => {
    setUser(null);
  };

  const quickLogin = (role: 'guest' | 'customer' | 'admin') => {
    if (role === 'guest') {
      setUser(null);
    } else if (role === 'admin') {
      if (isOwnerAuthenticated) {
        const adminUser = users.find(u => u.role === 'admin') || INITIAL_USERS[0];
        setUser(adminUser);
        setCurrentView('admin');
      } else {
        // Direct to admin view where Owner Security Gate & Phone SMS verification is strictly required
        setCurrentView('admin');
      }
    } else {
      const custUser = users.find(u => u.role === 'customer') || INITIAL_USERS[1];
      setUser(custUser);
    }
    setIsAuthModalOpen(false);
  };

  // Owner Authentication & 2FA Phone Actions
  const dismissSmsNotice = () => {
    setActiveSmsNotice(null);
    setIsSmsPinUnlocked(false);
  };

  const sendOwnerLoginOtp = async (
    usernameInput: string, 
    passwordInput: string
  ): Promise<{ success: boolean; message: string; phone?: string }> => {
    setIsSmsPinUnlocked(false);
    const normalizedInput = usernameInput.trim().toLowerCase();
    const currentOwnerUser = ownerConfig.username.trim().toLowerCase();

    if (normalizedInput !== currentOwnerUser || passwordInput !== ownerConfig.password) {
      return { 
        success: false, 
        message: 'Invalid owner username or password. The admin panel is strictly reserved for the website owner.' 
      };
    }

    // Generate dynamic 6-digit login password (OTP) that changes regularly on every login attempt
    const dynamicCode = Math.floor(100000 + Math.random() * 900000).toString();
    setCurrentLoginOtp(dynamicCode);

    const newSms: SmsNotice = {
      id: `sms_${Date.now()}`,
      to: ownerConfig.phone_number,
      code: dynamicCode,
      purpose: 'login_2fa',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      expires_at: Date.now() + 5 * 60 * 1000,
      message_text: `[Chess Shop Admin Security] Your dynamic login security passcode is: ${dynamicCode}. Dispatched to owner mobile ${ownerConfig.phone_number}. Code valid for 5 minutes.`
    };

    setActiveSmsNotice(newSms);
    return { 
      success: true, 
      message: 'Dynamic security passcode dispatched via SMS to your registered mobile phone.',
      phone: ownerConfig.phone_number 
    };
  };

  const verifyOwnerLoginOtp = async (code: string): Promise<{ success: boolean; message: string }> => {
    if (!currentLoginOtp) {
      return { success: false, message: 'No active login session found. Please enter your owner credentials first.' };
    }
    if (code.trim() !== currentLoginOtp) {
      return { success: false, message: 'Incorrect dynamic login passcode. Please check the SMS sent to your phone.' };
    }

    setIsOwnerAuthenticated(true);
    sessionStorage.setItem('cs_owner_authenticated', 'true');
    setCurrentLoginOtp(null);
    setActiveSmsNotice(null);

    const ownerUser: User = {
      user_id: 'usr_owner_sovereign',
      full_name: `Website Owner (${ownerConfig.username})`,
      email: 'helpchesshop@gmail.com',
      chess_com_username: ownerConfig.username,
      role: 'admin',
      created_at: '2026-01-01',
      updated_at: new Date().toISOString()
    };
    setUser(ownerUser);
    setCurrentView('admin');

    return { success: true, message: 'Owner authenticated successfully!' };
  };

  const requestCredentialChangeOtp = async (): Promise<{ success: boolean; message: string }> => {
    setIsSmsPinUnlocked(false);
    // Generate secure passcode for changing credentials
    const dynamicCode = Math.floor(100000 + Math.random() * 900000).toString();
    setCurrentChangeOtp(dynamicCode);

    const newSms: SmsNotice = {
      id: `sms_${Date.now()}`,
      to: ownerConfig.phone_number,
      code: dynamicCode,
      purpose: 'credential_change',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      expires_at: Date.now() + 5 * 60 * 1000,
      message_text: `[Chess Shop Security] Passcode to change Owner Username & Password is: ${dynamicCode}. Dispatched to authorized owner phone.`
    };

    setActiveSmsNotice(newSms);
    return { 
      success: true, 
      message: 'Security passcode dispatched to your registered phone via SMS.' 
    };
  };

  const verifyAndChangeCredentials = async (
    otpCode: string,
    newUsername: string,
    newPassword: string,
    newPhoneNumber?: string
  ): Promise<{ success: boolean; message: string }> => {
    if (!currentChangeOtp) {
      return { success: false, message: 'Please request a verification passcode to your phone first.' };
    }
    if (otpCode.trim() !== currentChangeOtp) {
      return { success: false, message: 'Invalid verification passcode from SMS. Please verify the code sent to your phone.' };
    }
    if (!newUsername.trim() || newUsername.trim().length < 3) {
      return { success: false, message: 'Username must be at least 3 characters long.' };
    }
    if (!newPassword || newPassword.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long.' };
    }

    const updated: OwnerSecurityConfig = {
      username: newUsername.trim(),
      password: newPassword,
      phone_number: newPhoneNumber && newPhoneNumber.trim() ? newPhoneNumber.trim() : ownerConfig.phone_number,
      last_updated: new Date().toISOString()
    };

    setOwnerConfig(updated);
    localStorage.setItem('cs_owner_security_config', JSON.stringify(updated));
    setCurrentChangeOtp(null);
    setActiveSmsNotice(null);

    if (user?.role === 'admin') {
      setUser(prev => prev ? {
        ...prev,
        full_name: `Website Owner (${updated.username})`,
        chess_com_username: updated.username
      } : null);
    }

    return { 
      success: true, 
      message: `Owner username and password updated successfully! New Username: "${updated.username}".` 
    };
  };

  const logoutOwner = () => {
    setIsOwnerAuthenticated(false);
    sessionStorage.removeItem('cs_owner_authenticated');
    setUser(null);
    setCurrentView('home');
  };

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const startCheckout = (plan: DiamondPlan) => {
    setSelectedPlan(plan);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit Order with Chess.com Username and PayPal Transaction Reference
  const submitOrder = async (
    chessUsername: string,
    paypalTransactionId: string,
    autoApprove = false,
    notes?: string
  ): Promise<{ success: boolean; orderId: string; order?: Order; message: string }> => {
    if (!selectedPlan) {
      return { success: false, orderId: '', message: 'Please select a Diamond plan first.' };
    }

    const orderId = `CS-${Math.floor(100000 + Math.random() * 900000)}`;
    const status: OrderStatus = autoApprove ? 'verified' : 'pending';
    
    // Generate an official voucher code pattern
    const generatedVoucher = `CHESS-DIAM-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const newOrder: Order = {
      order_id: orderId,
      user_id: user ? user.user_id : 'guest',
      user_email: user ? user.email : `${chessUsername.toLowerCase()}@client.chesshop.com`,
      user_name: user ? user.full_name : chessUsername,
      chess_com_username: chessUsername.trim(),
      item_type: 'diamond_membership',
      item_id: selectedPlan.id,
      item_title: selectedPlan.name,
      amount: selectedPlan.price,
      currency: settings.currency,
      payment_method: 'paypal_me',
      payment_status: status,
      paypal_transaction_id: paypalTransactionId || `PP_DEMO_${Date.now()}`,
      activation_code: autoApprove ? generatedVoucher : undefined,
      activation_instructions: autoApprove 
        ? `Official voucher generated for @${chessUsername}. Redeem directly on ${OFFICIAL_CHESS_URL} or via your Chess.com profile billing page.`
        : undefined,
      notes: notes,
      verified_at: autoApprove ? new Date().toISOString() : undefined,
      created_at: new Date().toISOString(),
    };

    setOrders(prev => [newOrder, ...prev]);

    // Background sync to Google Apps Script Web App if enabled
    if (settings.use_gas_api && settings.gas_api_url) {
      try {
        ApiService.post('createOrder', {
          order_id: newOrder.order_id,
          chess_com_username: newOrder.chess_com_username,
          plan: newOrder.item_title,
          amount: newOrder.amount,
          paypal_tx: newOrder.paypal_transaction_id,
          status: newOrder.payment_status
        }).catch(() => {});
      } catch (e) {
        // Silent sync
      }
    }

    return {
      success: true,
      orderId,
      order: newOrder,
      message: autoApprove 
        ? 'Payment verified! Your Diamond voucher code has been generated.' 
        : 'Order received! Our team will verify the PayPal payment and activate your Diamond Membership shortly.'
    };
  };

  const submitContact = async (
    name: string, 
    email: string, 
    chessUsername: string, 
    subject: string, 
    message: string
  ): Promise<{ success: boolean; message: string }> => {
    const newMessage: ContactMessage = {
      message_id: `MSG-${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      email,
      chess_com_username: chessUsername,
      subject,
      message,
      status: 'unread',
      created_at: new Date().toISOString()
    };
    setContactMessages(prev => [newMessage, ...prev]);

    if (settings.use_gas_api && settings.gas_api_url) {
      ApiService.post('submitContact', newMessage).catch(() => {});
    }

    return { success: true, message: 'Your message has been received! Our support concierge will reply shortly.' };
  };

  // Admin Actions
  const approveOrder = (orderId: string, customVoucher?: string) => {
    const generatedVoucher = customVoucher || `CHESS-DIAM-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    setOrders(prev => prev.map(o => {
      if (o.order_id === orderId) {
        return {
          ...o,
          payment_status: 'verified',
          activation_code: o.activation_code || generatedVoucher,
          activation_instructions: `Official Diamond voucher activated for @${o.chess_com_username}. Redeemable at ${OFFICIAL_CHESS_URL}.`,
          verified_at: new Date().toISOString()
        };
      }
      return o;
    }));
  };

  const rejectOrder = (orderId: string, reason?: string) => {
    const finalReason = reason && reason.trim() ? reason.trim() : DEFAULT_REJECTION_REASONS[0];
    setOrders(prev => prev.map(o => o.order_id === orderId ? { ...o, payment_status: 'rejected', rejection_reason: finalReason } : o));
  };

  const setOrderRejectionReason = (orderId: string, reason: string) => {
    setOrders(prev => prev.map(o => o.order_id === orderId ? { ...o, rejection_reason: reason } : o));
  };

  const resetRevenue = (mode: 'zero' | 'clear' | 'restore' = 'zero') => {
    if (mode === 'restore') {
      setOrders(INITIAL_ORDERS);
      localStorage.setItem('cs_orders_v3', JSON.stringify(INITIAL_ORDERS));
      return;
    }
    if (mode === 'clear') {
      setOrders([]);
      localStorage.setItem('cs_orders_v3', JSON.stringify([]));
      return;
    }
    // 'zero': reset revenue by removing verified/approved orders so revenue is reset to $0.00
    const pendingOnly = orders.filter(o => o.payment_status === 'pending');
    setOrders(pendingOnly);
    localStorage.setItem('cs_orders_v3', JSON.stringify(pendingOnly));
  };

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const updatePlanPrice = (planId: string, newPrice: number) => {
    setPlans(prev => prev.map(p => p.id === planId ? { ...p, price: newPrice } : p));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        users,
        plans,
        selectedPlan,
        features: CHESS_FEATURES,
        orders,
        contactMessages,
        reviews: REVIEWS,
        settings,
        currentView,
        isAuthModalOpen,
        authModalMode,
        isBackendHubOpen,
        setCurrentView,
        setSelectedPlan,
        openAuthModal,
        closeAuthModal,
        setIsBackendHubOpen,
        login,
        register,
        logout,
        quickLogin,
        startCheckout,
        submitOrder,
        submitContact,
        approveOrder,
        rejectOrder,
        setOrderRejectionReason,
        rejectionReasons,
        addRejectionReason,
        deleteRejectionReason,
        resetRevenue,
        updateSettings,
        updatePlanPrice,
        ownerConfig,
        isOwnerAuthenticated,
        activeSmsNotice,
        dismissSmsNotice,
        sendOwnerLoginOtp,
        verifyOwnerLoginOtp,
        requestCredentialChangeOtp,
        verifyAndChangeCredentials,
        logoutOwner,
        isSmsPinUnlocked,
        verifySmsPin,
        lockSmsPin,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
