import React, { useState } from 'react';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { Input } from '../../common/Input';
import { Select } from '../../common/Select';
import { Tabs } from '../../common/Tabs';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { User, Bell, BookOpen, Check, Sun, Moon, Palette } from 'lucide-react';

export const StudentSettings: React.FC = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'appearance', label: 'Xarici Görünüş', icon: <Palette className="w-4 h-4" /> },
    { id: 'learning', label: 'Learning Preferences', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Student Settings</h1>
        <p className="text-xs text-slate-400 mt-1">Manage learning goals, theme preferences, and notification reminders.</p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <form onSubmit={handleSave}>
        <Card className="p-6 space-y-6">
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white">Student Profile</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Full Name" defaultValue={user?.name || 'Anna Miller'} />
                <Input label="Email Address" defaultValue={user?.email || 'student@demo.com'} />
              </div>
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

          {activeTab === 'learning' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white">Learning Preferences</h3>
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Daily Word Goal"
                  options={[
                    { value: '5', label: '5 words / day' },
                    { value: '10', label: '10 words / day (Standard)' },
                    { value: '15', label: '15 words / day (Intensive)' },
                  ]}
                  defaultValue="10"
                />
                <Select
                  label="Audio Playback Speed"
                  options={[
                    { value: '0.75', label: '0.75x (Slower)' },
                    { value: '1.0', label: '1.0x (Normal)' },
                    { value: '1.25', label: '1.25x (Fast)' },
                  ]}
                  defaultValue="1.0"
                />
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white">Streak & Practice Reminders</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 text-xs text-slate-300">
                  <input type="checkbox" defaultChecked className="rounded bg-slate-950 border-slate-800 text-brand-600" />
                  Send daily evening notification to maintain streak 🔥
                </label>
                <label className="flex items-center gap-3 text-xs text-slate-300">
                  <input type="checkbox" defaultChecked className="rounded bg-slate-950 border-slate-800 text-brand-600" />
                  Notify when teacher publishes new vocabulary set
                </label>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <Button type="submit" variant="gradient" leftIcon={saved ? <Check className="w-4 h-4" /> : undefined}>
              {saved ? 'Preferences Saved!' : 'Save Preferences'}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};
