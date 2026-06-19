'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import { PortalPageHeader, PortalField, PortalPanel } from '@/components/admin/PortalUI';
import type { SiteSettings } from '@/lib/types';

const sections = [
  { id: 'bank', label: 'Bank account', desc: 'SePay transfer details' },
  { id: 'store', label: 'Store', desc: 'Name and shipping fee' },
  { id: 'sepay', label: 'SePay webhook', desc: 'API key and callback URL' },
] as const;

type SectionId = (typeof sections)[number]['id'];

export default function PortalSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [active, setActive] = useState<SectionId>('bank');
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
      setMessage('Settings saved successfully');
    } catch {
      setMessage('Failed to save settings');
    }
    setSaving(false);
  };

  if (!settings) {
    return <p className="text-muted">Loading settings...</p>;
  }

  const activeSection = sections.find((s) => s.id === active)!;

  return (
    <div>
      <PortalPageHeader title="Settings" description="Payment, store, and SePay configuration" />

      <div className="grid lg:grid-cols-[260px_1fr] gap-6 items-start">
        <PortalPanel className="p-2">
          <nav className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActive(section.id)}
                className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                  active === section.id
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
                }`}
              >
                <p className="text-sm font-medium">{section.label}</p>
                <p className={`text-xs mt-0.5 ${active === section.id ? 'text-neutral-300' : 'text-muted'}`}>
                  {section.desc}
                </p>
              </button>
            ))}
          </nav>
        </PortalPanel>

        <PortalPanel className="p-6">
          <div className="mb-6 pb-4 border-b border-neutral-200">
            <h2 className="text-lg font-semibold">{activeSection.label}</h2>
            <p className="text-sm text-muted mt-1">{activeSection.desc}</p>
          </div>

          <form onSubmit={handleSave} className="space-y-5 max-w-xl">
            {active === 'bank' && (
              <>
                <PortalField label="Account holder">
                  <input className="input-field" value={form.bankAccountName} onChange={(e) => setForm({ ...form, bankAccountName: e.target.value })} />
                </PortalField>
                <PortalField label="Account number">
                  <input className="input-field font-mono" value={form.bankAccountNumber} onChange={(e) => setForm({ ...form, bankAccountNumber: e.target.value })} />
                </PortalField>
                <PortalField label="Bank (SePay code)" hint="e.g. MBBank, Vietcombank">
                  <input className="input-field" value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })} placeholder="MBBank" />
                </PortalField>
              </>
            )}

            {active === 'store' && (
              <>
                <PortalField label="Store name" hint="Shown on payment QR and transfer">
                  <input className="input-field" value={form.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })} />
                </PortalField>
                <PortalField label="Shipping fee (VND)">
                  <input type="number" min={0} className="input-field" value={form.shippingFee} onChange={(e) => setForm({ ...form, shippingFee: Number(e.target.value) })} />
                </PortalField>
              </>
            )}

            {active === 'sepay' && (
              <>
                <PortalField label="SePay webhook API key">
                  <input className="input-field font-mono text-xs" value={form.sepayWebhookKey} onChange={(e) => setForm({ ...form, sepayWebhookKey: e.target.value })} />
                </PortalField>
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 text-sm space-y-2">
                  <p className="font-medium">Webhook URL</p>
                  <p className="font-mono text-xs break-all bg-white border border-neutral-200 rounded px-3 py-2">
                    {settings.webhookUrl}
                  </p>
                  <p className="text-xs text-muted">
                    Configure in SePay dashboard. Auth header:{' '}
                    <code className="bg-white px-1">Authorization: Apikey {'{your API key}'}</code>
                  </p>
                </div>
              </>
            )}

            {message && (
              <p className={`text-sm ${message.includes('Failed') ? 'text-sale' : 'text-emerald-700'}`}>
                {message}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="btn-primary !py-2.5 !px-8">
                {saving ? 'Saving...' : 'Save settings'}
              </button>
            </div>
          </form>
        </PortalPanel>
      </div>
    </div>
  );
}
