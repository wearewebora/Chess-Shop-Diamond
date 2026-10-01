import React, { useEffect, useRef, useState } from 'react';
import { Loader2, AlertCircle, RefreshCw, ShieldCheck, ExternalLink } from 'lucide-react';

interface PayPalHostedSectionProps {
  hostedButtonId?: string;
  paypalMeFallbackUrl?: string;
  onPaymentSuccess?: () => void;
}

declare global {
  interface Window {
    paypal?: {
      HostedButtons?: (options: { hostedButtonId: string }) => {
        render: (containerSelector: string) => Promise<void>;
      };
    };
  }
}

export const PayPalHostedSection: React.FC<PayPalHostedSectionProps> = ({
  hostedButtonId = 'M9DVCWNF6Q6RG',
  paypalMeFallbackUrl,
}) => {
  const containerId = `paypal-container-${hostedButtonId}`;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const renderedRef = useRef(false);

  const initHostedButtons = () => {
    setLoading(true);
    setError(null);

    const render = () => {
      const container = document.getElementById(containerId);
      if (!container) return;

      if (window.paypal?.HostedButtons) {
        container.innerHTML = '';
        try {
          window.paypal
            .HostedButtons({
              hostedButtonId: hostedButtonId,
            })
            .render(`#${containerId}`)
            .then(() => {
              setLoading(false);
              renderedRef.current = true;
            })
            .catch((err: any) => {
              console.error('PayPal Hosted Buttons render error:', err);
              setError('PayPal Hosted Button is initializing. If it does not appear, use the direct payment button below.');
              setLoading(false);
            });
        } catch (e: any) {
          console.error('Error invoking HostedButtons:', e);
          setError('Unable to initialize PayPal button.');
          setLoading(false);
        }
      } else {
        // Retry polling for script
        let attempts = 0;
        const interval = setInterval(() => {
          attempts++;
          if (window.paypal?.HostedButtons) {
            clearInterval(interval);
            render();
          } else if (attempts > 15) {
            clearInterval(interval);
            setLoading(false);
            setError('PayPal checkout script is taking longer to load.');
          }
        }, 300);
      }
    };

    render();
  };

  useEffect(() => {
    renderedRef.current = false;
    initHostedButtons();
  }, [hostedButtonId]);

  return (
    <div className="space-y-4">
      {loading && (
        <div className="flex items-center justify-center p-6 bg-slate-50 border border-slate-200 rounded-2xl gap-3 text-xs text-slate-600 animate-pulse">
          <Loader2 className="w-5 h-5 animate-spin text-[#0070BA]" />
          <span>Connecting to official PayPal payment gateway...</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={initHostedButtons}
            className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 transition flex items-center gap-1 text-[11px] font-bold shrink-0"
          >
            <RefreshCw className="w-3 h-3" /> Retry
          </button>
        </div>
      )}

      {/* Target Container explicitly required by PayPal Hosted Buttons */}
      <div 
        id={containerId}
        className="min-h-[48px] w-full flex justify-center [&_iframe]:!w-full [&_iframe]:!max-w-full"
      />

      {paypalMeFallbackUrl && (
        <div className="pt-2 text-center">
          <a
            href={paypalMeFallbackUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[#0070BA] hover:text-[#005ea6] font-semibold underline underline-offset-4"
          >
            <span>Or pay directly via PayPal.me link</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>Official PayPal 256-bit Encrypted Checkout</span>
      </div>
    </div>
  );
};
