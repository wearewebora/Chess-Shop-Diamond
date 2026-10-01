import React from 'react';
import { ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react';

interface PayWithCardButtonProps {
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  amount?: number | string;
  currencySymbol?: string;
  label?: string;
  showPayPal?: boolean;
}

export const VisaLogo: React.FC<{ className?: string }> = ({ className = 'h-4 w-auto' }) => (
  <svg 
    className={className} 
    viewBox="0 0 50 16" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Visa"
  >
    <path 
      d="M19.14 0.5L12.55 15.5H8.22L5.02 3.65C4.83 2.9 4.25 2.22 3.48 1.82C2.19 1.13 0.82 0.73 0 0.53L0.08 0.5H7.31C8.25 0.5 9.07 1.12 9.27 2.12L11.02 11.45L15.34 0.5H19.14ZM36.03 10.55C36.05 6.54 30.5 6.32 30.54 4.51C30.56 3.96 31.08 3.37 32.25 3.22C32.83 3.15 34.42 3.09 36.14 3.88L36.83 0.67C35.88 0.33 34.66 0 33.12 0C29.08 0 26.23 2.15 26.2 5.23C26.15 7.51 28.18 8.78 29.74 9.54C31.34 10.32 31.88 10.82 31.87 11.53C31.85 12.61 30.55 13.09 29.35 13.11C27.3 13.14 26.1 12.56 25.17 12.13L24.45 15.49C25.39 15.92 27.13 16.29 28.93 16.31C33.24 16.31 36.01 14.18 36.03 10.55ZM46.59 15.5H50.29L47.07 0.5H43.64C42.86 0.5 42.2 0.95 41.91 1.65L35.8 15.5H40.08L40.93 13.18H46.15L46.59 15.5ZM42.09 10.05L44.24 4.19L45.48 10.05H42.09ZM25.04 0.5L21.67 15.5H17.58L20.95 0.5H25.04Z" 
      fill="#1A1F71"
    />
  </svg>
);

export const MastercardLogo: React.FC<{ className?: string }> = ({ className = 'h-5 w-auto' }) => (
  <svg 
    className={className} 
    viewBox="0 0 36 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Mastercard"
  >
    <circle cx="12" cy="12" r="10" fill="#EB001B"/>
    <circle cx="24" cy="12" r="10" fill="#F79E1B"/>
    <path 
      d="M18 4.27A9.97 9.97 0 0 1 21.8 12c0 3.09-1.4 5.86-3.8 7.73A9.97 9.97 0 0 1 14.2 12c0-3.09 1.4-5.86 3.8-7.73z" 
      fill="#FF5F00"
    />
  </svg>
);

export const PayPalLogo: React.FC<{ className?: string }> = ({ className = 'h-4 w-auto' }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    aria-label="PayPal"
  >
    <path 
      d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.945 3.39a.77.77 0 0 1 .76-.64h6.77c3.155 0 5.464 1.343 5.034 4.54-.367 2.73-2.316 4.267-4.945 4.267H9.79a.77.77 0 0 0-.76.64l-1.954 9.14z" 
      fill="#003087"
    />
    <path 
      d="M10.024 11.557h2.774c2.63 0 4.578-1.536 4.945-4.267.31-2.308-1.026-3.77-3.418-4.27a7.784 7.784 0 0 1 1.777-.27c3.156 0 5.465 1.343 5.035 4.54-.42 3.125-2.613 4.887-5.594 4.887h-3.08a.77.77 0 0 0-.76.64l-1.393 6.52H8.07l1.954-9.14a.77.77 0 0 1 .76-.64z" 
      fill="#0079C1"
    />
    <path 
      d="M9.03 14.547l-1.222 5.72a.641.641 0 0 0 .633.74h3.696a.64.64 0 0 0 .633-.538l.848-3.962a.77.77 0 0 1 .76-.64h1.916c2.98 0 5.174-1.762 5.594-4.887.054-.403.064-.784.032-1.144-.45 3.15-2.652 4.71-5.694 4.71h-2.774a.77.77 0 0 0-.76.64l-.662 3.361z" 
      fill="#00457C"
    />
  </svg>
);

/**
 * Modern, professional checkout button with Visa, Mastercard, and PayPal support.
 * Features:
 * - Recognizable Visa, Mastercard, and PayPal logos side-by-side
 * - Clean white background with subtle border and shadow
 * - Premium fintech aesthetic with blue and red subtle accents
 * - Clear readable text: "Pay with PayPal, Visa / Mastercard"
 * - Centered layout with responsive padding
 */
export const PayWithCardButton: React.FC<PayWithCardButtonProps> = ({
  onClick,
  className = '',
  disabled = false,
  amount,
  currencySymbol = '$',
  label = 'Pay with PayPal, Visa / Mastercard',
  showPayPal = true,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`group relative w-full min-h-[52px] bg-white hover:bg-slate-50/90 active:bg-slate-100 text-slate-900 border border-slate-200/90 hover:border-slate-300 rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 flex items-center justify-center gap-3 px-4 sm:px-5 py-3 cursor-pointer select-none disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      aria-label={label}
    >
      {/* Logos Side by Side */}
      <div className="flex items-center gap-2 bg-slate-50/90 px-2.5 py-1 rounded-lg border border-slate-100 shrink-0">
        <VisaLogo className="h-3.5 w-auto" />
        <div className="w-px h-3.5 bg-slate-200" />
        <MastercardLogo className="h-4 w-auto" />
        {showPayPal && (
          <>
            <div className="w-px h-3.5 bg-slate-200" />
            <div className="flex items-center gap-1">
              <PayPalLogo className="h-3.5 w-auto" />
            </div>
          </>
        )}
      </div>

      {/* Button Text */}
      <span className="font-semibold text-xs sm:text-sm tracking-tight text-slate-900 group-hover:text-slate-950 flex items-center gap-1.5 truncate">
        <span>{label}</span>
        {amount !== undefined && (
          <span className="font-bold text-[#0070BA] font-mono shrink-0">
            ({currencySymbol}{amount})
          </span>
        )}
      </span>

      {/* Subtle indicator arrow */}
      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-transform shrink-0 ml-auto sm:ml-0" />
    </button>
  );
};

/**
 * Dedicated signature PayPal button in PayPal Gold.
 */
export const PayWithPayPalGoldButton: React.FC<{
  onClick?: () => void;
  amount?: number | string;
  currencySymbol?: string;
  className?: string;
}> = ({ onClick, amount, currencySymbol = '$', className = '' }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full min-h-[50px] bg-[#FFC439] hover:bg-[#F2BA36] active:bg-[#E5AF30] text-[#003087] font-bold text-xs sm:text-sm rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2.5 px-5 py-3 cursor-pointer select-none border border-[#E5AF30] ${className}`}
  >
    <PayPalLogo className="h-4 w-auto" />
    <span className="font-black italic text-[#003087]">
      Pay<span className="text-[#0079C1]">Pal</span>
    </span>
    {amount !== undefined && (
      <span className="font-bold font-mono text-[#003087]">
        ({currencySymbol}{amount})
      </span>
    )}
    <ExternalLink className="w-3.5 h-3.5 text-[#003087]/80 ml-auto sm:ml-0 shrink-0" />
  </button>
);
