'use client';
// ============================================================
// src/app/auth/register/page.tsx
// Multi-step registration: Details → OTP Verify → Profile
// ============================================================

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

type Step = 'details' | 'otp' | 'success';

const POST_OPTIONS = [
  { value: 'KARYAKARTA',       label: 'Karyakarta (General Worker)' },
  { value: 'PRESIDENT',        label: 'Adhyaksha (President)' },
  { value: 'VICE_PRESIDENT',   label: 'Upa-Adhyaksha (Vice President)' },
  { value: 'SECRETARY',        label: 'Mantri (Secretary)' },
  { value: 'JOINT_SECRETARY',  label: 'Sah-Mantri (Joint Secretary)' },
  { value: 'TREASURER',        label: 'Koshaadhyaksha (Treasurer)' },
  { value: 'SPOKESPERSON',     label: 'Praavakta (Spokesperson)' },
  { value: 'YOUTH_WING',       label: 'Yuva Pramukh' },
  { value: 'WOMEN_WING',       label: 'Mahila Pramukh' },
];

interface FormData {
  email: string; password: string; confirmPassword: string;
  fullName: string; age: string; phone: string;
  designatedPost: string; locationId: string;
}

export default function RegisterPage() {
  const router  = useRouter();
  const [step, setStep]     = useState<Step>('details');
  const [otp,  setOtp]      = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmailStore] = useState('');
  const [form, setForm] = useState<FormData>({
    email: '', password: '', confirmPassword: '', fullName: '',
    age: '', phone: '', designatedPost: 'KARYAKARTA', locationId: '',
  });

  const update = (k: keyof FormData, v: string) =>
    setForm(f => ({ ...f, [k]: v }));

  // Step 1: Send OTP
  const handleRegister = async () => {
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match'); return;
    }
    if (!form.locationId) {
      toast.error('Please enter your Location ID (from admin)'); return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email, password: form.password,
          fullName: form.fullName, age: Number(form.age),
          designatedPost: form.designatedPost,
          locationId: form.locationId,
          phone: form.phone || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error?.message || 'Registration failed'); return;
      }
      setEmailStore(form.email);
      setStep('otp');
      toast.success('Verification code sent to your email!');
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerify = async () => {
    if (otp.length !== 6) { toast.error('Enter 6-digit code'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, purpose: 'REGISTRATION' }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error?.message || 'Invalid code'); return;
      }
      setStep('success');
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-vanda flex items-center justify-center px-4 py-16 relative overflow-hidden">
      <div className="grain-overlay" />
      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(255,107,0,0.07) 0%, transparent 70%)' }} />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: 'linear-gradient(135deg,#FFD700,#FF6B00)' }}>
              🇮🇳
            </div>
            <span className="font-display font-extrabold text-2xl">
              <span className="text-gold">MANKI</span>
              <span className="text-saffron"> PARTY</span>
            </span>
          </Link>
          <h1 className="font-display font-bold text-2xl text-white">
            <span className="seo-strip">Join the Movement</span>
          </h1>
          <p className="text-text-muted text-sm mt-2">Register as a Karyakarta or Postholder</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {(['details','otp','success'] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                ${step === s ? 'bg-saffron text-vanda' :
                  ['details','otp','success'].indexOf(step) > i
                  ? 'bg-gold text-vanda' : 'bg-vanda-light text-text-muted'}`}>
                {['details','otp','success'].indexOf(step) > i ? '✓' : i + 1}
              </div>
              {i < 2 && <div className="flex-1 h-px bg-vanda-light" />}
            </div>
          ))}
        </div>

        {/* Form card */}
        <div className="glass rounded-2xl p-8 shadow-card">
          <AnimatePresence mode="wait">

            {/* ── Step 1: Details ── */}
            {step === 'details' && (
              <motion.div key="details"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-4">
                <h2 className="font-display font-bold text-xl text-white mb-4">Your Details</h2>

                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-xs text-text-muted tracking-wider uppercase mb-1 block">Full Name *</label>
                    <input className="input-manki" placeholder="Ramesh Kumar Yadav"
                      value={form.fullName} onChange={e => update('fullName', e.target.value)} />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-text-muted tracking-wider uppercase mb-1 block">Email *</label>
                    <input className="input-manki" type="email" placeholder="you@example.com"
                      value={form.email} onChange={e => update('email', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-text-muted tracking-wider uppercase mb-1 block">Age *</label>
                    <input className="input-manki" type="number" placeholder="25" min="18"
                      value={form.age} onChange={e => update('age', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-text-muted tracking-wider uppercase mb-1 block">Phone</label>
                    <input className="input-manki" placeholder="9XXXXXXXXX"
                      value={form.phone} onChange={e => update('phone', e.target.value)} />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-text-muted tracking-wider uppercase mb-1 block">Designated Post *</label>
                    <select className="input-manki"
                      value={form.designatedPost} onChange={e => update('designatedPost', e.target.value)}>
                      {POST_OPTIONS.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-text-muted tracking-wider uppercase mb-1 block">
                      Location ID * <span className="text-saffron">(provided by admin)</span>
                    </label>
                    <input className="input-manki" placeholder="UUID from your committee admin"
                      value={form.locationId} onChange={e => update('locationId', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-text-muted tracking-wider uppercase mb-1 block">Password *</label>
                    <input className="input-manki" type="password" placeholder="Min 8 chars"
                      value={form.password} onChange={e => update('password', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-text-muted tracking-wider uppercase mb-1 block">Confirm *</label>
                    <input className="input-manki" type="password" placeholder="Repeat"
                      value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} />
                  </div>
                </div>

                <button className="btn-manki w-full mt-4" onClick={handleRegister} disabled={loading}>
                  {loading ? '⏳ Sending Code…' : 'Continue →'}
                </button>

                <p className="text-center text-text-muted text-sm mt-3">
                  Already registered?{' '}
                  <Link href="/auth/login" className="text-saffron hover:text-gold">Sign in</Link>
                </p>
              </motion.div>
            )}

            {/* ── Step 2: OTP ── */}
            {step === 'otp' && (
              <motion.div key="otp"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="text-center">
                <div className="text-5xl mb-4">📧</div>
                <h2 className="font-display font-bold text-xl text-white mb-2">Verify Your Email</h2>
                <p className="text-text-dim text-sm mb-6">
                  We sent a 6-digit code to <strong className="text-gold">{email}</strong>.
                  Valid for 10 minutes.
                </p>

                <input
                  className="input-manki text-center text-3xl tracking-[16px] font-mono mb-6"
                  maxLength={6} placeholder="• • • • • •"
                  value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                />

                <button className="btn-manki w-full" onClick={handleVerify} disabled={loading}>
                  {loading ? '⏳ Verifying…' : '✅ Verify & Create Account'}
                </button>

                <button
                  className="text-text-muted text-sm mt-4 hover:text-saffron"
                  onClick={() => { setStep('details'); setOtp(''); }}>
                  ← Change email or resend
                </button>
              </motion.div>
            )}

            {/* ── Step 3: Success ── */}
            {step === 'success' && (
              <motion.div key="success"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                  className="text-6xl mb-4">🎉</motion.div>
                <h2 className="font-display font-bold text-2xl text-gold mb-2">Welcome to Manki Party!</h2>
                <p className="text-text-dim">Redirecting to your dashboard…</p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
