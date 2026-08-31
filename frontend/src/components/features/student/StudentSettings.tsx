import React, { useState } from 'react';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { Input } from '../../common/Input';
import { Select } from '../../common/Select';
import { Tabs } from '../../common/Tabs';
import { useAuth } from '../../../context/AuthContext';
import { User, Bell, BookOpen, Check } from 'lucide-react';

export const StudentSettings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
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
        <p className="text-xs text-slate-400 mt-1">Manage learning goals, audio voice speeds, and notification reminders.</p>
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
