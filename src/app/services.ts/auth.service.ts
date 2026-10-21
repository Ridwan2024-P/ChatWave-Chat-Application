import { Injectable, computed, signal } from '@angular/core';

const SESSION_KEY = 'chatwave.session';
const PENDING_KEY = 'chatwave.pending';
const OTP_KEY = 'chatwave.otp';

const BD_MOBILE = /^(?:\+?880|0)(1[3-9]\d{8})$/;

export type PhoneResult = { ok: true; e164: string } | { ok: false; error: string };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _phone = signal<string | null>(localStorage.getItem(SESSION_KEY));
  private readonly _pending = signal<string | null>(sessionStorage.getItem(PENDING_KEY));

  readonly phone = this._phone.asReadonly();
  readonly pendingPhone = this._pending.asReadonly();
  readonly isLoggedIn = computed(() => this._phone() !== null);

  validatePhone(raw: string): PhoneResult {
    const cleaned = raw.replace(/[\s-]/g, '');
    if (!cleaned) return { ok: false, error: 'Enter your mobile number.' };
    if (!/^\+?\d+$/.test(cleaned)) return { ok: false, error: 'Use digits only (optionally starting with +880).' };
    const m = BD_MOBILE.exec(cleaned);
    if (!m) return { ok: false, error: 'Enter a valid Bangladesh number, e.g. 01712345678 or +8801712345678.' };
    return { ok: true, e164: `+880${m[1]}` };
  }

  mask(e164: string): string {
    return `+880 ${e164.slice(4, 5)}${e164.slice(-7)}`;
  }

 
  requestOtp(e164: string): string {
    this._pending.set(e164);
    sessionStorage.setItem(PENDING_KEY, e164);
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    sessionStorage.setItem(OTP_KEY, otp);
    return otp;
  }

  currentMockOtp(): string {
    return sessionStorage.getItem(OTP_KEY) ?? '';
  }

  verifyOtp(code: string): boolean {
    const pending = this._pending();
    if (!pending || code !== this.currentMockOtp()) return false;
    localStorage.setItem(SESSION_KEY, pending);
    this._phone.set(pending);
    this.clearPending();
    return true;
  }

  clearPending(): void {
    this._pending.set(null);
    sessionStorage.removeItem(PENDING_KEY);
    sessionStorage.removeItem(OTP_KEY);
  }

  logout(): void {
    localStorage.removeItem(SESSION_KEY);
    this._phone.set(null);
  }
}
