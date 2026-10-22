import { ChatMessage, ChatState, Contact } from './chat.models';

export const MOCK_CONTACTS: Contact[] = [
  {
    id: 'c1',
    name: 'Rahim Uddin',
    phone: '+880 1711 000111',
    about: 'Busy — message me.',
    online: true,
    isGroup: false,
    color: '#0ea5e9',
  },
  {
    id: 'c2',
    name: 'Nusrat Jahan',
    phone: '+880 1819 222333',
    about: 'Coffee first ☕',
    online: false,
    isGroup: false,
    color: '#ec4899',
  },
  {
    id: 'c3',
    name: 'Family Group',
    phone: '5 members',
    about: 'Eid plans & dinner updates',
    online: true,
    isGroup: true,
    color: '#f59e0b',
  },
  {
    id: 'c4',
    name: 'Tanvir Ahmed',
    phone: '+880 1911 444555',
    about: 'At the gym 💪',
    online: true,
    isGroup: false,
    color: '#8b5cf6',
  },
  {
    id: 'c5',
    name: 'Office Team',
    phone: '12 members',
    about: 'Sprint planning every Sunday',
    online: false,
    isGroup: true,
    color: '#14b8a6',
  },
  {
    id: 'c6',
    name: 'Sadia Islam',
    phone: '+880 1611 666777',
    about: 'Available',
    online: false,
    isGroup: false,
    color: '#ef4444',
  },
  {
    id: 'c7',
    name: 'Mahfuz Hasan',
    phone: '+880 1511 888999',
    about: 'Hey there! I am using ChatWave.',
    online: true,
    isGroup: false,
    color: '#64748b',
  },
];

export const REPLIES = [
  'Sounds good to me 👍',
  'Let me check and get back to you.',
  'Haha, that is great!',
  'Okay, see you then.',
  'Can we talk about it tomorrow?',
  'Thanks for letting me know 🙏',
  'Perfect, I will send it over soon.',
];

function ago(days: number, hour: number, min: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, min, 0, 0);
  return d.toISOString();
}

type Seed = [number, number, number, 'me' | 'them', string, string?];
const SEEDS: Record<string, Seed[]> = {
  c1: [
    [2, 18, 5, 'them', 'Bro, did you see the match last night?'],
    [2, 18, 9, 'me', 'Yes! What a finish 😄'],
    [0, 9, 40, 'them', 'Lunch at 1? Same place.'],
  ],
  c2: [
    [1, 20, 15, 'me', 'Did you finish the slides?'],
    [1, 20, 31, 'them', 'Almost done, sending in an hour.'],
  ],
  c3: [
    [1, 11, 0, 'them', 'Dinner at 8 on Friday, everyone confirm.', 'Ammu'],
    [1, 11, 4, 'me', 'I will be there.'],
    [0, 8, 20, 'them', 'Bring sweets please 🍬', 'Apu'],
  ],
  c4: [[0, 7, 10, 'them', 'Gym tomorrow morning?']],
  c5: [
    [3, 15, 0, 'them', 'Standup moved to 10:30.', 'Karim'],
    [3, 15, 3, 'me', 'Noted, thanks.'],
  ],
  c6: [
    [5, 12, 0, 'me', 'Happy birthday! 🎂'],
    [5, 12, 20, 'them', 'Thank you so much!!'],
  ],
  c7: [[0, 10, 2, 'them', 'Welcome to ChatWave! 🎉']],
};

export function seedState(): ChatState {
  const messages: Record<string, ChatMessage[]> = {};
  for (const [id, seeds] of Object.entries(SEEDS)) {
    messages[id] = seeds.map(([d, h, m, sender, text, senderName], i) => ({
      id: `${id}-s${i}`,
      contactId: id,
      text,
      sender,
      senderName,
      sentAt: ago(d, h, m),
    }));
  }
  return { messages, unread: { c1: 1, c3: 1, c4: 1, c7: 1 }, muted: {} };
}
