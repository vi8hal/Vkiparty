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
  const [currentUserId]             = useState('mock-user-id'); // From session
  const messagesEndRef              = useRef<HTMLDivElement>(null);
  const typingTimer                 = useRef<ReturnType<typeof setTimeout>>();

  // Fetch rooms
  useEffect(() => {
    fetch('/api/chat/rooms')
      .then(r => r.json())
      .then(d => { if (d.success) setRooms(d.data); })
      .catch(() => {});
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
    <div className="min-h-screen bg-vanda flex" style={{ paddingLeft: '256px' }}>
      <div className="grain-overlay" />

      {/* Room list */}
      <div className="w-80 flex flex-col border-r border-[rgba(255,107,0,0.1)]"
        style={{ background: '#0D0D1A' }}>
        {/* Header */}
        <div className="px-5 py-4 border-b border-[rgba(255,107,0,0.1)]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-lg">
              <span className="seo-strip text-white">Chats</span>
            </h2>
            <button className="btn-manki text-xs py-1.5 px-3">+ New</button>
          </div>
          <input className="input-manki text-sm py-2" placeholder="🔍 Search conversations…" />
        </div>

        {/* Room list */}
        <div className="flex-1 overflow-y-auto">
          {rooms.length === 0 && (
            <div className="p-6 text-center text-text-muted text-sm">
              <div className="text-4xl mb-3">💬</div>
              No conversations yet
            </div>
          )}
          {rooms.map(room => (
            <button key={room.id}
              className={`w-full px-4 py-3 flex items-start gap-3 hover:bg-[rgba(255,107,0,0.06)]
                transition-all text-left border-b border-[rgba(255,255,255,0.04)]
                ${activeRoom?.id === room.id ? 'bg-[rgba(255,107,0,0.1)]' : ''}`}
              onClick={() => loadRoom(room)}>
              <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center
                font-bold text-sm text-vanda"
                style={{ background: 'linear-gradient(135deg,#FFD700,#FF6B00)' }}>
                {room.name?.charAt(0) ?? '?'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-white truncate">
                    {room.name ?? 'Direct Chat'}
                  </span>
                  <span className="text-[10px] text-text-muted flex-shrink-0 ml-2">
                    {room.lastMessage
                      ? new Date(room.lastMessage.sentAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
                      : ''}
                  </span>
                </div>
                <div className="text-xs text-text-muted truncate mt-0.5">
                  {room.lastMessage?.content ?? 'No messages yet'}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {activeRoom ? (
          <>
            {/* Room header */}
            <div className="px-6 py-4 border-b border-[rgba(255,107,0,0.1)] flex items-center gap-4 glass sticky top-0 z-10">
              <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-vanda"
                style={{ background: 'linear-gradient(135deg,#FFD700,#FF6B00)' }}>
                {activeRoom.name?.charAt(0) ?? 'D'}
              </div>
              <div>
                <div className="font-display font-bold text-base text-white">
                  {activeRoom.name ?? 'Direct Chat'}
                </div>
                <div className="flex items-center gap-2">
                  <div className="online-dot" style={{ width: 6, height: 6 }} />
                  <span className="text-[11px] text-success">Active now</span>
                </div>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <button className="btn-ghost text-xs py-1.5 px-3">📌 Pinned</button>
                <button className="btn-ghost text-xs py-1.5 px-3">🔍 Search</button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-6"
              style={{ background: 'radial-gradient(ellipse 80% 40% at 50% 100%, rgba(255,107,0,0.04) 0%, transparent 70%)' }}>
              {loading && (
                <div className="flex justify-center py-8">
                  <div className="flex gap-2">
                    {[0,1,2].map(i => (
                      <div key={i} className="w-2 h-2 rounded-full bg-saffron animate-bounce"
                        style={{ animationDelay: `${i*0.15}s` }} />
                    ))}
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

              {/* Typing indicator */}
              {typingUsers.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex items-center gap-3 mb-4">
                  <div className="flex gap-1.5 px-4 py-3 rounded-2xl msg-bubble-recv">
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                  </div>
                  <span className="text-xs text-text-muted">{typingUsers.join(', ')} typing…</span>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-6 py-4 border-t border-[rgba(255,107,0,0.1)] glass">
              <div className="flex items-end gap-3">
                <div className="flex-1 relative">
                  <textarea
                    className="input-manki resize-none pr-12 min-h-[44px] max-h-32 py-3"
                    rows={1}
                    placeholder="Type your message… (Enter to send)"
                    value={input}
                    onChange={e => handleInputChange(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
                    }}
                    style={{ lineHeight: 1.5 }}
                  />
                  {/* Emoji button */}
                  <button className="absolute right-3 top-3 text-text-muted hover:text-gold text-lg">
                    😊
                  </button>
                </div>
                {/* Attachment */}
                <button className="btn-ghost w-11 h-11 flex items-center justify-center rounded-xl p-0 text-lg">
                  📎
                </button>
                {/* Send */}
                <button
                  className="btn-manki w-11 h-11 flex items-center justify-center rounded-xl p-0"
                  onClick={send} disabled={!input.trim()}>
                  ➤
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="text-7xl mb-6">💬</motion.div>
            <h2 className="font-display font-bold text-2xl text-white mb-3">
              <span className="seo-strip">Select a conversation</span>
            </h2>
            <p className="text-text-muted text-base max-w-xs leading-relaxed">
              Choose from your committee chats, campaign rooms, or start a direct conversation with a party member.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
