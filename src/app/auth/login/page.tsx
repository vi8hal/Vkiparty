'use client';
// src/app/auth/login/page.tsx

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPwd, setShowPwd]   = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { toast.error('Please fill all fields'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error?.message || 'Login failed'); return; }
      toast.success(`Welcome back, ${data.data.user.fullName}!`);
      router.push('/dashboard');
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-vanda flex items-center justify-center px-4 relative overflow-hidden">
      <div className="grain-overlay" />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 60% at 50% 40%, rgba(255,107,0,0.08) 0%, transparent 70%)' }} />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: 'linear-gradient(135deg,#FFD700,#FF6B00)' }}>🇮🇳</div>
            <span className="font-display font-extrabold text-2xl">
              <span className="text-gold">MANKI</span><span className="text-saffron"> PARTY</span>
            </span>
          </Link>
          <h1 className="font-display font-bold text-2xl text-white">
            <span className="seo-strip">Welcome Back</span>
          </h1>
          <p className="text-text-muted text-sm mt-1">Sign in to your account</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-8 shadow-card">
          <div className="space-y-4">
            <div>
              <label className="text-xs text-text-muted tracking-widest uppercase mb-1.5 block">Email</label>
              <input className="input-manki" type="email" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs text-text-muted tracking-widest uppercase">Password</label>
                <Link href="/auth/forgot-password" className="text-xs text-saffron hover:text-gold">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input className="input-manki pr-12"
                  type={showPwd ? 'text' : 'password'} placeholder="Your password"
                  value={password} onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()} />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                  onClick={() => setShowPwd(!showPwd)}>
                  {showPwd ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button className="btn-manki w-full py-3 mt-2" onClick={handleLogin} disabled={loading}>
              {loading ? '⏳ Signing in…' : '🚀 Sign In'}
            </button>
          </div>

          <p className="text-center text-text-muted text-sm mt-5">
            Not a member?{' '}
            <Link href="/auth/register" className="text-saffron hover:text-gold font-semibold">
              Join Manki Party →
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
