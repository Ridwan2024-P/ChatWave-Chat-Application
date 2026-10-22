export interface Contact {
  id: string;
  name: string;
  phone: string;
  about: string;
  online: boolean;
  isGroup: boolean;
  color: string;
}

export interface ChatMessage {
  id: string;
  contactId: string;
  text: string;
  sender: 'me' | 'them';
  senderName?: string;
  sentAt: string; // ISO
}

export type ChatFilter = 'all' | 'unread' | 'groups';

export interface ConversationSummary {
  contact: Contact;
  last: ChatMessage | undefined;
  unread: number;
}

export interface ChatState {
  messages: Record<string, ChatMessage[]>;
  unread: Record<string, number>;
  muted: Record<string, boolean>;
}
