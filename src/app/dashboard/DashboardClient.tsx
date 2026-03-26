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

function Sidebar({ user, location, isOpen, onClose }: { user: any, location: any, isOpen: boolean, onClose: () => void }) {
  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`w-64 min-h-screen flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
        style={{
          background: 'linear-gradient(180deg, #0A0A12 0%, #111120 100%)',
          borderRight: '1px solid rgba(255,107,0,0.12)',
        }}>
        <div className="h-[3px]" style={{ background: 'linear-gradient(90deg, #FFD700, #FF6B00, #22C55E)' }} />

        <div className="px-5 py-5 border-b border-[rgba(255,107,0,0.1)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ background: 'linear-gradient(135deg,#FFD700,#FF6B00)' }}>
                🇮🇳
              </div>
              <div className="flex-1">
                <div className="font-display font-extrabold text-base leading-none">
                  <span className="text-gold">MANKI</span>
                  <span className="text-saffron"> PARTY</span>
                </div>
                <div className="text-[10px] text-text-muted tracking-widest mt-0.5 uppercase">Sangathan</div>
              </div>
            </div>
            <button onClick={onClose} className="md:hidden text-text-muted hover:text-white">✕</button>
          </div>

          <div className="mt-4 px-3 py-2 rounded-lg"
            style={{ background: 'rgba(255,107,0,0.08)', border: '1px solid rgba(255,107,0,0.15)' }}>
            <div className="text-[9px] text-text-muted tracking-widest uppercase mb-1">Your Jurisdiction</div>
            <div className="text-xs text-saffron font-semibold truncate">{location?.name || 'Unknown'}</div>
            <div className="text-[10px] text-text-muted">{location?.level?.replace('_', ' ')}</div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(item => (
            <Link key={item.href} href={item.href}>
              <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200 cursor-pointer 
                ${item.href === '/dashboard' 
                  ? 'bg-gradient-to-r from-saffron to-[#E55A00] text-vanda shadow-manki-sm' 
                  : 'text-text-dim hover:text-text hover:bg-[rgba(255,107,0,0.06)]'}`}>
                <span className="text-lg w-5 text-center">{item.icon}</span>
                <span className="flex-1 font-display">{item.label}</span>
                {item.badge && <span className="bg-saffron text-white text-[10px] px-2 rounded-full font-bold">{item.badge}</span>}
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
    </>
  );
}

export default function DashboardClient({ user, location, posts, membersCount }: { user: any, location: any, posts: any[], membersCount: number }) {
  const [activeTab, setActiveTab] = useState<'feed' | 'advisory' | 'rooms' | 'privacy'>('advisory');
  const [newPost, setNewPost] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      <Sidebar user={user} location={location} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="md:ml-64 min-h-screen pb-12 transition-all duration-300">
        <div className="sticky top-0 z-30 glass border-b border-[rgba(255,107,0,0.1)] px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-white p-2 hover:bg-white/5 rounded-lg">
              ☰
            </button>
            <div>
              <h1 className="font-display font-bold text-base md:text-lg">
                <span className="seo-strip text-white">Dynamic Regional Dashboard</span>
              </h1>
              <div className="hidden sm:block text-[10px] text-text-muted tracking-wider">
                {location.name} → {location.level.replace('_', ' ')} → <span className="text-saffron">Operations</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-saffron/5 border border-saffron/20">
              <div className="w-1.5 h-1.5 rounded-full bg-saffron animate-pulse" />
              <span className="text-[10px] text-gold font-semibold uppercase tracking-wider hidden sm:inline">Live System</span>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="card-3d glass rounded-2xl p-5 border border-[rgba(255,107,0,0.1)]">
                <div className="text-2xl mb-3">{s.icon}</div>
                <div className="font-display font-extrabold text-xl md:text-2xl truncate" style={{ color: s.color }}>{s.value}</div>
                <div className="text-text-muted text-[10px] tracking-wider uppercase mt-1">{s.label}</div>
                <div className="mt-3 h-0.5 rounded-full" style={{ background: `linear-gradient(90deg, ${s.color}, transparent)` }} />
              </motion.div>
            ))}
          </div>

          {/* Network Health Visualization */}
          <div className="mb-8 glass rounded-2xl p-5 border border-white/5 bg-gradient-to-r from-saffron/5 to-transparent overflow-hidden relative">
             <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 relative z-10">
                <div>
                   <div className="text-[10px] text-saffron font-bold tracking-[0.2em] uppercase mb-1">Network Capacity</div>
                   <h3 className="text-sm md:text-base font-bold text-white">Digital Sangathan Throughput</h3>
                </div>
                <div className="flex items-center gap-6">
                   <div className="text-right">
                      <div className="text-[10px] text-text-muted uppercase tracking-wider">Concurrency</div>
                      <div className="text-sm font-display font-bold text-white">42.1k <span className="text-[10px] text-success">▲ 12%</span></div>
                   </div>
                   <div className="text-right">
                      <div className="text-[10px] text-text-muted uppercase tracking-wider">Sync Latency</div>
                      <div className="text-sm font-display font-bold text-white">18ms <span className="text-[10px] text-gold">Optimal</span></div>
                   </div>
                </div>
             </div>
             {/* Simple CSS-based bar visualization */}
             <div className="mt-5 flex items-end gap-1 h-8 opacity-40">
                {[...Array(40)].map((_, i) => (
                   <motion.div 
                     key={i} 
                     initial={{ height: '20%' }}
                     animate={{ height: [`${20 + Math.random() * 60}%`, `${30 + Math.random() * 70}%`, `${20 + Math.random() * 50}%`] }}
                     transition={{ repeat: Infinity, duration: 2 + Math.random() * 2, delay: i * 0.05 }}
                     className="flex-1 bg-saffron rounded-t-sm"
                   />
                ))}
             </div>
          </div>

          <div className="flex flex-wrap gap-2 p-1 mb-6 rounded-xl w-fit" style={{ background: 'rgba(26,26,40,0.8)', border: '1px solid rgba(255,107,0,0.12)' }}>
            {(['advisory', 'feed', 'rooms', 'privacy'] as const).map(t => (
              <button key={t} onClick={() => setActiveTab(t)}
                className={`px-4 py-2 rounded-lg text-xs md:text-sm font-display font-semibold capitalize transition-all duration-200 ${activeTab === t ? 'bg-gradient-to-r from-saffron to-[#E55A00] text-vanda' : 'text-text-dim hover:text-white'}`}>
                {t === 'advisory' && '📢 Noticeboard'}
                {t === 'feed' && '📰 Feed'}
                {t === 'rooms' && '💬 Rooms'}
                {t === 'privacy' && '🛡️ Settings'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'advisory' && (
              <motion.div key="advisory" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4 max-w-3xl">
                <div className="glass rounded-xl p-5 border border-saffron/20 shadow-[0_0_20px_rgba(255,107,0,0.1)] bg-saffron/5">
                  <h3 className="text-gold font-bold text-sm mb-3 flex items-center gap-2">⚠️ Admin Advisory (High Priority)</h3>
                  <div className="space-y-4">
                    {posts.filter(p => p.type === 'ADVISORY').map(post => (
                      <div key={post.id} className="last:mb-0 pb-4 last:pb-0 border-b border-saffron/10 last:border-0 text-sm">
                        <p className="text-white mb-2 leading-relaxed">{post.content}</p>
                        <div className="flex gap-2 text-[10px] text-text-muted">
                          <span>By {post.author.fullName} • {post.author.designatedPost.replace('_', ' ')}</span>
                        </div>
                      </div>
                    ))}
                    {posts.filter(p => p.type === 'ADVISORY').length === 0 && <p className="text-xs text-text-dim">No active advisories for your region at the moment.</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'feed' && (
              <motion.div key="feed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4 max-w-3xl">
                <div className="glass rounded-xl p-4 border border-[rgba(255,107,0,0.2)] mb-6 flex flex-col gap-3">
                  <textarea value={newPost} onChange={e => setNewPost(e.target.value)} placeholder={`Post a local update to ${location.name}...`}
                    className="w-full bg-vanda border border-saffron/20 rounded-lg p-3 text-sm focus:outline-none focus:border-saffron resize-none shadow-inner" rows={3} />
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-text-muted">Visible to all members in {location.name}</span>
                    <button onClick={submitPost} className="btn-manki px-6 py-2 text-xs md:text-sm">Post to Feed</button>
                  </div>
                </div>

                <div className="space-y-4">
                  {posts.filter(p => p.type === 'GENERAL').map(post => (
                    <div key={post.id} className="card-3d glass rounded-2xl p-5 border border-[rgba(255,107,0,0.1)]">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-saffron to-vanda border border-saffron/30 flex items-center justify-center font-bold text-sm text-white">{post.author.fullName[0]}</div>
                        <div>
                          <div className="font-bold text-white text-sm">{post.author.fullName}</div>
                          <div className="text-[9px] text-saffron uppercase font-semibold tracking-wider">{post.author.designatedPost.replace('_', ' ')}</div>
                        </div>
                      </div>
                      <p className="text-sm text-text-dim mb-3 break-words leading-relaxed">{post.content}</p>
                      <div className="flex items-center gap-4 text-[10px] text-text-muted border-t border-white/5 pt-3">
                        <button className="hover:text-gold transition-colors flex gap-1 items-center">❤️ Like</button>
                        <button className="hover:text-gold transition-colors flex gap-1 items-center">💬 Reply</button>
                      </div>
                    </div>
                  ))}
                </div>
                {posts.filter(p => p.type === 'GENERAL').length === 0 && <div className="text-center p-12 text-text-muted text-sm italic">No recent posts in your territory. Be the first to share!</div>}
              </motion.div>
            )}

            {activeTab === 'rooms' && (
              <motion.div key="rooms" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-4xl">
                 <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6">
                    <h3 className="text-lg font-bold font-display text-white">Regional Chat Rooms</h3>
                    <button className="btn-manki px-4 py-2 text-xs md:text-sm shadow-manki-sm transition-transform active:scale-95">+ Create Room</button>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="card-3d glass rounded-xl p-5 border border-white/10 cursor-pointer hover:border-saffron/50 transition-colors">
                        <div className="flex justify-between mb-2"><h4 className="font-bold text-sm sm:text-base">General Assembly</h4><span className="text-[9px] bg-saffron/20 text-saffron px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">Official</span></div>
                        <div className="text-xs sm:text-sm text-text-dim mb-4 leading-relaxed">Official room for all designated leaders in {location.name}.</div>
                        <div className="text-[10px] text-text-muted flex items-center gap-2">
                           <span className="flex items-center gap-1">👥 {membersCount} Members</span>
                           <span>•</span>
                           <span>Last active 10m ago</span>
                        </div>
                    </div>
                    <div className="card-3d glass rounded-xl p-5 border border-white/10 cursor-pointer hover:border-saffron/50 transition-colors">
                        <div className="flex justify-between mb-2"><h4 className="font-bold text-sm sm:text-base">Campaign & Inventory</h4><span className="text-[9px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">Project</span></div>
                        <div className="text-xs sm:text-sm text-text-dim mb-4 leading-relaxed">Tracking local materials and tasks for the upcoming drive.</div>
                        <div className="text-[10px] text-text-muted flex items-center gap-2">
                           <span className="flex items-center gap-1">👥 14 Active</span>
                           <span>•</span>
                           <span>Last active 1h ago</span>
                        </div>
                    </div>
                 </div>
              </motion.div>
            )}

            {activeTab === 'privacy' && (
              <motion.div key="privacy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-xl">
                 <div className="card-3d glass p-6 rounded-2xl border border-white/10">
                    <h3 className="text-lg font-display font-bold mb-4 text-white">Digital Profile & Privacy</h3>
                    <p className="text-xs sm:text-sm text-text-dim mb-6">Control how your details appear to other members of the {location.name} territory.</p>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between py-4 border-b border-white/5">
                          <div>
                              <div className="text-sm font-semibold text-white">Share Address Publicly</div>
                              <div className="text-[10px] text-text-muted">Allows other locals to see your physical location</div>
                          </div>
                          <button onClick={() => updatePrivacy('showAddress', !user.showAddress)} 
                            className={`w-10 h-5 rounded-full transition-colors relative ${user.showAddress ? 'bg-saffron' : 'bg-gray-700'}`}>
                            <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.75 transition-transform ${user.showAddress ? 'left-5.75' : 'left-0.75'}`} />
                          </button>
                      </div>

                      <div className="flex items-center justify-between py-4">
                          <div>
                              <div className="text-sm font-semibold text-white">Share Contacts Publicly</div>
                              <div className="text-[10px] text-text-muted">Show phone & email to other verified members</div>
                          </div>
                          <button onClick={() => updatePrivacy('showContacts', !user.showContacts)} 
                            className={`w-10 h-5 rounded-full transition-colors relative ${user.showContacts ? 'bg-saffron' : 'bg-gray-700'}`}>
                            <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.75 transition-transform ${user.showContacts ? 'left-5.75' : 'left-0.75'}`} />
                          </button>
                      </div>
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
