import React, { useState } from 'react';
import { 
  Search, CheckCircle2, Clock, ArrowRight, ShieldCheck, AlertCircle 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';

export const OrderStatusPage: React.FC = () => {
  const { orders, settings, setCurrentView } = useApp();
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);

  const matchedOrders = orders.filter(o => {
    if (!query.trim()) return false;
    const q = query.trim().toLowerCase();
    return (
      o.order_id.toLowerCase().includes(q) ||
      o.chess_com_username.toLowerCase().includes(q) ||
      o.user_email.toLowerCase().includes(q) ||
      o.paypal_transaction_id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans space-y-10">
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="inline-block text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 mb-3 mx-0 mt-0 rounded-full border border-sky-200">
          Activation Status Checking Portal
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#f2f2f2] font-cinzel">
          Check Order Status
        </h1>
        <p className="text-xs text-[#fbfbfb]">
          Enter your Order ID (e.g. CS-849201) or your Chess.com username to retrieve your Diamond voucher code and activation status.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="max-w-xl mx-auto bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2">
        <div className="pl-3 text-slate-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setSearched(true);
          }}
          placeholder="Enter Order ID, @username, or PayPal Reference..."
          style={{ 
            color: '#000000',
            WebkitTextFillColor: '#000000',
            caretColor: '#000000',
            colorScheme: 'light'
          }}
          className="input-typing-black w-full text-xs font-medium !text-black text-black focus:!text-black focus:text-black bg-transparent focus:outline-none py-2"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="text-slate-400 hover:text-slate-600 p-1 text-xs"
          >
            Clear
          </button>
        )}
      </div>

      {/* Results */}
      {query.trim() && (
        <div className="space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Matching Orders ({matchedOrders.length})
          </h3>

          {matchedOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-3 text-slate-500">
              <p className="text-xs font-medium">No orders found matching "{query}".</p>
              <p className="text-[11px] text-slate-400">
                Please verify your Chess.com username or PayPal transaction ID. If you just placed an order, it may take a minute to synchronize.
              </p>
            </div>
          ) : (
            matchedOrders.map((order: Order) => (
              <div
                key={order.order_id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-black text-slate-900">{order.order_id}</span>
                      <span className="text-xs font-bold text-sky-600">@{order.chess_com_username}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Purchased on {new Date(order.created_at).toLocaleDateString()} • {order.item_title}
                    </p>
                  </div>

                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 ${
                      order.payment_status === 'verified' || order.payment_status === 'approved' || order.payment_status === 'activated'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.payment_status === 'rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {order.payment_status === 'verified' || order.payment_status === 'approved' || order.payment_status === 'activated' ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <Clock className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {order.payment_status === 'verified' || order.payment_status === 'approved' || order.payment_status === 'activated'
                          ? 'Activated'
                          : order.payment_status}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Plan</span>
                    <span className="font-bold text-slate-900">{order.item_title}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Amount Paid</span>
                    <span className="font-bold text-slate-900">{order.currency} ${order.amount}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Payment Method</span>
                    <span className="font-mono font-bold text-slate-700">{order.payment_method}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">PayPal Tx ID</span>
                    <span className="font-mono text-slate-700">{order.paypal_transaction_id}</span>
                  </div>
                </div>

                {/* Rejection Notice & Instructions */}
                {order.payment_status === 'rejected' && (
                  <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 sm:p-5 text-xs text-rose-950 space-y-2.5">
                    <div className="flex items-center gap-2 font-bold text-rose-800">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Order Status Update: Activation Notice</span>
                    </div>
                    <div className="bg-white/90 border border-rose-100 rounded-xl p-3.5 text-rose-900 leading-relaxed font-sans shadow-2xs">
                      <span className="block text-[10px] uppercase font-bold text-rose-700 tracking-wider mb-1">
                        Reason Provided by Admin:
                      </span>
                      <p className="text-xs text-slate-800 leading-relaxed">
                        {order.rejection_reason || "This membership is exclusively available to US citizens. Citizens of other countries are not eligible to activate this membership. If you previously created an account with a different home country selected, please select the USA as your home country when creating a new account. Once the account has been created, please send me the username so I can proceed with reactivating it."}
                      </p>
                    </div>
                    <p className="text-[11px] text-rose-700">
                      Need help? Contact support directly at <a href={`mailto:${settings.support_email}`} className="font-bold underline hover:text-rose-900">{settings.support_email}</a>.
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Quick Demo Lookup Suggestions */}
      {!query && (
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-3 text-xs">
          <h4 className="font-bold text-slate-700">Quick Test Lookups:</h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setQuery('TacticalKnight99')}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sky-700 font-mono hover:border-sky-400 transition"
            >
              @TacticalKnight99
            </button>
            <button
              onClick={() => setQuery('CS-849201')}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sky-700 font-mono hover:border-sky-400 transition"
            >
              CS-849201
            </button>
            <button
              onClick={() => setQuery('ElenaGambit')}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sky-700 font-mono hover:border-sky-400 transition"
            >
              @ElenaGambit (Pending Order)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
