import { Component, computed, output, signal } from '@angular/core';
import { ChatMessage, Contact } from '../services/chat.models';
import { MOCK_CONTACTS, seedState } from '../services/mock-data';

interface ChatRow {
  contact: Contact;
  initials: string;
  preview: string;
  time: string;
  unread: number;
  muted: boolean;
  sortKey: number;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class ChatSidebar {
  readonly chatSelected = output<string>();

  readonly contacts = signal<Contact[]>(MOCK_CONTACTS);
  readonly state = signal(seedState());
  readonly search = signal('');
  readonly filter = signal<'all' | 'unread' | 'groups'>('all');
  readonly activeId = signal<string | null>(null);

  readonly rows = computed<ChatRow[]>(() => {
    const { messages, unread, muted } = this.state();
    const q = this.search().trim().toLowerCase();
    const f = this.filter();

    return this.contacts()
      .map((contact): ChatRow => {
        const list = messages[contact.id] ?? [];
        const last = list[list.length - 1];
        return {
          contact,
          initials: this.initials(contact.name),
          preview: last ? this.previewOf(last, contact) : contact.about,
          time: last ? this.formatTime(last.sentAt) : '',
          unread: unread[contact.id] ?? 0,
          muted: !!muted[contact.id],
          sortKey: last ? new Date(last.sentAt).getTime() : 0,
        };
      })
      .filter((r) => !q || r.contact.name.toLowerCase().includes(q))
      .filter((r) => (f === 'unread' ? r.unread > 0 : f === 'groups' ? r.contact.isGroup : true))
      .sort((a, b) => b.sortKey - a.sortKey);
  });

  open(id: string): void {
    this.activeId.set(id);
    // opening a chat clears its unread badge
    this.state.update((s) => ({ ...s, unread: { ...s.unread, [id]: 0 } }));
    this.chatSelected.emit(id);
  }

  onSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  private initials(name: string): string {
    const parts = name.trim().split(/\s+/);
    return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
  }

  private previewOf(m: ChatMessage, c: Contact): string {
    if (m.sender === 'me') return `You: ${m.text}`;
    return c.isGroup && m.senderName ? `${m.senderName}: ${m.text}` : m.text;
  }

  private formatTime(iso: string): string {
    const d = new Date(iso);
    const now = new Date();
    const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
    const days = Math.round((startOf(now) - startOf(d)) / 86_400_000);

    if (days <= 0) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (days === 1) return 'Yesterday';
    if (days < 7) return d.toLocaleDateString([], { weekday: 'long' });
    return d.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
}
