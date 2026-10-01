import React, { useState } from 'react';
import { 
  X, Database, Code, CreditCard, Cloud, 
  Check, Copy, ExternalLink, ShieldCheck, Play, RefreshCw, Sparkles 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ApiService } from '../services/apiService';

export const BackendHubModal: React.FC = () => {
  const { isBackendHubOpen, setIsBackendHubOpen, settings, updateSettings } = useApp();
  const [activeTab, setActiveTab] = useState<'sheets' | 'gas' | 'paypal' | 'deploy'>('sheets');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Test URL state
  const [gasUrlInput, setGasUrlInput] = useState(settings.gas_api_url || '');
  const [isTestingGas, setIsTestingGas] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; latencyMs?: number } | null>(null);

  if (!isBackendHubOpen) return null;

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleTestConnection = async () => {
    if (!gasUrlInput.trim()) return;
    setIsTestingGas(true);
    setTestResult(null);
    const result = await ApiService.pingGasApi(gasUrlInput);
    setIsTestingGas(false);
    setTestResult(result);
    if (result.success) {
      updateSettings({ gas_api_url: gasUrlInput, use_gas_api: true });
    }
  };

  const sheetsSchema = [
    { name: 'DiamondOrders', cols: 'order_id, chess_com_username, user_email, plan_title, amount, currency, payment_method, paypal_transaction_id, payment_status, activation_code, notes, created_at, verified_at' },
    { name: 'Customers', cols: 'user_id, full_name, email, chess_com_username, role, created_at, updated_at' },
    { name: 'DiamondPlans', cols: 'plan_id, plan_name, duration_months, price, original_price, savings_percent, active' },
    { name: 'ContactInquiries', cols: 'message_id, name, email, chess_com_username, subject, message, status, created_at' },
    { name: 'StoreSettings', cols: 'setting_key, setting_value' }
  ];

  const gasCodeSnippet = `/**
 * Chess Shop - Google Apps Script Entry Point (Code.gs)
 * Deployed as Web App (Execute as: Me, Access: Anyone)
 */
function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || 'ping';
  if (action === 'ping') {
    return ContentService.createTextOutput(JSON.stringify({ 
      success: true, 
      message: 'Chess Shop Google Apps Script API is operational!' 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;
    
    if (action === 'createOrder') {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = ss.getSheetByName('DiamondOrders');
      sheet.appendRow([
        payload.order_id,
        payload.chess_com_username,
        payload.email || '',
        payload.plan,
        payload.amount,
        'USD',
        'paypal_me',
        payload.paypal_tx,
        payload.status,
        payload.activation_code || '',
        payload.notes || '',
        new Date().toISOString(),
        ''
      ]);
      return ContentService.createTextOutput(JSON.stringify({ success: true, order_id: payload.order_id }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  } finally {
    lock.releaseLock();
  }
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs font-sans">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full h-[90vh] max-h-[820px] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-cinzel text-white flex items-center gap-2">
                Chess Shop Backend Architecture
              </h3>
              <p className="text-xs text-slate-400">
                Google Sheets Database, Google Apps Script API & Netlify Deployment
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsBackendHubOpen(false)}
            className="text-slate-400 hover:text-white p-2 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50 gap-2 overflow-x-auto text-xs font-bold text-slate-600 shrink-0">
          <button
            onClick={() => setActiveTab('sheets')}
            className={`py-3.5 px-3 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'sheets' ? 'border-sky-600 text-sky-600' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Database className="w-4 h-4" /> 1. Google Sheets
          </button>
          <button
            onClick={() => setActiveTab('gas')}
            className={`py-3.5 px-3 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'gas' ? 'border-sky-600 text-sky-600' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Code className="w-4 h-4" /> 2. Google Apps Script
          </button>
          <button
            onClick={() => setActiveTab('paypal')}
            className={`py-3.5 px-3 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'paypal' ? 'border-sky-600 text-sky-600' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4" /> 3. PayPal.me Setup
          </button>
          <button
            onClick={() => setActiveTab('deploy')}
            className={`py-3.5 px-3 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'deploy' ? 'border-sky-600 text-sky-600' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Cloud className="w-4 h-4" /> 4. Netlify Hosting
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-600">
          {/* TAB 1: SHEETS */}
          {activeTab === 'sheets' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-900 font-cinzel">Google Sheets Database Structure</h4>
                <p className="text-slate-500">
                  Create a new Google Spreadsheet named <strong>"Chess Shop Database"</strong> with the following sheets and header columns:
                </p>
              </div>

              <div className="space-y-3">
                {sheetsSchema.map(s => (
                  <div key={s.name} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Sheet: {s.name}
                      </span>
                      <button
                        onClick={() => copyToClipboard(s.cols, s.name)}
                        className="text-[11px] text-sky-600 font-bold hover:underline flex items-center gap-1"
                      >
                        {copiedSection === s.name ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        Copy Columns
                      </button>
                    </div>
                    <code className="text-[11px] font-mono text-slate-600 bg-white p-2 rounded border border-slate-200 block overflow-x-auto whitespace-nowrap">
                      {s.cols}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: GAS */}
          {activeTab === 'gas' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-900 font-cinzel">Google Apps Script Web App</h4>
                <p className="text-slate-500">
                  Inside your Google Sheet, click <strong>Extensions &gt; Apps Script</strong> and paste this snippet. Deploy as Web App with access granted to <em>"Anyone"</em>.
                </p>
              </div>

              <div className="relative">
                <button
                  onClick={() => copyToClipboard(gasCodeSnippet, 'gas')}
                  className="absolute top-3 right-3 px-3 py-1 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1"
                >
                  {copiedSection === 'gas' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSection === 'gas' ? 'Copied' : 'Copy Code'}</span>
                </button>
                <pre className="bg-slate-950 text-slate-200 p-4 rounded-2xl font-mono text-[11px] overflow-x-auto max-h-64 border border-slate-800">
                  {gasCodeSnippet}
                </pre>
              </div>

              {/* URL Tester */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h5 className="font-bold text-slate-900">Connect & Test Live Web App URL</h5>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://script.google.com/macros/s/.../exec"
                    value={gasUrlInput}
                    onChange={e => setGasUrlInput(e.target.value)}
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2 font-mono text-xs focus:outline-none"
                  />
                  <button
                    onClick={handleTestConnection}
                    disabled={isTestingGas || !gasUrlInput}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isTestingGas ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                    <span>Test Ping</span>
                  </button>
                </div>

                {testResult && (
                  <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                    testResult.success ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}>
                    {testResult.success ? <Check className="w-4 h-4 text-emerald-600" /> : <X className="w-4 h-4 text-rose-600" />}
                    <span>{testResult.message}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PAYPAL */}
          {activeTab === 'paypal' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-slate-900 font-cinzel">PayPal.me Payment Links</h4>
              <p className="text-slate-600 leading-relaxed">
                Chess Shop generates direct PayPal.me URLs for each Diamond plan:
              </p>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 font-mono text-xs text-sky-700">
                https://paypal.me/{settings.paypal_me_username}/[AMOUNT]
              </div>
              <p className="text-slate-500">
                Current configured PayPal username: <strong>{settings.paypal_me_username}</strong>. You can change this in the Admin Desk settings anytime.
              </p>
            </div>
          )}

          {/* TAB 4: DEPLOY */}
          {activeTab === 'deploy' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-slate-900 font-cinzel">Deploying to Netlify</h4>
              <ol className="list-decimal list-inside space-y-2 text-slate-600">
                <li>Push repository to your GitHub account.</li>
                <li>Connect your repo to Netlify.</li>
                <li>Build Command: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">npm run build</code></li>
                <li>Publish Directory: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">dist</code></li>
                <li>SPA redirection is already configured via <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">netlify.toml</code>.</li>
              </ol>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={() => setIsBackendHubOpen(false)}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition"
          >
            Close Architecture Hub
          </button>
        </div>
      </div>
    </div>
  );
};
