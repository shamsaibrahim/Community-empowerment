'use client';

import { useState } from 'react';
import { 
  Settings, 
  Bell, 
  Shield, 
  Palette,
  Save,
  Check
} from 'lucide-react';

export default function AdminSettings() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'Community Empowerment Dashboard',
    siteDescription: 'Empowering Kenyan youth with economic opportunities',
    allowRegistration: true,
    requireEmailVerification: false,
    enableNotifications: true,
    moderatePostsBeforePublish: false,
    maxOpportunitiesPerPage: 10,
    defaultCurrency: 'KES',
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Configure your dashboard settings</p>
      </div>

      {/* General Settings */}
      <div className="p-6 rounded-xl bg-card border border-border space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-border">
          <Settings className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-foreground">General Settings</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Site Name</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Site Description</label>
            <textarea
              value={settings.siteDescription}
              onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:border-accent resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Default Currency</label>
              <select
                value={settings.defaultCurrency}
                onChange={(e) => setSettings({ ...settings, defaultCurrency: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:border-accent"
              >
                <option value="KES">KES (Kenyan Shilling)</option>
                <option value="USD">USD (US Dollar)</option>
                <option value="EUR">EUR (Euro)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Items Per Page</label>
              <input
                type="number"
                value={settings.maxOpportunitiesPerPage}
                onChange={(e) => setSettings({ ...settings, maxOpportunitiesPerPage: Number(e.target.value) })}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:border-accent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="p-6 rounded-xl bg-card border border-border space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-border">
          <Shield className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-foreground">Security & Access</h2>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border cursor-pointer hover:border-accent/50 transition-colors">
            <div>
              <p className="font-medium text-foreground">Allow User Registration</p>
              <p className="text-sm text-muted-foreground">Enable new users to create accounts</p>
            </div>
            <input
              type="checkbox"
              checked={settings.allowRegistration}
              onChange={(e) => setSettings({ ...settings, allowRegistration: e.target.checked })}
              className="w-5 h-5 accent-accent"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border cursor-pointer hover:border-accent/50 transition-colors">
            <div>
              <p className="font-medium text-foreground">Require Email Verification</p>
              <p className="text-sm text-muted-foreground">Users must verify email before accessing features</p>
            </div>
            <input
              type="checkbox"
              checked={settings.requireEmailVerification}
              onChange={(e) => setSettings({ ...settings, requireEmailVerification: e.target.checked })}
              className="w-5 h-5 accent-accent"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border cursor-pointer hover:border-accent/50 transition-colors">
            <div>
              <p className="font-medium text-foreground">Moderate Posts Before Publish</p>
              <p className="text-sm text-muted-foreground">Review community posts before they go live</p>
            </div>
            <input
              type="checkbox"
              checked={settings.moderatePostsBeforePublish}
              onChange={(e) => setSettings({ ...settings, moderatePostsBeforePublish: e.target.checked })}
              className="w-5 h-5 accent-accent"
            />
          </label>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="p-6 rounded-xl bg-card border border-border space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-border">
          <Bell className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
        </div>

        <label className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border cursor-pointer hover:border-accent/50 transition-colors">
          <div>
            <p className="font-medium text-foreground">Enable Email Notifications</p>
            <p className="text-sm text-muted-foreground">Send email alerts for important events</p>
          </div>
          <input
            type="checkbox"
            checked={settings.enableNotifications}
            onChange={(e) => setSettings({ ...settings, enableNotifications: e.target.checked })}
            className="w-5 h-5 accent-accent"
          />
        </label>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
            saved 
              ? 'bg-green-500 text-white' 
              : 'bg-accent text-accent-foreground hover:bg-accent/90'
          }`}
        >
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
