# Chess Shop - Official Chess.com Diamond Membership Store

> "Unleash Your True Rating with Chess.com Diamond Membership."

**Chess Shop** is a specialized e-commerce storefront dedicated exclusively to selling **Chess.com Diamond Memberships** at discounted rates. It supports instant digital voucher code distribution, direct username upgrades, PayPal.me payments, Google Sheets order tracking, and Google Apps Script serverless APIs.

Official reference: [https://www.chess.com/membership?c=navbar](https://www.chess.com/membership?c=navbar)

---

## 💎 What is Chess.com Diamond Membership?

Diamond is the highest tier of Chess.com membership, unlocking:
1. **Unlimited Game Reviews & Engine Analysis**: In-depth Stockfish 16+ evaluation with personalized AI Coach move explanations.
2. **Unlimited Puzzles, Puzzle Rush & Puzzle Battle**: Unrestricted tactical training across 3-minute, 5-minute, and Survival modes.
3. **5,000+ Grandmaster Video Lessons & Interactive Courses**: Comprehensive masterclasses from Magnus Carlsen, Hikaru Nakamura, and Daniel Naroditsky.
4. **All 100+ Personality & Master Bots Unlocked**: Spar against celebrity bots, streamer bots, and adaptive computer opponents.
5. **Insights & Opening Explorer**: Deep statistical analytics on your accuracy, win rates by opening, and time management.
6. **100% Ad-Free Experience & Glowing Blue Diamond VIP Profile Badge**.

---

## 🚀 Available Diamond Passes

| Pass Duration | Chess Shop Price | Regular Price | Savings | Best For |
|---|---|---|---|---|
| **1 Month Diamond** | **$14.99** | $19.99 | Save 25% | Short tournament preparation & feature trials |
| **3 Months Diamond** | **$38.99** | $59.97 | Save 35% | Seasonal rating climb & league matches |
| **1 Year Diamond (Best Value)** | **$89.99/yr** | $159.99/yr | Save 44% | Serious improvement (under $7.50/month) |
| **2 Years Grandmaster Pass** | **$159.99** | $319.98 | Save 50% | Maximum savings & multi-year commitment |

---

## 🔒 Security & Activation Process

1. **No Passwords Ever Required**: Only public Chess.com usernames (`@username`) or delivery email addresses.
2. **Existing Account Friendly**: All ratings, game archives, friends, and clubs remain 100% intact.
3. **Instant Voucher Delivery**: Automated voucher key generation (`CHESS-DIAM-XXXX-YYYY`) or manual admin verification via PayPal.me.
4. **Official Voucher Redemption**: Directly redeemable at [chess.com/membership](https://www.chess.com/membership?c=navbar).

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons.
- **Backend API**: Google Apps Script Web App (JSON endpoints for order logging and voucher activation).
- **Database**: Google Sheets (DiamondOrders, Customers, DiamondPlans, Inquiries, Settings).
- **Payments**: PayPal.me direct buyer-protected payment links.
- **Hosting**: Netlify with `netlify.toml` preconfigured for SPA routing.

---

## 📦 Deployment Instructions

### 1. Deploy on Netlify

1. Push repository to GitHub:
   ```bash
   git add .
   git commit -m "Launch Chess Shop Diamond Membership platform"
   git push origin main
   ```
2. In Netlify, import the repository:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
3. Set optional environment variables in Netlify Settings:
   - `VITE_API_URL`: Your deployed Google Apps Script Web App URL
4. Click **Deploy**.

---

## 📬 Support & Concierge

- **Official Support Email**: `helpchesshop@gmail.com`
- **Response Time**: Under 15 minutes during peak tournament hours.
