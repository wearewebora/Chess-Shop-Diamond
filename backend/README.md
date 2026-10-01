# BookVault - Backend Setup & Google Sheets Guide

This guide details how to configure **Google Sheets** as your serverless database and **Google Apps Script** as your RESTful API.

---

## 1. Google Sheets Database Setup

1. Open [Google Sheets](https://sheets.new) and create a new Spreadsheet named **"BookVault Database"**.
2. Create the following **8 sheets (tabs)** with the exact column headers in row 1:

### Sheet 1: `Users`
Columns:
`user_id`, `full_name`, `email`, `password_hash`, `role`, `membership_plan`, `membership_status`, `membership_start`, `membership_expiry`, `created_at`, `updated_at`

### Sheet 2: `Books`
Columns:
`book_id`, `title`, `author`, `description`, `category`, `price`, `cover_url`, `file_id`, `access_type`, `membership_plan`, `published`, `created_at`, `updated_at`

### Sheet 3: `Memberships`
Columns:
`membership_id`, `user_id`, `plan_id`, `plan_name`, `amount`, `payment_status`, `start_date`, `expiry_date`, `paypal_reference`, `created_at`

### Sheet 4: `Orders`
Columns:
`order_id`, `user_id`, `book_id`, `amount`, `currency`, `payment_method`, `payment_status`, `paypal_transaction_id`, `verified_at`, `created_at`

### Sheet 5: `Payments`
Columns:
`payment_id`, `user_id`, `order_id`, `amount`, `currency`, `payment_reference`, `payment_status`, `verified_by`, `verified_at`, `created_at`

### Sheet 6: `MembershipPlans`
Columns:
`plan_id`, `plan_name`, `price`, `currency`, `billing_period`, `benefits`, `paypal_link`, `active`

### Sheet 7: `ContactMessages`
Columns:
`message_id`, `name`, `email`, `subject`, `message`, `status`, `created_at`

### Sheet 8: `Settings`
Columns:
`setting_key`, `setting_value`

---

## 2. Google Apps Script Setup & Deployment

1. Inside your Google Sheet, click **Extensions > Apps Script**.
2. Copy the contents of the files in the `backend/` folder:
   - `Code.gs`
   - `Auth.gs`
   - `Books.gs`
   - `Orders.gs`
   - `Memberships.gs`
   - `Admin.gs`
3. Set Script Properties (Optional if bound to the sheet; recommended):
   - Go to **Project Settings (gear icon) > Script Properties**.
   - Add property: `SPREADSHEET_ID` with the ID from your sheet URL.
4. Click **Deploy > New deployment**:
   - Select type: **Web app**.
   - Description: `BookVault API v1`.
   - Execute as: **Me (your account)**.
   - Who has access: **Anyone**. *(Crucial for CORS browser access)*.
5. Click **Deploy**, authorize permissions, and copy the generated **Web App URL** (e.g., `https://script.google.com/macros/s/.../exec`).
6. Paste this URL into your BookVault frontend:
   - In `.env`: `VITE_API_URL="https://script.google.com/macros/s/.../exec"`
   - Or enter it directly in the BookVault **Admin Settings** UI!

---

## 3. Google Drive E-Book Secure Storage

1. Create a dedicated folder in Google Drive: **"BookVault Storage (Private)"**.
2. Ensure folder sharing is set to **Restricted** (do NOT share publicly).
3. Upload your PDF or EPUB e-book files.
4. Right-click any file > **Share > Copy link** to extract the File ID:
   `https://drive.google.com/file/d/[FILE_ID]/view`
5. Store only this `[FILE_ID]` in your Books table under the `file_id` column.
6. The backend verifies the user's active membership or order before providing download/reading tokens, preventing unauthorized public URL leaks.

---

## 4. PayPal.me & Payment Workflow

1. Go to [PayPal.me](https://www.paypal.com/paypalme) and claim your custom handle (e.g. `paypal.me/yourbrand`).
2. When a customer purchases:
   - BookVault calculates the exact amount and generates: `https://paypal.me/[yourname]/[amount][currency]`.
   - The customer is prompted to complete payment and enter their PayPal Transaction ID / Reference.
   - An order is saved in the `Orders` and `Payments` sheets with status `pending`.
   - **Verification**: The admin checks their PayPal business account and approves the pending payment in the BookVault Admin Dashboard. Once approved, access is immediately unlocked for the user.

> **Important Subscription Notice**:
> PayPal.me links represent one-time transfers and cannot automatically execute recurring monthly debits. For true recurring subscriptions, integrate PayPal Subscriptions API (`paypal.Buttons` with `createSubscription`) or Stripe Billing. BookVault's manual approval fallback accommodates PayPal.me while preventing unauthorized access.

---

## 5. Security Limitations & Production Considerations

- **CORS in Google Apps Script**: Google Apps Script handles cross-origin POST requests via 302 redirects. The BookVault frontend `apiService` handles these redirects transparently.
- **Password Protection**: Passwords are never stored in plaintext. They are salted with a 16-character UUID and hashed using SHA-256 before writing to Google Sheets.
- **Browser-Side Content Protection**: No browser-based PDF reader can guarantee 100% download prevention (as content delivered to a browser can be captured via screenshots or DevTools). Restricting raw Google Drive file IDs and authenticating session tokens provides defense-in-depth.
