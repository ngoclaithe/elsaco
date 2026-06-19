'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import type { SiteSettings } from '@/lib/types';

export default function PortalSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [form, setForm] = useState({
    bankAccountName: '',
    bankAccountNumber: '',
    bankName: '',
    storeName: '',
    shippingFee: 30000,
    sepayWebhookKey: '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    adminApi.getSettings().then((s) => {
      setSettings(s);
      setForm({
        bankAccountName: s.bankAccountName,
        bankAccountNumber: s.bankAccountNumber,
        bankName: s.bankName,
        storeName: s.storeName,
        shippingFee: s.shippingFee,
        sepayWebhookKey: s.sepayWebhookKey,
      });
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const updated = await adminApi.updateSettings(form);
      setSettings(updated);
      setMessage('Settings saved');
    } catch {
      setMessage('Failed to save settings');
    }
    setSaving(false);
  };

  if (!settings) return <p className="text-muted">Loading...</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-medium mb-8">Payment settings</h1>

      <form onSubmit={handleSave} className="bg-white border border-neutral-200 p-6 space-y-4">
        <div>
          <label className="text-sm font-medium block mb-1">Account holder</label>
          <input
            className="input-field"
            value={form.bankAccountName}
            onChange={(e) => setForm({ ...form, bankAccountName: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Account number</label>
          <input
            className="input-field"
            value={form.bankAccountNumber}
            onChange={(e) => setForm({ ...form, bankAccountNumber: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Bank (SePay code)</label>
          <input
            className="input-field"
            value={form.bankName}
            onChange={(e) => setForm({ ...form, bankName: e.target.value })}
            placeholder="MBBank"
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Store name</label>
          <input
            className="input-field"
            value={form.storeName}
            onChange={(e) => setForm({ ...form, storeName: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Shipping fee (VND)</label>
          <input
            type="number"
            className="input-field"
            value={form.shippingFee}
            onChange={(e) => setForm({ ...form, shippingFee: Number(e.target.value) })}
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">SePay webhook API key</label>
          <input
            className="input-field font-mono text-xs"
            value={form.sepayWebhookKey}
            onChange={(e) => setForm({ ...form, sepayWebhookKey: e.target.value })}
          />
        </div>
        <div className="bg-neutral-50 p-4 text-sm">
          <p className="font-medium mb-1">Webhook URL (configure in SePay)</p>
          <p className="font-mono text-xs break-all">{settings.webhookUrl}</p>
          <p className="text-muted text-xs mt-2">
            Auth header: Authorization: Apikey {'{your API key}'}
          </p>
        </div>
        {message && <p className="text-sm">{message}</p>}
        <button type="submit" disabled={saving} className="btn-primary !py-2 !px-6">
          {saving ? 'Saving...' : 'Save settings'}
        </button>
      </form>
    </div>
  );
}
