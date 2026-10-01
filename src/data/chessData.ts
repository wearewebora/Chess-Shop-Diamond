import { DiamondPlan, ChessFeature, User, Order, ContactMessage, SiteSettings, ReviewItem } from '../types';

export const OFFICIAL_CHESS_URL = 'https://www.chess.com/membership?c=navbar';

export const DIAMOND_PLANS: DiamondPlan[] = [
  {
    id: 'diamond-1-year',
    name: '1 Year Diamond Membership',
    duration_label: '12 Months Unlimited Access',
    duration_months: 12,
    price: 60,
    original_price: 203.88, // 12 * $16.99
    savings_percent: 50,
    popular: true,
    badge: 'US CITIZENS ONLY',
    tagline: 'Get full access for only $5/mo* (Save 50% vs regular monthly rate)',
    eligibility: 'This membership is exclusively available to US citizens. Citizens of other countries are not eligible to activate this membership.',
    features: [
      'Exclusively available to US citizens (US accounts only)',
      'Unlimited Puzzles, Puzzle Rush & Battle',
      'Unlimited 5,000+ GM Video Lessons & Masterclasses',
      'All 100+ Personality & Master Bots Unlocked',
      'Interactive Play Coach with live game hints',
      '100% Ad-Free across web, iOS, and Android',
      'Unlimited Game Review (Depth 24+ Stockfish 16+)',
      'Verbal Move Explanations & Brilliant (!!) moves',
      'Advanced Stats, Opening Insights & Win Rates',
      'Courses Perks & Interactive Practice Drills'
    ],
    deliverable: 'Official Chess.com 1-Year Voucher Code + Instant Activation'
  }
];

export interface OfficialDiamondFeature {
  id: string;
  name: string;
  category: string;
  short_desc: string;
  full_desc: string;
  icon_type: 'puzzles' | 'lessons' | 'bots' | 'coach' | 'no_ads' | 'game_review' | 'move_explanations' | 'advanced_stats' | 'courses_perks';
  icon_color: string;
  icon_bg: string;
  tooltip: string;
  diamond_benefit: string;
  free_limitation: string;
}

export const OFFICIAL_DIAMOND_FEATURES: OfficialDiamondFeature[] = [
  {
    id: 'puzzles',
    name: 'Puzzles',
    category: 'Tactics & Speed',
    short_desc: 'Unlimited rated puzzles, Puzzle Rush (3-min, 5-min, Survival), and live Puzzle Battles.',
    full_desc: 'Sharpen your tactical vision without limits. Train with over 500,000+ interactive chess puzzles matched specifically to your rating, plus unrestricted daily Puzzle Rush sprints and head-to-head tactical battles.',
    icon_type: 'puzzles',
    icon_color: '#f97316',
    icon_bg: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    tooltip: 'Unlimited rated puzzles, Puzzle Rush sprints, and live Puzzle Battles.',
    diamond_benefit: 'Unlimited 24/7 access to all puzzle modes & themes',
    free_limitation: 'Strict limit of 3 puzzles per day'
  },
  {
    id: 'lessons',
    name: 'Lessons',
    category: 'Grandmaster Instruction',
    short_desc: '5,000+ interactive masterclasses and video lessons from GMs Hikaru Nakamura, Magnus Carlsen, and Daniel Naroditsky.',
    full_desc: 'Master opening repertoires, complex middlegame plans, pawn endgames, and defensive fortresses with structured masterclasses created by the world’s best grandmasters and coaches.',
    icon_type: 'lessons',
    icon_color: '#38bdf8',
    icon_bg: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
    tooltip: '5,000+ lessons and video library taught by world-class Grandmasters.',
    diamond_benefit: 'Full unrestricted library of 5,000+ GM video lessons',
    free_limitation: 'Only 1 introductory lesson per week'
  },
  {
    id: 'bots',
    name: 'Bots',
    category: 'Sparring Partners',
    short_desc: 'All 100+ bots unlocked — engine masters, celebrity bots, streamer personas, and adaptive ratings.',
    full_desc: 'Play anytime without internet pressure against over 100 computer personas from beginner bots (Jimmy, Martin) to elite grandmasters (Magnus, Hikaru, GothamChess, Mittens) with custom coach feedback.',
    icon_type: 'bots',
    icon_color: '#60a5fa',
    icon_bg: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    tooltip: 'Spar against 100+ personality bots, celebrity avatars, and master engines.',
    diamond_benefit: '100% of bots unlocked with customizable coach commentary',
    free_limitation: 'Only basic beginner bots accessible'
  },
  {
    id: 'coach',
    name: 'Play Coach',
    category: 'Virtual Mentorship',
    short_desc: 'Live interactive coach giving real-time game advice, tactical warnings, and post-game debriefs.',
    full_desc: 'Experience playing with a grandmaster looking over your shoulder. The Virtual Coach provides real-time friendly hints, guides you through difficult middlegames, and points out critical moments.',
    icon_type: 'coach',
    icon_color: '#d97706',
    icon_bg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    tooltip: 'Interactive Virtual Coach giving real-time tips and move suggestions.',
    diamond_benefit: 'Play with coach hints, takebacks, and tactical alerts enabled',
    free_limitation: 'Coach mode completely locked'
  },
  {
    id: 'no_ads',
    name: 'No Ads',
    category: 'Clean Experience',
    short_desc: '100% ad-free experience across web and mobile — no banners, popups, or video interruptions.',
    full_desc: 'Enjoy rapid, zero-lag gameplay without banner ads, auto-playing video promotions, or pre-game loading delays. Keeps your focus purely on the chess board.',
    icon_type: 'no_ads',
    icon_color: '#ef4444',
    icon_bg: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    tooltip: 'Completely ad-free experience across web, iOS, and Android.',
    diamond_benefit: 'Zero ads, faster page loads, and distraction-free blitz',
    free_limitation: 'Frequent popups, video ads, and screen-side banners'
  },
  {
    id: 'game_review',
    name: 'Game Review',
    category: 'Deep Engine Analysis',
    short_desc: 'Unlimited Stockfish 16+ deep analysis on every game, with Accuracy %, move classifications, and coach summaries.',
    full_desc: 'The gold standard of chess analysis. Evaluates every move with maximum Stockfish engine depth, calculating your game accuracy percentage, classification graph, opening performance, and turning points.',
    icon_type: 'game_review',
    icon_color: '#22c55e',
    icon_bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    tooltip: 'Unlimited Stockfish 16+ game reviews with accuracy score & blunder detection.',
    diamond_benefit: 'Unlimited game reviews at maximum depth (depth 24+)',
    free_limitation: 'Only 1 basic game review per day'
  },
  {
    id: 'move_explanations',
    name: 'Move Explanations',
    category: 'AI Coach Explanations',
    short_desc: 'Natural language move explanations, Brilliant (!!) move breakdowns, and blunder diagnostics.',
    full_desc: 'Stop staring at dry engine numbers like +1.4. Diamond translates calculations into plain English: why a sacrifice works, why an innocent-looking move was a mistake, and how to punish opponent blunders.',
    icon_type: 'move_explanations',
    icon_color: '#06b6d4',
    icon_bg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    tooltip: 'Natural language explanations for Brilliant (!!), Great, and Missed moves.',
    diamond_benefit: 'Full AI verbal explanations for every move and mistake',
    free_limitation: 'Move explanations completely locked'
  },
  {
    id: 'advanced_stats',
    name: 'Advanced Stats',
    category: 'Performance Insights',
    short_desc: 'Opening Explorer win rates, accuracy trends over time, piece performance, and time trouble analytics.',
    full_desc: 'Uncover your psychological chess patterns. Discover which openings yield your highest win rates, whether you blunder more in time trouble, and how your accuracy compares against peers at your rating.',
    icon_type: 'advanced_stats',
    icon_color: '#0284c7',
    icon_bg: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
    tooltip: 'Deep insights: win rate by opening, accuracy trends, and phase analytics.',
    diamond_benefit: 'Complete statistical dashboard and personalized chess insights',
    free_limitation: 'Stats panel locked behind paywall'
  },
  {
    id: 'courses_perks',
    name: 'Courses Perks',
    category: 'Exclusive Masteries',
    short_desc: 'Discounts, special access to interactive repertoires, practice positions, and video course masteries.',
    full_desc: 'Accelerate your mastery with interactive opening books, dedicated endgame drill drills, master-level puzzle collections, and exclusive member discounts on premium courses.',
    icon_type: 'courses_perks',
    icon_color: '#10b981',
    icon_bg: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    tooltip: 'Exclusive access to course materials, practice drills, and perks.',
    diamond_benefit: 'Free interactive practice positions and VIP course benefits',
    free_limitation: 'No course perks or drill access'
  }
];

export const CHESS_FEATURES: ChessFeature[] = OFFICIAL_DIAMOND_FEATURES.map(f => ({
  id: f.id,
  title: f.name,
  category: f.category,
  description: f.full_desc,
  badge: 'Unlimited',
  icon_name: f.icon_type,
  free_vs_diamond: {
    free: f.free_limitation,
    diamond: f.diamond_benefit
  }
}));

export const INITIAL_USERS: User[] = [
  {
    user_id: 'usr_admin',
    full_name: 'Chess Shop Administrator',
    email: 'helpchesshop@gmail.com',
    chess_com_username: 'ChessShopAdmin',
    role: 'admin',
    created_at: '2026-01-01',
    updated_at: '2026-09-18'
  },
  {
    user_id: 'usr_customer_1',
    full_name: 'Magnus Enthusiast',
    email: 'player@example.com',
    chess_com_username: 'TacticalKnight99',
    role: 'customer',
    created_at: '2026-03-12',
    updated_at: '2026-09-18'
  }
];

// Helper to compute timestamps for sample history
const nowMs = Date.now();
const oneDayMs = 24 * 60 * 60 * 1000;

export const INITIAL_ORDERS: Order[] = [
  {
    order_id: 'CS-928104',
    user_id: 'usr_guest_today',
    user_email: 'hikaru_fan@outlook.com',
    user_name: 'Alexandre Dubois',
    chess_com_username: 'BongcloudMaster',
    item_type: 'diamond_membership',
    item_id: 'diamond-1-year',
    item_title: '1 Year Diamond Membership',
    amount: 60,
    currency: 'USD',
    payment_method: 'paypal_me',
    payment_status: 'verified',
    paypal_transaction_id: 'PP-1A990812HK',
    activation_code: 'CHESS-DIAM-2026-BONG-CLOUD',
    activation_instructions: 'Activated on Chess.com directly. Full 365-day Diamond pass unlocked.',
    notes: 'Today order: verified via PayPal.me express concierge.',
    verified_at: new Date(nowMs - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago today
    created_at: new Date(nowMs - 2.5 * 60 * 60 * 1000).toISOString()
  },
  {
    order_id: 'CS-849201',
    user_id: 'usr_customer_1',
    user_email: 'player@example.com',
    user_name: 'Magnus Enthusiast',
    chess_com_username: 'TacticalKnight99',
    item_type: 'diamond_membership',
    item_id: 'diamond-1-year',
    item_title: '1 Year Diamond Membership',
    amount: 60,
    currency: 'USD',
    payment_method: 'paypal_me',
    payment_status: 'verified',
    paypal_transaction_id: 'PP-9X827104KL',
    activation_code: 'CHESS-DIAM-2026-99A1-YK8B',
    activation_instructions: 'Redeem code directly at https://www.chess.com/membership or via gift activation link.',
    notes: 'Activated on Chess.com account TacticalKnight99 (past month)',
    verified_at: new Date(nowMs - 12 * oneDayMs).toISOString(), // 12 days ago
    created_at: new Date(nowMs - 12 * oneDayMs).toISOString()
  },
  {
    order_id: 'CS-739102',
    user_id: 'usr_guest_3',
    user_email: 'sarah.kasparov@gmail.com',
    user_name: 'Sarah Jenkins',
    chess_com_username: 'QueenEndgame',
    item_type: 'diamond_membership',
    item_id: 'diamond-1-year',
    item_title: '1 Year Diamond Membership',
    amount: 60,
    currency: 'USD',
    payment_method: 'paypal_me',
    payment_status: 'verified',
    paypal_transaction_id: 'PP-3F881920SJ',
    activation_code: 'CHESS-DIAM-2026-ENDG-77X1',
    activation_instructions: 'Official voucher redeemed successfully.',
    notes: 'Verified 45 days ago (past 3 months)',
    verified_at: new Date(nowMs - 45 * oneDayMs).toISOString(), // 45 days ago
    created_at: new Date(nowMs - 45 * oneDayMs).toISOString()
  },
  {
    order_id: 'CS-619283',
    user_id: 'usr_guest_4',
    user_email: 'mate_in_three@yahoo.com',
    user_name: 'Marcus Vance',
    chess_com_username: 'SicilianSniper',
    item_type: 'diamond_membership',
    item_id: 'diamond-1-year',
    item_title: '1 Year Diamond Membership',
    amount: 60,
    currency: 'USD',
    payment_method: 'paypal_me',
    payment_status: 'verified',
    paypal_transaction_id: 'PP-66710293MV',
    activation_code: 'CHESS-DIAM-2026-SICL-44W9',
    activation_instructions: 'Direct profile activation via Chess.com voucher.',
    notes: 'Verified 110 days ago (past 6 months)',
    verified_at: new Date(nowMs - 110 * oneDayMs).toISOString(), // 110 days ago
    created_at: new Date(nowMs - 110 * oneDayMs).toISOString()
  },
  {
    order_id: 'CS-509182',
    user_id: 'usr_guest_5',
    user_email: 'fischer_fanatic@proton.me',
    user_name: 'Leonid Miller',
    chess_com_username: 'RookSacrifice',
    item_type: 'diamond_membership',
    item_id: 'diamond-1-year',
    item_title: '1 Year Diamond Membership',
    amount: 60,
    currency: 'USD',
    payment_method: 'paypal_me',
    payment_status: 'verified',
    paypal_transaction_id: 'PP-50192834LM',
    activation_code: 'CHESS-DIAM-2025-ROOK-88Q2',
    activation_instructions: 'Delivered and verified.',
    notes: 'Verified 250 days ago (past 1 year)',
    verified_at: new Date(nowMs - 250 * oneDayMs).toISOString(), // 250 days ago
    created_at: new Date(nowMs - 250 * oneDayMs).toISOString()
  },
  {
    order_id: 'CS-418290',
    user_id: 'usr_guest_6',
    user_email: 'tal_tactics@icloud.com',
    user_name: 'Viktor Thorne',
    chess_com_username: 'TalTactics',
    item_type: 'diamond_membership',
    item_id: 'diamond-1-year',
    item_title: '1 Year Diamond Membership',
    amount: 60,
    currency: 'USD',
    payment_method: 'paypal_me',
    payment_status: 'verified',
    paypal_transaction_id: 'PP-41829012VT',
    activation_code: 'CHESS-DIAM-2025-TALT-33M7',
    activation_instructions: 'Delivered and redeemed.',
    notes: 'Verified 420 days ago (all-time lifetime revenue)',
    verified_at: new Date(nowMs - 420 * oneDayMs).toISOString(), // 420 days ago
    created_at: new Date(nowMs - 420 * oneDayMs).toISOString()
  },
  {
    order_id: 'CS-849312',
    user_id: 'usr_guest_2',
    user_email: 'gambitqueen@gmail.com',
    user_name: 'Elena Rostova',
    chess_com_username: 'ElenaGambit',
    item_type: 'diamond_membership',
    item_id: 'diamond-1-year',
    item_title: '1 Year Diamond Membership',
    amount: 60,
    currency: 'USD',
    payment_method: 'paypal_me',
    payment_status: 'pending',
    paypal_transaction_id: 'PP-4B910293MM',
    notes: 'Customer submitted PayPal.me reference. Pending admin verification.',
    created_at: new Date(nowMs - 1 * 60 * 60 * 1000).toISOString()
  }
];

export const INITIAL_CONTACT_MESSAGES: ContactMessage[] = [
  {
    message_id: 'MSG-3012',
    name: 'David Chen',
    email: 'david.chen@chessclub.org',
    chess_com_username: 'DavidChenChess',
    subject: 'Bulk 1-Year Diamond Memberships for Chess Club',
    message: 'Hello, we have 15 players in our university chess team. Do you provide group bulk discounts for 1-year Diamond memberships?',
    status: 'unread',
    created_at: '2026-09-18T07:45:00Z'
  }
];

export const INITIAL_SETTINGS: SiteSettings = {
  site_name: 'Chess Shop',
  tagline: 'Official Chess.com 1-Year Diamond Membership Store',
  currency: 'USD',
  currency_symbol: '$',
  paypal_me_username: 'chesshop',
  paypal_business_email: 'helpchesshop@gmail.com',
  gas_api_url: '',
  use_gas_api: false,
  google_sheet_id: '',
  support_email: 'helpchesshop@gmail.com',
  admin_notification_email: 'helpchesshop@gmail.com',
  official_chess_url: OFFICIAL_CHESS_URL
};

export const REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    author: 'Alexandre M.',
    chess_username: 'BishopSniper2100',
    rating: 5,
    fide_rating: 'FIDE 2045',
    comment: 'Saved over $110 on the 1-Year Diamond membership compared to monthly billing. The voucher code was delivered within 10 minutes and activated immediately on my Chess.com profile. Unlimited Game Review is unmatched for analyzing my classical tournament games.',
    plan: '1 Year Diamond',
    date: '3 days ago',
    verified_buyer: true
  },
  {
    id: 'rev-2',
    author: 'Sarah K.',
    chess_username: 'SarahTactics',
    rating: 5,
    fide_rating: 'Chess.com 1680',
    comment: 'I was hesitant at first, but Chess Shop is 100% legit. No password needed, only my username! Within 15 minutes my account had the glowing blue Diamond badge for a full year and all puzzles became unlimited. Highly recommend!',
    plan: '1 Year Diamond',
    date: '1 week ago',
    verified_buyer: true
  },
  {
    id: 'rev-3',
    author: 'Viktor R.',
    chess_username: 'EndgameWizard',
    rating: 5,
    fide_rating: 'FIDE 2210',
    comment: 'Got my 1-Year Diamond pass here. Smooth PayPal payment and prompt email confirmation. Customer support at helpchesshop@gmail.com answered my question in 5 minutes.',
    plan: '1 Year Diamond',
    date: '2 weeks ago',
    verified_buyer: true
  }
];

export const DEFAULT_REJECTION_REASONS: string[] = [
  "This membership is exclusively available to US citizens. Citizens of other countries are not eligible to activate this membership. If you previously created an account with a different home country selected, please select the USA as your home country when creating a new account. Once the account has been created, please send me the username so I can proceed with reactivating it.",
  "Payment verification failed: PayPal transaction reference not found or unconfirmed.",
  "Provided Chess.com account does not exist or username is misspelled.",
  "Payment amount received does not match the selected membership plan price."
];

