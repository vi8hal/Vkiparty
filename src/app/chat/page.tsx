'use client';
// ============================================================
// src/app/chat/page.tsx — Full Twitter-like Chat Interface
// ============================================================

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io, Socket } from 'socket.io-client';
import toast from 'react-hot-toast';

interface Message {
  id: string; content: string | null; messageType: string;
  sentAt: string; isDeleted: boolean;
  sender: { id: string; fullName: string; profilePictureUrl: string | null; designatedPost: string; };
  reactions: Array<{ emoji: string; userId: string; user: { fullName: string } }>;
  replyTo?: { id: string; content: string | null; sender: { fullName: string } } | null;
}

interface Room {
  id: string; name: string | null; type: string;
  lastMessage: Message | null; isMuted: boolean; updatedAt: string;
}

const EMOJI_REACTIONS = ['👍','❤️','😂','🙌','🔥','💪'];
const POST_COLORS: Record<string,string> = {
  PRESIDENT: '#FFD700', VICE_PRESIDENT: '#FF8C38', SECRETARY: '#FF6B00',
  KARYAKARTA: '#9CA3AF', MANDAL_ADHYAKSHA: '#22C55E', DEFAULT: '#6B7280',
};

// ─── MESSAGE BUBBLE ──────────────────────────────────────────
function MessageBubble({
  msg, isMine, onReaction,
}: {
  msg: Message; isMine: boolean;
  onReaction: (msgId: string, emoji: string) => void;
}) {
  const [showReactions, setShowReactions] = useState(false);
  const postColor = POST_COLORS[msg.sender.designatedPost] ?? POST_COLORS.DEFAULT;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 group ${isMine ? 'flex-row-reverse' : ''} mb-4`}
    >
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center
        text-xs font-bold text-vanda mt-1"
        style={{ background: `linear-gradient(135deg, ${postColor}, ${postColor}80)` }}>
        {msg.sender.fullName.charAt(0)}
      </div>

      <div className={`max-w-[70%] ${isMine ? 'items-end' : 'items-start'} flex flex-col`}>
        {/* Name + post */}
        {!isMine && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-white">{msg.sender.fullName}</span>
            <span className="text-[9px] tracking-wider uppercase font-semibold"
              style={{ color: postColor }}>
              {msg.sender.designatedPost.replace(/_/g,' ')}
            </span>
          </div>
        )}

        {/* Reply preview */}
        {msg.replyTo && (
          <div className="px-3 py-2 rounded-lg mb-1 text-xs border-l-2 w-full"
            style={{
              background: 'rgba(255,107,0,0.08)',
              borderColor: '#FF6B00',
              color: '#9CA3AF',
            }}>
            <span className="text-saffron font-semibold">{msg.replyTo.sender.fullName}</span>
            <div className="truncate mt-0.5">{msg.replyTo.content}</div>
          </div>
        )}

        {/* Bubble */}
        <div
          className={`relative px-4 py-3 rounded-2xl text-sm leading-relaxed
            ${isMine ? 'msg-bubble-sent text-white' : 'msg-bubble-recv text-text'}
            ${msg.isDeleted ? 'opacity-50 italic' : ''}`}
          onDoubleClick={() => setShowReactions(!showReactions)}
        >
          {msg.isDeleted ? '🗑 Message deleted' : (msg.content ?? '')}

          {/* Reaction popover */}
          <AnimatePresence>
            {showReactions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`absolute ${isMine ? 'right-0' : 'left-0'} -top-10 flex gap-1 px-2 py-1.5 rounded-xl z-10`}
                style={{ background: '#1A1A28', border: '1px solid rgba(255,107,0,0.2)' }}
              >
                {EMOJI_REACTIONS.map(emoji => (
                  <button key={emoji}
                    className="text-lg hover:scale-125 transition-transform"
                    onClick={() => { onReaction(msg.id, emoji); setShowReactions(false); }}>
                    {emoji}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Reactions display */}
        {msg.reactions.length > 0 && (
          <div className="flex gap-1 mt-1 flex-wrap">
            {Object.entries(
              msg.reactions.reduce((acc, r) => {
                acc[r.emoji] = (acc[r.emoji] || 0) + 1; return acc;
              }, {} as Record<string,number>)
            ).map(([emoji, count]) => (
              <div key={emoji}
                className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs cursor-pointer
                  hover:scale-105 transition-transform"
                style={{ background: 'rgba(255,107,0,0.12)', border: '1px solid rgba(255,107,0,0.2)' }}
                onClick={() => onReaction(msg.id, emoji)}>
                {emoji} <span className="text-text-muted">{count}</span>
              </div>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <div className={`text-[10px] text-text-muted mt-1 ${isMine ? 'text-right' : ''}`}>
          {new Date(msg.sentAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </motion.div>
  );
}

// ─── MAIN CHAT PAGE ──────────────────────────────────────────
export default function ChatPage() {
  const [rooms, setRooms]           = useState<Room[]>([]);
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [messages, setMessages]     = useState<Message[]>([]);
  const [input, setInput]           = useState('');
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [socket, setSocket]         = useState<Socket | null>(null);
  const [loading, setLoading]       = useState(false);
  const [showRoomList, setShowRoomList] = useState(true); // Toggle for mobile
  const [currentUserId]             = useState('mock-user-id'); // To be replaced by actual session
  const messagesEndRef              = useRef<HTMLDivElement>(null);
  const typingTimer                 = useRef<any>(null);

  // Fetch rooms
  useEffect(() => {
    fetch('/api/chat/rooms')
      .then(r => r.json())
      .then(d => { if (d.success) setRooms(d.data); })
      .catch(() => {});
  }, []);

  // Window resize handler for mobile/desktop toggle
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setShowRoomList(true);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Socket connection
  useEffect(() => {
    const sock = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      auth: { sessionId: 'session-id', userId: currentUserId },
      transports: ['websocket'],
    });

    sock.on('message:new', (msg: Message) => {
      setMessages(prev => [...prev, msg]);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    });

    sock.on('typing:start', ({ userId, userName }: { userId: string; userName: string }) => {
      if (userId !== currentUserId) {
        setTypingUsers(prev => prev.includes(userName) ? prev : [...prev, userName]);
      }
    });

    sock.on('typing:stop', ({ userId, userName }: { userId: string; userName: string }) => {
      setTypingUsers(prev => prev.filter(u => u !== userName));
    });

    sock.on('reaction:update', ({ messageId, emoji, action }: { messageId: string; emoji: string; action: string; userId: string }) => {
      setMessages(prev => prev.map(m =>
        m.id === messageId
          ? { ...m, reactions: action === 'add'
              ? [...m.reactions, { emoji, userId: currentUserId, user: { fullName: 'You' } }]
              : m.reactions.filter(r => !(r.emoji === emoji && r.userId === currentUserId)) }
          : m
      ));
    });

    setSocket(sock);
    return () => { sock.disconnect(); };
  }, [currentUserId]);

  // Load messages when room changes
  const loadRoom = useCallback(async (room: Room) => {
    setActiveRoom(room);
    setMessages([]);
    setLoading(true);
    if (window.innerWidth < 768) setShowRoomList(false); // Auto-hide list on mobile when room selected
    
    try {
      const res  = await fetch(`/api/chat/rooms/${room.id}/messages`);
      const data = await res.json();
      if (data.success) setMessages(data.data.messages);
      socket?.emit('rooms:join', [room.id]);
      socket?.emit('room:read', { roomId: room.id });
    } catch {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
      setTimeout(() => messagesEndRef.current?.scrollIntoView(), 100);
    }
  }, [socket]);

  // Send message
  const send = useCallback(() => {
    if (!input.trim() || !activeRoom || !socket) return;
    socket.emit('message:send', {
      roomId: activeRoom.id, content: input.trim(), messageType: 'TEXT',
    }, (ack: { success?: boolean; message?: Message; error?: string }) => {
      if (ack?.success && ack.message) {
        setMessages(prev => [...prev, ack.message!]);
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
      }
    });
    setInput('');
  }, [input, activeRoom, socket]);

  // Typing indicator
  const handleInputChange = (val: string) => {
    setInput(val);
    if (!activeRoom || !socket) return;
    socket.emit('typing:start', { roomId: activeRoom.id });
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      socket.emit('typing:stop', { roomId: activeRoom.id });
    }, 1500);
  };

  const handleReaction = (msgId: string, emoji: string) => {
    socket?.emit('reaction:add', { messageId: msgId, emoji });
  };

  return (
    <div className="min-h-screen bg-vanda flex overflow-hidden">
      <div className="grain-overlay pointer-events-none opacity-20" />

      {/* Room list (Sidebar) */}
      <motion.div 
        initial={false}
        animate={{ width: showRoomList ? 320 : 0, opacity: showRoomList ? 1 : 0 }}
        className={`fixed md:relative inset-y-0 left-0 z-30 flex flex-col border-r border-white/5 bg-[#0D0D1A] overflow-hidden`}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-lg text-white">Chats</h2>
            <button className="btn-manki text-[10px] py-1.5 px-3 uppercase tracking-wider font-bold">+ New</button>
          </div>
          <div className="relative">
            <input className="input-manki text-sm py-2 pl-9" placeholder="Search rooms..." />
            <span className="absolute left-3 top-2.5 text-text-muted">🔍</span>
          </div>
        </div>

        {/* Room list */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {rooms.length === 0 && !loading && (
            <div className="p-12 text-center text-text-muted text-sm italic">No conversations</div>
          )}
          {rooms.map(room => (
            <button key={room.id}
              className={`w-full px-4 py-3 flex items-start gap-3 hover:bg-white/5 transition-all text-left border-b border-white/[0.02]
                ${activeRoom?.id === room.id ? 'bg-saffron/10 border-l-2 border-l-saffron' : ''}`}
              onClick={() => loadRoom(room)}>
              <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm text-vanda"
                style={{ background: 'linear-gradient(135deg,#FFD700,#FF6B00)' }}>
                {room.name?.charAt(0) ?? '?'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-white truncate">{room.name ?? 'Chat'}</span>
                  <span className="text-[10px] text-text-muted shrink-0">
                    {room.lastMessage ? new Date(room.lastMessage.sentAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
                <div className="text-xs text-text-dim truncate mt-0.5">{room.lastMessage?.content ?? 'No messages yet'}</div>
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col relative transition-all duration-300 ${!showRoomList ? 'w-full' : ''}`}>
        
        {/* Toggle button for mobile at the corner */}
        {!showRoomList && (
          <button 
            onClick={() => setShowRoomList(true)}
            className="md:hidden absolute left-4 top-5 z-40 bg-saffron/20 p-2 rounded-lg text-saffron border border-saffron/30"
          >
            ☰
          </button>
        )}

        {activeRoom ? (
          <>
            {/* Room header */}
            <div className={`px-6 md:px-8 py-4 border-b border-white/5 flex items-center gap-4 glass sticky top-0 z-20 ${!showRoomList ? 'pl-16 md:pl-8' : ''}`}>
              <div className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center font-bold text-sm text-vanda"
                style={{ background: 'linear-gradient(135deg,#FFD700,#FF6B00)' }}>
                {activeRoom.name?.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="font-display font-bold text-sm md:text-base text-white truncate">{activeRoom.name}</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse shadow-[0_0_8px_#22C55E]" />
                  <span className="text-[10px] text-success font-semibold tracking-wider uppercase">Online</span>
                </div>
              </div>
              <div className="ml-auto hidden sm:flex items-center gap-2">
                <button className="btn-ghost text-[10px] py-1.5 px-3 uppercase tracking-widest font-bold">Files</button>
              </div>
            </div>

            {/* Messages container */}
            <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-2 bg-[#0A0A0F]/50 shadow-inner">
              {loading && (
                <div className="flex justify-center py-12">
                   <div className="inline-flex gap-2 p-3 rounded-2xl glass text-xs text-gold border-gold/20">
                      <div className="w-4 h-4 rounded-full border-2 border-gold border-t-transparent animate-spin" />
                      Loading encrypted history...
                   </div>
                </div>
              )}

              {messages.map(msg => (
                <MessageBubble
                  key={msg.id}
                  msg={msg}
                  isMine={msg.sender.id === currentUserId}
                  onReaction={handleReaction}
                />
              ))}

              {/* Typing area */}
              {typingUsers.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-end gap-3 mb-4">
                  <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/5 flex gap-1 items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-saffron/40 animate-bounce" />
                    <div className="w-1.5 h-1.5 rounded-full bg-saffron/60 animate-bounce delay-100" />
                    <div className="w-1.5 h-1.5 rounded-full bg-saffron/80 animate-bounce delay-200" />
                  </div>
                  <span className="text-[10px] text-text-muted italic">{typingUsers[0]} is typing...</span>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <div className="px-4 md:px-6 py-4 border-t border-white/5 bg-[#0D0D1A]">
              <div className="flex items-end gap-2 md:gap-3 max-w-5xl mx-auto">
                <div className="flex-1 relative group">
                  <textarea
                    className="input-manki resize-none pr-10 min-h-[48px] max-h-32 py-3.5 text-sm leading-relaxed"
                    rows={1}
                    placeholder="Message committee..."
                    value={input}
                    onChange={e => handleInputChange(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
                    }}
                  />
                  <button className="absolute right-3 top-3.5 text-lg opacity-50 hover:opacity-100 transition-opacity">😊</button>
                </div>
                <button className="btn-ghost shrink-0 w-12 h-12 flex items-center justify-center p-0 rounded-xl text-lg hover:border-gold/40">📎</button>
                <button
                  className="btn-manki shrink-0 w-12 h-12 flex items-center justify-center p-0 rounded-xl shadow-manki transition-transform active:rotate-12"
                  onClick={send} disabled={!input.trim()}>
                  ➤
                </button>
              </div>
              <div className="text-[9px] text-center text-text-muted mt-2 tracking-widest uppercase opacity-50">Jai Hind — End-to-End Encrypted</div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-[#0A0A0F]">
            <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="text-6xl mb-6">🇮🇳</motion.div>
            <h2 className="font-display font-bold text-2xl text-white mb-2">Bharat Sangathan</h2>
            <p className="text-text-muted text-sm max-w-xs leading-relaxed">Select a regional committee or member to start coordinating for the grassroots movement.</p>
          </div>
        )}
      </div>
    </div>
  );
}
