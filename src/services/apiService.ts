import { User, Order, ContactMessage, SiteSettings, DiamondPlan } from '../types';

export class ApiService {
  private static getApiUrl(): string {
    const savedSettings = localStorage.getItem('cs_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.use_gas_api && parsed.gas_api_url) {
          return parsed.gas_api_url;
        }
      } catch (e) {
        console.error('Failed to parse site settings', e);
      }
    }
    return import.meta.env.VITE_API_URL || '';
  }

  /**
   * Test the connectivity of a Google Apps Script Web App URL
   */
  static async pingGasApi(url: string): Promise<{ success: boolean; message: string; latencyMs: number }> {
    const startTime = performance.now();
    try {
      const cleanUrl = url.trim();
      const testUrl = cleanUrl.includes('?') ? `${cleanUrl}&action=ping` : `${cleanUrl}?action=ping`;
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      const latencyMs = Math.round(performance.now() - startTime);
      if (!response.ok) {
        return { success: false, message: `HTTP status ${response.status}`, latencyMs };
      }
      const data = await response.json();
      return { 
        success: true, 
        message: data.message || 'Connected successfully to Google Apps Script backend.',
        latencyMs 
      };
    } catch (err: any) {
      const latencyMs = Math.round(performance.now() - startTime);
      return { 
        success: false, 
        message: err.message || 'Failed to connect. Check CORS or URL deployment settings.',
        latencyMs 
      };
    }
  }

  /**
   * Universal GET dispatcher
   */
  static async get(action: string, params: Record<string, string> = {}): Promise<any> {
    const apiUrl = this.getApiUrl();
    if (!apiUrl) return null; // Fallback to local state

    const url = new URL(apiUrl);
    url.searchParams.set('action', action);
    Object.entries(params).forEach(([key, val]) => url.searchParams.set(key, val));

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    return res.json();
  }

  /**
   * Universal POST dispatcher
   */
  static async post(action: string, payload: Record<string, any> = {}): Promise<any> {
    const apiUrl = this.getApiUrl();
    if (!apiUrl) return null; // Fallback to local state

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // GAS handles text/plain without preflight CORS blocks
      body: JSON.stringify({ action, ...payload })
    });
    return res.json();
  }
}
