'use client';
// ============================================================
// src/app/search/page.tsx — Location-scoped Member Search
// ============================================================

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface SearchResult {
  id: string; fullName: string; designatedPost: string;
  location: string; isOnline: boolean; isPostVerified: boolean;
  profilePictureUrl: string | null; aboutMe: string | null;
  avatarColor: string;
}

const MOCK_RESULTS: SearchResult[] = [
  { id: '1', fullName: 'Ramesh Yadav',   designatedPost: 'BOOTH_INCHARGE',    location: 'Ward 7, Rampur',    isOnline: true,  isPostVerified: true,  profilePictureUrl: null, aboutMe: 'Grassroots worker since 2010', avatarColor: '#FF6B00' },
  { id: '2', fullName: 'Sunita Devi',    designatedPost: 'MAHILA_PRAMUKH',    location: 'Ward 7, Rampur',    isOnline: false, isPostVerified: true,  profilePictureUrl: null, aboutMe: 'Women wing leader', avatarColor: '#FFD700' },
  { id: '3', fullName: 'Vijay Kumar',    designatedPost: 'KARYAKARTA',        location: 'Ward 8, Rampur',    isOnline: true,  isPostVerified: false, profilePictureUrl: null, aboutMe: 'Youth activist', avatarColor: '#22C55E' },
  { id: '4', fullName: 'Kavita Sharma',  designatedPost: 'SANGATHAN_MANTRI',  location: 'Mandal 4, Rampur',  isOnline: false, isPostVerified: true,  profilePictureUrl: null, aboutMe: 'Party organiser — 12 years', avatarColor: '#8B5CF6' },
  { id: '5', fullName: 'Arjun Mishra',   designatedPost: 'PANNA_PRAMUKH',     location: 'Village Ramnagar',  isOnline: true,  isPostVerified: false, profilePictureUrl: null, aboutMe: null, avatarColor: '#EC4899' },
];

const POST_DISPLAY: Record<string,string> = {
  BOOTH_INCHARGE: 'Booth In-charge', MAHILA_PRAMUKH: 'Mahila Pramukh',
  KARYAKARTA: 'Karyakarta', SANGATHAN_MANTRI: 'Sangathan Mantri', PANNA_PRAMUKH: 'Panna Pramukh',
};

const FILTERS = ['All', 'Postholders', 'Karyakartas', 'Online', 'Verified'];

export default function SearchPage() {
  const [query, setQuery]       = useState('');
  const [results, setResults]   = useState<SearchResult[]>(MOCK_RESULTS);
  const [filter, setFilter]     = useState('All');
  const [loading, setLoading]   = useState(false);

  const search = useCallback(async (q: string, f: string) => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 300));
      let filtered = MOCK_RESULTS;
      if (q) filtered = filtered.filter(r =>
        r.fullName.toLowerCase().includes(q.toLowerCase()) ||
        r.location.toLowerCase().includes(q.toLowerCase())
      );
      if (f === 'Online')      filtered = filtered.filter(r => r.isOnline);
      if (f === 'Verified')    filtered = filtered.filter(r => r.isPostVerified);
      if (f === 'Karyakartas') filtered = filtered.filter(r => r.designatedPost === 'KARYAKARTA');
      if (f === 'Postholders') filtered = filtered.filter(r => r.designatedPost !== 'KARYAKARTA');
      setResults(filtered);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { search(query, filter); }, [query, filter, search]);

  const startChat = (userId: string, name: string) => {
    toast.success(`Opening chat with ${name}…`);
  };

  return (
    <div className="min-h-screen bg-vanda" style={{ paddingLeft: 256 }}>
      <div className="grain-overlay" />

      {/* Topbar */}
      <div className="sticky top-0 z-30 glass border-b border-[rgba(255,107,0,0.1)] px-8 h-16
        flex items-center gap-4">
        <div>
          <h1 className="font-display font-bold text-lg">
            <span className="seo-strip text-white">Find Members</span>
          </h1>
          <div className="text-[11px] text-text-muted">
            Home → <span className="text-saffron">Search</span> · Showing members in your jurisdiction
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Search bar */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 mb-6">
          <div className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-lg">🔍</span>
              <input
                className="input-manki pl-12"
                placeholder="Search by name, post, or location…"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map(f => (
              <button key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all
                  ${filter === f
                  ? 'bg-saffron text-vanda shadow-manki-sm'
                  : 'text-text-muted border border-[rgba(255,107,0,0.15)] hover:border-saffron hover:text-saffron'}`}>
                {f}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results */}
        <div className="mb-3 text-xs text-text-muted tracking-wider uppercase">
          {loading ? 'Searching…' : `${results.length} members found`}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card-3d glass rounded-2xl p-5"
            >
              {/* Header */}
              <div className="flex items-start gap-3 mb-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg text-vanda"
                    style={{ background: `linear-gradient(135deg, ${r.avatarColor}, ${r.avatarColor}80)` }}>
                    {r.fullName.charAt(0)}
                  </div>
                  {r.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-vanda-mid"
                      style={{ background: '#22C55E', boxShadow: '0 0 6px #22C55E' }} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-display font-bold text-sm text-white truncate">
                      {r.fullName}
                    </span>
                    {r.isPostVerified && <span className="verified-badge text-[9px]">✓</span>}
                  </div>
                  <div className="text-[11px] font-semibold mt-0.5" style={{ color: r.avatarColor }}>
                    {POST_DISPLAY[r.designatedPost] ?? r.designatedPost}
                  </div>
                  <div className="text-[11px] text-text-muted mt-0.5">📍 {r.location}</div>
                </div>
              </div>

              {/* About */}
              {r.aboutMe && (
                <p className="text-xs text-text-dim leading-relaxed mb-4 line-clamp-2">{r.aboutMe}</p>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  className="btn-manki text-xs py-2 flex-1"
                  onClick={() => startChat(r.id, r.fullName)}>
                  💬 Message
                </button>
                <Link href={`/profile/${r.id}`}
                  className="btn-ghost text-xs py-2 px-4 text-center">
                  👤 View
                </Link>
              </div>
            </motion.div>
          ))}

          {!loading && results.length === 0 && (
            <div className="col-span-full text-center py-16 text-text-muted">
              <div className="text-5xl mb-4">🔍</div>
              <div className="font-display font-bold text-lg text-white mb-2">No members found</div>
              <div className="text-sm">Try a different name or remove filters</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
