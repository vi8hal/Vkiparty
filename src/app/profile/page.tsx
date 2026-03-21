'use client';
// ============================================================
// src/app/profile/page.tsx — User Profile Management
// ============================================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const MOCK_USER = {
  id: 'uuid-001',
  fullName: 'Mukesh Pandey', email: 'mukesh@mankiparty.in',
  age: 38, phone: '9876543210', whatsapp: '9876543210',
  designatedPost: 'MANDAL_ADHYAKSHA',
  isPostVerified: true,
  profilePictureUrl: null,
  aboutMe: 'Dedicated karyakarta since 2012. Working for the development of Rampur Mandal. Believe in grassroots democracy.',
  address: { village: 'Rampur', panchayat: 'Rampur GP', block: 'Rampur Block', zila: 'Rampur', state: 'Uttar Pradesh', pincode: '244901' },
  location: { name: 'Mandal 4 — Rampur', level: 'BLOCK' },
  joinedAt: '2018-03-15',
};

const POST_DISPLAY: Record<string,{ label: string; color: string }> = {
  MANDAL_ADHYAKSHA: { label: 'Mandal Adhyaksha',  color: '#22C55E' },
  PRESIDENT:        { label: 'Adhyaksha',          color: '#FFD700' },
  SECRETARY:        { label: 'Mantri',             color: '#FF6B00' },
  KARYAKARTA:       { label: 'Karyakarta',         color: '#9CA3AF' },
};

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aboutMe, setAboutMe] = useState(MOCK_USER.aboutMe);
  const [phone, setPhone]     = useState(MOCK_USER.phone);
  const [address, setAddress] = useState(MOCK_USER.address);

  const post = POST_DISPLAY[MOCK_USER.designatedPost] ?? { label: MOCK_USER.designatedPost, color: '#6B7280' };

  const handleSave = async () => {
    setLoading(true);
    try {
      // API call to PATCH /api/users/me
      await new Promise(r => setTimeout(r, 800));
      toast.success('Profile updated!');
      setEditing(false);
    } catch {
      toast.error('Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-vanda" style={{ paddingLeft: 256 }}>
      <div className="grain-overlay" />

      {/* Topbar */}
      <div className="sticky top-0 z-30 glass border-b border-[rgba(255,107,0,0.1)] px-8 h-16
        flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-lg">
            <span className="seo-strip text-white">My Profile</span>
          </h1>
          <div className="text-[11px] text-text-muted tracking-wider">
            Home → <span className="text-saffron">Profile</span>
          </div>
        </div>
        <div className="flex gap-3">
          {editing ? (
            <>
              <button className="btn-ghost text-sm py-2 px-4" onClick={() => setEditing(false)}>Cancel</button>
              <button className="btn-manki text-sm py-2 px-4" onClick={handleSave} disabled={loading}>
                {loading ? '⏳ Saving…' : '✅ Save Changes'}
              </button>
            </>
          ) : (
            <button className="btn-manki text-sm py-2 px-4" onClick={() => setEditing(true)}>
              ✏️ Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="p-8 max-w-4xl">
        {/* Profile hero card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl overflow-hidden mb-6">
          {/* Cover */}
          <div className="h-32 relative" style={{
            background: 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,107,0,0.1))',
          }}>
            <div className="absolute inset-0" style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,107,0,0.03) 10px, rgba(255,107,0,0.03) 20px)',
            }} />
          </div>

          <div className="px-8 pb-8">
            {/* Avatar */}
            <div className="flex items-end gap-5 -mt-10 mb-5">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl flex items-center justify-center
                  font-extrabold text-4xl text-vanda shadow-gold"
                  style={{ background: 'linear-gradient(135deg, #FFD700, #FF6B00)' }}>
                  {MOCK_USER.fullName.charAt(0)}
                </div>
                {MOCK_USER.isPostVerified && (
                  <div className="verified-badge absolute -bottom-1 -right-1">✓</div>
                )}
              </div>

              <div className="mb-2 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="font-display font-extrabold text-2xl text-white">
                    <span className="seo-strip">{MOCK_USER.fullName}</span>
                  </h1>
                  {MOCK_USER.isPostVerified && (
                    <span className="hierarchy-badge text-vanda text-[9px]"
                      style={{ background: post.color }}>
                      ✓ VERIFIED
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className="font-semibold text-sm" style={{ color: post.color }}>
                    {post.label}
                  </span>
                  <span className="text-text-muted text-sm">•</span>
                  <span className="text-text-dim text-sm">{MOCK_USER.location.name}</span>
                  <span className="text-text-muted text-sm">•</span>
                  <span className="text-text-muted text-xs">
                    Member since {new Date(MOCK_USER.joinedAt).getFullYear()}
                  </span>
                </div>
              </div>

              {/* QR Code placeholder */}
              <div className="hidden md:flex flex-col items-center gap-1 mb-2">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
                  style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.2)' }}>
                  📱
                </div>
                <span className="text-[10px] text-text-muted">Share Profile</span>
              </div>
            </div>

            {/* About Me */}
            <div className="mb-6">
              <div className="text-xs text-text-muted tracking-widest uppercase mb-2">About Me</div>
              {editing ? (
                <textarea
                  className="input-manki resize-none"
                  rows={3}
                  maxLength={500}
                  value={aboutMe}
                  onChange={e => setAboutMe(e.target.value)}
                  placeholder="Tell your fellow karyakartas about yourself…"
                />
              ) : (
                <p className="text-text-dim text-sm leading-relaxed">{aboutMe}</p>
              )}
            </div>

            {/* Stats row */}
            <div className="flex gap-6 py-4 border-t border-b border-[rgba(255,107,0,0.1)] mb-6">
              {[
                { label: 'Committees', value: '3' },
                { label: 'Messages', value: '1,240' },
                { label: 'Tasks Done', value: '47' },
                { label: 'Vol. Hours', value: '128' },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <div className="font-display font-bold text-xl text-gold">{s.value}</div>
                  <div className="text-[11px] text-text-muted">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Details grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-6">
            <h2 className="font-display font-bold text-base mb-4">
              <span className="seo-strip-thin text-white">Contact Information</span>
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-text-muted tracking-widest uppercase mb-1 block">
                  Email <span className="text-saffron">(non-editable)</span>
                </label>
                <div className="input-manki opacity-60 cursor-not-allowed">{MOCK_USER.email}</div>
              </div>
              <div>
                <label className="text-xs text-text-muted tracking-widest uppercase mb-1 block">Phone</label>
                {editing
                  ? <input className="input-manki" value={phone} onChange={e => setPhone(e.target.value)} />
                  : <div className="input-manki opacity-70">{phone}</div>}
              </div>
              <div>
                <label className="text-xs text-text-muted tracking-widest uppercase mb-1 block">Age</label>
                <div className="input-manki opacity-60 cursor-not-allowed">{MOCK_USER.age} years</div>
              </div>
              <div>
                <label className="text-xs text-text-muted tracking-widest uppercase mb-1 block">
                  Designated Post <span className="text-saffron">(set by admin)</span>
                </label>
                <div className="input-manki opacity-60 flex items-center gap-2 cursor-not-allowed">
                  <span className="w-2 h-2 rounded-full" style={{ background: post.color }} />
                  {post.label}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Address */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="glass rounded-2xl p-6">
            <h2 className="font-display font-bold text-base mb-4">
              <span className="seo-strip-thin text-white">Address</span>
            </h2>
            <div className="space-y-3">
              {Object.entries(address).map(([key, val]) => (
                <div key={key}>
                  <label className="text-xs text-text-muted tracking-widest uppercase mb-1 block capitalize">
                    {key}
                  </label>
                  {editing
                    ? <input className="input-manki" value={val}
                        onChange={e => setAddress(a => ({ ...a, [key]: e.target.value }))} />
                    : <div className="text-sm text-text-dim">{val}</div>}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Security section */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6 mt-6">
          <h2 className="font-display font-bold text-base mb-4">
            <span className="seo-strip-thin text-white">Security</span>
          </h2>
          <div className="flex flex-wrap gap-3">
            <button className="btn-ghost text-sm py-2 px-4">🔐 Change Password</button>
            <button className="btn-ghost text-sm py-2 px-4 text-warning border-warning/30 hover:bg-warning/10">
              ⚠️ Revoke All Sessions
            </button>
            <button className="btn-ghost text-sm py-2 px-4">📦 Export My Data</button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
