import React, { useState } from 'react';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { Input } from '../../common/Input';
import { Select } from '../../common/Select';
import { Tabs } from '../../common/Tabs';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { User, Bell, Sparkles, Sliders, Check, Sun, Moon, Palette } from 'lucide-react';

export const TeacherSettings: React.FC = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'appearance', label: 'Xarici Görünüş', icon: <Palette className="w-4 h-4" /> },
    { id: 'class-settings', label: 'Class Settings', icon: <Sliders className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'ai-settings', label: 'AI Settings', icon: <Sparkles className="w-4 h-4" /> },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Teacher Settings</h1>
        <p className="text-xs text-slate-400 mt-1">Manage profile information, theme preferences, and class defaults.</p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <form onSubmit={handleSave}>
        <Card className="p-6 space-y-6">
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white">Teacher Profile</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Full Name" defaultValue={user?.name || 'Dr. Markus Weber'} />
                <Input label="Email Address" defaultValue={user?.email || 'teacher@demo.com'} />
              </div>
              <Input label="Professional Title" defaultValue="Senior German Lecturer & Curriculum Specialist" />
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white">Sistem Mövzusu (Theme)</h3>
              <p className="text-xs text-slate-400">Tətbiqin görünüşünü Qaranlıq (Dark Mode) və ya İşıqlı (White Mode) olaraq təyin edin.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`p-5 rounded-2xl border text-left transition-all flex items-center justify-between gap-4 ${
                    theme === 'dark'
                      ? 'bg-brand-950/40 border-brand-500 ring-2 ring-brand-500/30'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 rounded-xl bg-slate-900 text-purple-400 border border-slate-800">
                      <Moon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Qaranlıq Rejim (Dark Mode)</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Sleek dark theme with vibrant accents</p>
                    </div>
                  </div>
                  {theme === 'dark' && <Check className="w-5 h-5 text-brand-400 shrink-0" />}
                </button>

                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`p-5 rounded-2xl border text-left transition-all flex items-center justify-between gap-4 ${
                    theme === 'light'
                      ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 rounded-xl bg-amber-500/20 text-amber-500 border border-amber-500/30">
                      <Sun className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">İşıqlı Rejim (White Mode)</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Clean light theme for bright environments</p>
                    </div>
                  </div>
                  {theme === 'light' && <Check className="w-5 h-5 text-amber-500 shrink-0" />}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'class-settings' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white">Default Class Parameters</h3>
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Primary Language Taught"
                  options={[{ value: 'German', label: 'German' }]}
                  defaultValue="German"
                />
                <Input label="Default Daily Target Words" defaultValue="10" />
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white">Notification Preferences</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 text-xs text-slate-300">
                  <input type="checkbox" defaultChecked className="rounded bg-slate-950 border-slate-800 text-brand-600" />
                  Email alert when student completes quiz below 60% score
                </label>
                <label className="flex items-center gap-3 text-xs text-slate-300">
                  <input type="checkbox" defaultChecked className="rounded bg-slate-950 border-slate-800 text-brand-600" />
                  Daily summary email of student streak activity
                </label>
              </div>
            </div>
          )}

          {activeTab === 'ai-settings' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white">AI Generation Configuration</h3>
              <Select
                label="Preferred AI Model"
                options={[
                  { value: 'lexora-gemini-3.5', label: 'Lexora AI (Gemini 3.5 Flash - Fast & Accurate)' },
                  { value: 'gpt-4o', label: 'Lexora AI Pro (Extended Example Generation)' },
                ]}
              />
              <Input label="Default Generated Example Sentences" defaultValue="1 sentence per word" />
            </div>
          )}

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <Button type="submit" variant="gradient" leftIcon={saved ? <Check className="w-4 h-4" /> : undefined}>
              {saved ? 'Settings Saved!' : 'Save Settings'}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};
