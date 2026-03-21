'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const NAV = [
  { href: '/dashboard',      icon: '◈',  label: 'Dashboard',      badge: null },
  { href: '/chat',           icon: '💬', label: 'Chats',          badge: 5    },
  { href: '/notifications',  icon: '🔔', label: 'Notifications',  badge: 3    },
  { href: '/search',         icon: '🔍', label: 'Search Members', badge: null },
  { href: '/campaigns',      icon: '📋', label: 'Campaigns',      badge: null },
  { href: '/profile',        icon: '👤', label: 'My Profile',     badge: null },
];

function Sidebar({ user, location }: { user: any, location: any }) {
  return (
    <aside className="w-64 min-h-screen flex flex-col fixed left-0 top-0 z-40"
      style={{
        background: 'linear-gradient(180deg, #0A0A12 0%, #111120 100%)',
        borderRight: '1px solid rgba(255,107,0,0.12)',
      }}>
      <div className="h-[3px]" style={{ background: 'linear-gradient(90deg, #FFD700, #FF6B00, #22C55E)' }} />

      <div className="px-5 py-5 border-b border-[rgba(255,107,0,0.1)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: 'linear-gradient(135deg,#FFD700,#FF6B00)' }}>
            🇮🇳
          </div>
          <div>
            <div className="font-display font-extrabold text-base leading-none">
              <span className="text-gold">MANKI</span>
              <span className="text-saffron"> PARTY</span>
            </div>
            <div className="text-[10px] text-text-muted tracking-widest mt-0.5">GRASSROOTS CONNECT</div>
          </div>
        </div>

        <div className="mt-3 px-3 py-2 rounded-lg"
          style={{ background: 'rgba(255,107,0,0.08)', border: '1px solid rgba(255,107,0,0.15)' }}>
          <div className="text-[9px] text-text-muted tracking-widest uppercase mb-1">Your Jurisdiction</div>
          <div className="text-xs text-saffron font-semibold">{location?.name || 'Unknown'}</div>
          <div className="text-[10px] text-text-muted">{location?.level?.replace('_', ' ')}</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(item => (
          <Link key={item.href} href={item.href}>
            <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
              transition-all duration-200 cursor-pointer text-text-dim hover:text-text
              ${item.href === '/dashboard' ? 'bg-gradient-to-r from-saffron to-[#E55A00] text-vanda shadow-manki-sm' : 'hover:bg-[rgba(255,107,0,0.06)]'}`}>
              <span className="text-lg w-5 text-center">{item.icon}</span>
              <span className="flex-1 font-display">{item.label}</span>
              {item.badge && <span className="bg-danger text-white text-[10px] px-2 rounded-full font-bold">{item.badge}</span>}
            </div>
          </Link>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-[rgba(255,107,0,0.1)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-vanda"
            style={{ background: 'linear-gradient(135deg,#FFD700,#FF6B00)' }}>
            {user.fullName.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate">{user.fullName}</div>
            <div className="text-[10px] text-saffron tracking-wider uppercase">{user.designatedPost.replace('_', ' ')}</div>
          </div>
          <Link href="/api/auth/logout" className="text-text-muted hover:text-danger text-lg">⏻</Link>
        </div>
      </div>
    </aside>
  );
}

export default function DashboardClient({ user, location, posts, membersCount }: { user: any, location: any, posts: any[], membersCount: number }) {
  const [activeTab, setActiveTab] = useState<'feed' | 'advisory' | 'rooms' | 'privacy'>('advisory');
  const [newPost, setNewPost] = useState('');

  const submitPost = async () => {
    if (!newPost.trim()) return;
    await fetch('/api/dashboard/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newPost, locationId: location.id, type: 'GENERAL' })
    });
    setNewPost('');
    window.location.reload();
  };

  const updatePrivacy = async (field: string, value: boolean) => {
    await fetch('/api/dashboard/privacy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value })
    });
    window.location.reload();
  };

  const stats = [
    { label: 'Network Feeds', value: posts.length, icon: '📰', color: '#FF6B00' },
    { label: 'Region Members', value: membersCount, icon: '👥', color: '#22C55E' },
    { label: 'Role Authority', value: user.designatedPost.replace('_', ' '), icon: '🏛️', color: '#FFD700' },
    { label: 'Profile Privacy', value: user.showContacts ? 'Public' : 'Hidden', icon: '🔒', color: '#3B82F6' },
  ];

  return (
    <div className="min-h-screen bg-vanda text-text">
      <div className="grain-overlay opacity-30 fixed inset-0 pointer-events-none" />
      <Sidebar user={user} location={location} />

      <main className="ml-64 min-h-screen pb-12">
        <div className="sticky top-0 z-30 glass border-b border-[rgba(255,107,0,0.1)] px-8 h-16 flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-lg">
              <span className="seo-strip text-white">Dynamic Regional Dashboard</span>
            </h1>
            <div className="text-[11px] text-text-muted tracking-wider">
              {location.name} → {location.level.replace('_', ' ')} → <span className="text-saffron">Operations</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'rgba(255,215,0,0.06)', border: '1px solid rgba(255,215,0,0.15)' }}>
              <div className="w-2 h-2 rounded-full bg-saffron animate-pulse" />
              <span className="text-xs text-gold font-semibold">Live System</span>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="card-3d glass rounded-2xl p-5 border border-[rgba(255,107,0,0.1)]">
                <div className="text-3xl mb-3">{s.icon}</div>
                <div className="font-display font-extrabold text-2xl truncate" style={{ color: s.color }}>{s.value}</div>
                <div className="text-text-muted text-xs tracking-wider uppercase mt-1">{s.label}</div>
                <div className="mt-3 h-0.5 rounded-full" style={{ background: `linear-gradient(90deg, ${s.color}, transparent)` }} />
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 p-1 mb-6 rounded-xl w-fit" style={{ background: 'rgba(26,26,40,0.8)', border: '1px solid rgba(255,107,0,0.12)' }}>
            {(['advisory', 'feed', 'rooms', 'privacy'] as const).map(t => (
              <button key={t} onClick={() => setActiveTab(t)}
                className={`px-5 py-2 rounded-lg text-sm font-display font-semibold capitalize transition-all duration-200 ${activeTab === t ? 'bg-gradient-to-r from-saffron to-[#E55A00] text-vanda' : 'text-text-dim hover:text-white'}`}>
                {t === 'advisory' && '📢 Main Noticeboard'}
                {t === 'feed' && '📰 Regional Feed'}
                {t === 'rooms' && '💬 Inventory & Chat'}
                {t === 'privacy' && '🛡️ Profile Settings'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'advisory' && (
              <motion.div key="advisory" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4 max-w-3xl">
                <div className="glass rounded-xl p-4 border border-saffron/20 shadow-[0_0_20px_rgba(255,107,0,0.1)] bg-saffron/5">
                  <h3 className="text-gold font-bold mb-2 flex items-center gap-2">⚠️ Admin Advisory (High Priority)</h3>
                  {posts.filter(p => p.type === 'ADVISORY').map(post => (
                    <div key={post.id} className="mb-4 last:mb-0 pb-4 last:pb-0 border-b border-saffron/10 last:border-0">
                      <p className="text-sm text-white mb-2">{post.content}</p>
                      <div className="flex gap-2 text-xs text-text-muted">
                        <span>By {post.author.fullName} • {post.author.designatedPost.replace('_', ' ')}</span>
                      </div>
                    </div>
                  ))}
                  {posts.filter(p => p.type === 'ADVISORY').length === 0 && <p className="text-sm text-text-dim">No active advisories for your region at the moment.</p>}
                </div>
              </motion.div>
            )}

            {activeTab === 'feed' && (
              <motion.div key="feed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4 max-w-3xl">
                <div className="glass rounded-xl p-4 border border-[rgba(255,107,0,0.2)] mb-6 flex flex-col gap-3">
                  <textarea value={newPost} onChange={e => setNewPost(e.target.value)} placeholder={`Post a local update to ${location.name}...`}
                    className="w-full bg-vanda border border-saffron/20 rounded-lg p-3 text-sm focus:outline-none focus:border-saffron resize-none shadow-inner" rows={3} />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-text-muted">Visible to all members in {location.name}</span>
                    <button onClick={submitPost} className="btn-manki px-6 py-2 text-sm">Post to Feed</button>
                  </div>
                </div>

                {posts.filter(p => p.type === 'GENERAL').map(post => (
                  <div key={post.id} className="card-3d glass rounded-2xl p-5 border border-[rgba(255,107,0,0.1)]">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-saffron to-vanda border border-saffron/30 flex items-center justify-center font-bold text-sm text-white">{post.author.fullName[0]}</div>
                      <div>
                        <div className="font-bold text-white text-sm">{post.author.fullName}</div>
                        <div className="text-[10px] text-saffron uppercase font-semibold tracking-wider">{post.author.designatedPost.replace('_', ' ')}</div>
                      </div>
                    </div>
                    <p className="text-sm text-text-dim mb-3 break-words">{post.content}</p>
                    <div className="flex items-center gap-4 text-xs text-text-muted border-t border-white/5 pt-3">
                      <button className="hover:text-vanda-light transition-colors flex gap-1 items-center">❤️ Like</button>
                      <button className="hover:text-vanda-light transition-colors flex gap-1 items-center">💬 Reply</button>
                    </div>
                  </div>
                ))}
                {posts.filter(p => p.type === 'GENERAL').length === 0 && <div className="text-center p-8 text-text-dim">No recent posts in your territory. Be the first to share!</div>}
              </motion.div>
            )}

            {activeTab === 'rooms' && (
              <motion.div key="rooms" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-4xl">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold font-display text-white">Regional Chat Rooms</h3>
                    <button className="btn-manki px-4 py-2 text-sm">+ Create Inventory / Chat Room</button>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="card-3d glass rounded-xl p-5 border border-white/10 cursor-pointer hover:border-saffron/50 transition-colors">
                        <div className="flex justify-between mb-2"><h4 className="font-bold">General Assembly</h4><span className="text-xs bg-saffron/20 text-saffron px-2 py-1 rounded">Official</span></div>
                        <div className="text-sm text-text-dim mb-4">Official room for all designated leaders in {location.name}.</div>
                        <div className="text-xs text-text-muted">Users: {membersCount} • Last active 10m ago</div>
                    </div>
                    <div className="card-3d glass rounded-xl p-5 border border-white/10 cursor-pointer hover:border-saffron/50 transition-colors">
                        <div className="flex justify-between mb-2"><h4 className="font-bold">Campaign "Booth Vijaya"</h4><span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">Inventory</span></div>
                        <div className="text-sm text-text-dim mb-4">Tracking local materials and tasks for the upcoming drive.</div>
                        <div className="text-xs text-text-muted">Users: 14 • Last active 1h ago</div>
                    </div>
                 </div>
              </motion.div>
            )}

            {activeTab === 'privacy' && (
              <motion.div key="privacy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-xl">
                 <div className="card-3d glass p-6 rounded-2xl border border-white/10">
                    <h3 className="text-xl font-display font-bold mb-4 text-white">Digital Profile & Privacy</h3>
                    <p className="text-sm text-text-dim mb-6">Control how your details appear to other members of the {location.name} territory.</p>

                    <div className="flex items-center justify-between py-4 border-b border-white/10">
                        <div>
                            <div className="font-semibold text-white">Share Address Publicly</div>
                            <div className="text-xs text-text-muted">Allows other locals to see your physical address</div>
                        </div>
                        <button onClick={() => updatePrivacy('showAddress', !user.showAddress)} 
                          className={`w-12 h-6 rounded-full transition-colors relative ${user.showAddress ? 'bg-saffron' : 'bg-gray-600'}`}>
                          <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${user.showAddress ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between py-4">
                        <div>
                            <div className="font-semibold text-white">Share Contacts Publicly</div>
                            <div className="text-xs text-text-muted">Show phone & email to other verified members</div>
                        </div>
                        <button onClick={() => updatePrivacy('showContacts', !user.showContacts)} 
                          className={`w-12 h-6 rounded-full transition-colors relative ${user.showContacts ? 'bg-saffron' : 'bg-gray-600'}`}>
                          <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${user.showContacts ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>
                 </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
