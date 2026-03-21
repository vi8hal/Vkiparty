// src/types/index.ts
// Shared TypeScript types across the Manki Party app

export type AdminLevel =
  | 'TOLA' | 'WARD' | 'VILLAGE' | 'PANCHAYAT'
  | 'GRAM_PANCHAYAT' | 'BLOCK' | 'ZILA_PARISHAD' | 'STATE_COMMITTEE';

export type PostLevel =
  | 'PRESIDENT' | 'VICE_PRESIDENT' | 'SECRETARY' | 'JOINT_SECRETARY'
  | 'TREASURER' | 'SPOKESPERSON' | 'YOUTH_WING' | 'WOMEN_WING'
  | 'KARYAKARTA' | 'OBSERVER';

export interface UserProfile {
  id:                string;
  email:             string;
  fullName:          string;
  age?:              number;
  phone?:            string;
  whatsapp?:         string;
  profilePictureUrl?: string;
  aboutMe?:          string;
  address?:          IndianAddress;
  designatedPost:    PostLevel;
  locationId:        string;
  isVerified:        boolean;
  isPostVerified:    boolean;
  lastActiveAt?:     string;
  joinedAt:          string;
}

export interface IndianAddress {
  tola?:           string;
  ward?:           string;
  village?:        string;
  panchayat?:      string;
  gramPanchayat?:  string;
  block?:          string;
  zila?:           string;
  state:           string;
  pincode?:        string;
}

export interface Location {
  id:       string;
  name:     string;
  level:    AdminLevel;
  parentId?: string;
  state:    string;
}

export interface ChatMessage {
  id:          string;
  roomId:      string;
  content:     string | null;
  messageType: 'TEXT' | 'IMAGE' | 'DOCUMENT' | 'AUDIO' | 'SYSTEM';
  mediaUrl?:   string;
  sentAt:      string;
  isEdited:    boolean;
  isDeleted:   boolean;
  sender: {
    id:                string;
    fullName:          string;
    profilePictureUrl?: string;
    designatedPost:    PostLevel;
  };
  reactions:   MessageReaction[];
  replyTo?:    { id: string; content: string | null; sender: { fullName: string } } | null;
}

export interface MessageReaction {
  emoji:  string;
  userId: string;
  user:   { fullName: string };
}

export interface Notification {
  id:          string;
  type:        string;
  title:       string;
  body:        string;
  link?:       string;
  isRead:      boolean;
  createdAt:   string;
  triggeredBy?: { fullName: string; profilePictureUrl?: string };
}
