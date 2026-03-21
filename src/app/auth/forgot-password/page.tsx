'use client';
// src/app/auth/forgot-password/page.tsx

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

type Stage = 'email' | 'otp' | 'reset' | 'done';

export default function ForgotPasswordPage() {
  const router  = useRouter();
  const [stage, setStage]       = useState<Stage>('email');
  const [email, setEmail]       = useState('');
  const [otp, setOtp]           = useState('');
  const [newPwd, setNewPwd]     = useState('');
  const [confirmPwd, setConfirm] = useState('');
  const [loading, setLoading]   = useState(false);

  const sendOtp = async () => {
    if (!email) { toast.error('Enter your email'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      toast.success('If that email is registered, a code has been sent.');
      setStage('otp');
    } catch { toast.error('Network error'); }
    finally { setLoading(false); }
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) { toast.error('Enter 6-digit code'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, purpose: 'FORGOT_PASSWORD' }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error?.message || 'Invalid code'); return; }
      setStage('reset');
    } catch { toast.error('Network error'); }
    finally { setLoading(false); }
  };

  const resetPassword = async () => {
    if (newPwd !== confirmPwd) { toast.error('Passwords do not match'); return; }
    if (newPwd.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword: newPwd }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error?.message || 'Reset failed'); return; }
      setStage('done');
      setTimeout(() => router.push('/auth/login'), 2000);
    } catch { toast.error('Network error'); }
    finally { setLoading(false); }
  };

  const stageIcons: Record<Stage, string> = {
    email: '📧', otp: '🔢', reset: '🔐', done: '✅',
  };

  return (
    <div className="min-h-screen bg-vanda flex items-center justify-center px-4 relative overflow-hidden">
      <div className="grain-overlay" />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(255,215,0,0.06) 0%, transparent 70%)' }} />

      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: 'linear-gradient(135deg,#FFD700,#FF6B00)' }}>🇮🇳</div>
            <span className="font-display font-extrabold text-2xl">
              <span className="text-gold">MANKI</span><span className="text-saffron"> PARTY</span>
            </span>
          </Link>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-8 shadow-card">
          <AnimatePresence mode="wait">
            {stage === 'email' && (
              <motion.div key="email" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}>
                <div className="text-center mb-6">
                  <div className="text-5xl mb-3">📧</div>
                  <h2 className="font-display font-bold text-xl text-white">
                    <span className="seo-strip">Forgot Password?</span>
                  </h2>
                  <p className="text-text-muted text-sm mt-1">Enter your registered email to receive a reset code</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-text-muted tracking-widest uppercase mb-1.5 block">Email Address</label>
                    <input className="input-manki" type="email" placeholder="you@example.com"
                      value={email} onChange={e => setEmail(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && sendOtp()} />
                  </div>
                  <button className="btn-manki w-full" onClick={sendOtp} disabled={loading}>
                    {loading ? '⏳ Sending…' : '📤 Send Reset Code'}
                  </button>
                  <p className="text-center text-text-muted text-sm">
                    <Link href="/auth/login" className="text-saffron hover:text-gold">← Back to Login</Link>
                  </p>
                </div>
              </motion.div>
            )}

            {stage === 'otp' && (
              <motion.div key="otp" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}>
                <div className="text-center mb-6">
                  <div className="text-5xl mb-3">🔢</div>
                  <h2 className="font-display font-bold text-xl text-white">Enter Reset Code</h2>
                  <p className="text-text-muted text-sm mt-1">
                    Code sent to <strong className="text-gold">{email}</strong>
                  </p>
                </div>
                <div className="space-y-4">
                  <input className="input-manki text-center text-3xl tracking-[16px] font-mono"
                    maxLength={6} placeholder="• • • • • •"
                    value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} />
                  <button className="btn-manki w-full" onClick={verifyOtp} disabled={loading}>
                    {loading ? '⏳ Verifying…' : '✅ Verify Code'}
                  </button>
                  <button className="w-full text-text-muted text-sm hover:text-saffron"
                    onClick={() => { setStage('email'); setOtp(''); }}>
                    ← Change email
                  </button>
                </div>
              </motion.div>
            )}

            {stage === 'reset' && (
              <motion.div key="reset" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}>
                <div className="text-center mb-6">
                  <div className="text-5xl mb-3">🔐</div>
                  <h2 className="font-display font-bold text-xl text-white">Set New Password</h2>
                  <p className="text-text-muted text-sm mt-1">Choose a strong password</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-text-muted tracking-widest uppercase mb-1.5 block">New Password</label>
                    <input className="input-manki" type="password" placeholder="Min 8 chars, 1 uppercase, 1 number"
                      value={newPwd} onChange={e => setNewPwd(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-text-muted tracking-widest uppercase mb-1.5 block">Confirm Password</label>
                    <input className="input-manki" type="password" placeholder="Repeat password"
                      value={confirmPwd} onChange={e => setConfirm(e.target.value)} />
                  </div>
                  <button className="btn-manki w-full" onClick={resetPassword} disabled={loading}>
                    {loading ? '⏳ Updating…' : '🔐 Reset Password'}
                  </button>
                </div>
              </motion.div>
            )}

            {stage === 'done' && (
              <motion.div key="done" initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
                className="text-center py-6">
                <motion.div animate={{ scale: [1,1.2,1] }} transition={{ duration:0.5 }} className="text-6xl mb-4">✅</motion.div>
                <h2 className="font-display font-bold text-2xl text-gold mb-2">Password Reset!</h2>
                <p className="text-text-muted">Redirecting to login…</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
