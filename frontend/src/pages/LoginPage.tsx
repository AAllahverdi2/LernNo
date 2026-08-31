import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BrainCircuit, UserCheck, Sparkles, ShieldCheck, ArrowRight, Lock, Mail, User as UserIcon } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';

export const LoginPage: React.FC = () => {
  const { login, register, loginAsTeacher, loginAsStudent, loginAsAdmin } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'TEACHER' | 'STUDENT'>('TEACHER');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    try {
      await login({ email, password });
      if (email === 'agamaliyevallahverdii@gmail.com') {
        navigate('/admin/users');
      } else {
        navigate('/teacher');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Giriş uğursuz oldu. E-poçt və ya şifrə səhvdir.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    try {
      await register({ name, email, password, role });
      if (role === 'TEACHER') {
        navigate('/teacher');
      } else {
        navigate('/student');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Qeydiyyat uğursuz oldu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 font-sans relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 z-10 animate-scaleUp">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-purple-500 flex items-center justify-center mx-auto shadow-2xl shadow-brand-600/40 border border-white/20">
            <BrainCircuit className="w-9 h-9 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight flex items-center justify-center gap-2">
              LernNo <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">AI Platform</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Məllim və Tələbələr üçün AI-Dəstəkli Dil Tədrisi Platforması
            </p>
          </div>
        </div>

        {/* Tab Switcher (Giriş / Qeydiyyat) */}
        <div className="p-1 rounded-2xl bg-slate-900 border border-slate-800 flex">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all ${
              mode === 'login' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Giriş et (Login)
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all ${
              mode === 'register' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Qeydiyyat (Register)
          </button>
        </div>

        {/* Main Form Box */}
        <div className="p-7 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-5">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold text-center">
              {errorMessage}
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <Input
                label="E-poçt Ünvanı"
                type="email"
                placeholder="teacher@demo.com və ya student@demo.com"
                leftIcon={<Mail className="w-4 h-4" />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Şifrə"
                type="password"
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button
                type="submit"
                variant="gradient"
                className="w-full py-3"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Hesaba Giriş Et →
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <Input
                label="Tam Adınız"
                type="text"
                placeholder="e.g. Dr. Markus Weber"
                leftIcon={<UserIcon className="w-4 h-4" />}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                label="E-poçt Ünvanı"
                type="email"
                placeholder="adiniz@example.com"
                leftIcon={<Mail className="w-4 h-4" />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Şifrə Seçin"
                type="password"
                placeholder="Minimum 6 simvol"
                leftIcon={<Lock className="w-4 h-4" />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Select
                label="Rolunuzu Seçin"
                options={[
                  { value: 'TEACHER', label: 'Məllim (Teacher) — Dərs və lüğət yaradıcısı' },
                  { value: 'STUDENT', label: 'Tələbə (Student) — Öyrənən və test verən' },
                ]}
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
              />

              <Button
                type="submit"
                variant="gradient"
                className="w-full py-3"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Yeni Hesab Yaradın →
              </Button>
            </form>
          )}

          {/* Quick Demo Accounts Separator */}
          <div className="relative pt-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-500">
              <span className="bg-slate-900 px-3">və ya Sürətli Demo Düymələri</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                loginAsTeacher();
                navigate('/teacher');
              }}
              className="p-2.5 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-300 hover:bg-brand-500/20 text-center transition-all group"
            >
              <UserCheck className="w-4 h-4 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold block">Məllim</span>
            </button>

            <button
              type="button"
              onClick={() => {
                loginAsStudent();
                navigate('/student');
              }}
              className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20 text-center transition-all group"
            >
              <Sparkles className="w-4 h-4 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold block">Tələbə</span>
            </button>

            <button
              type="button"
              onClick={() => {
                loginAsAdmin();
                navigate('/admin/users');
              }}
              className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 text-center transition-all group"
            >
              <ShieldCheck className="w-4 h-4 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold block">Admin</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
