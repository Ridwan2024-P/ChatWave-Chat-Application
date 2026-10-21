
import { Injectable, computed, signal } from '@angular/core';

const SESSION_KEY = 'chatwave.session';
const PENDING_KEY = 'chatwave.pending';
const OTP_KEY = 'chatwave.otp';
const OTP_LIMITS_KEY = 'chatwave.otp-limits';

const MAX_OTP_REQUESTS = 3;
const COOLDOWN_MS = 60 * 60 * 1000;

const BD_MOBILE = /^(?:\+?880|0)(1[3-9]\d{8})$/;

type OtpLimit = {
  count: number;
  blockedUntil: number;
};

export type PhoneResult =
  | { ok: true; e164: string }
  | { ok: false; error: string };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _phone = signal<string | null>(
    localStorage.getItem(SESSION_KEY)
  );

  private readonly _pending = signal<string | null>(
    sessionStorage.getItem(PENDING_KEY)
  );

  readonly phone = this._phone.asReadonly();
  readonly pendingPhone = this._pending.asReadonly();
  readonly isLoggedIn = computed(() => this._phone() !== null);

  validatePhone(raw: string): PhoneResult {
    const cleaned = raw.replace(/[\s-]/g, '');

    if (!cleaned) {
      return { ok: false, error: 'Enter your mobile number.' };
    }

    if (!/^\+?\d+$/.test(cleaned)) {
      return {
        ok: false,
        error: 'Use digits only (optionally starting with +880).'
      };
    }

    const match = BD_MOBILE.exec(cleaned);

    if (!match) {
      return {
        ok: false,
        error: 'Enter a valid Bangladesh number, e.g. 01712345678 or +8801712345678.'
      };
    }

    return { ok: true, e164: `+880${match[1]}` };
  }

  mask(e164: string): string {
    return `+880 ${e164.slice(4, 5)}${e164.slice(-7)}`;
  }

  private getLimits(): Record<string, OtpLimit> {
    try {
      return JSON.parse(
        localStorage.getItem(OTP_LIMITS_KEY) ?? '{}'
      ) as Record<string, OtpLimit>;
    } catch {
      return {};
    }
  }

  private saveLimits(limits: Record<string, OtpLimit>): void {
    localStorage.setItem(OTP_LIMITS_KEY, JSON.stringify(limits));
  }

  getOtpCooldown(e164: string): number {
    const limits = this.getLimits();
    const limit = limits[e164];

    if (!limit?.blockedUntil) {
      return 0;
    }

    const remaining = limit.blockedUntil - Date.now();

    if (remaining <= 0) {
      delete limits[e164];
      this.saveLimits(limits);
      return 0;
    }

    return remaining;
  }

  canRequestOtp(e164: string): boolean {
    return this.getOtpCooldown(e164) === 0;
  }

  requestOtp(e164: string): string {
    const limits = this.getLimits();
    const now = Date.now();

    let limit = limits[e164];

   if (limit?.blockedUntil && limit.blockedUntil <= now) {
  delete limits[e164];
  // limit = undefined; error this line
}

   
    if (limit?.blockedUntil && limit.blockedUntil > now) {
      throw new Error(
        'You have reached the 3 OTP request limit. Please wait 1 hour.'
      );
    }

    const count = limit?.count ?? 0;

    if (count >= MAX_OTP_REQUESTS) {
      throw new Error(
        'You have reached the 3 OTP request limit. Please wait 1 hour.'
      );
    }

    const nextCount = count + 1;

    limits[e164] = {
      count: nextCount,
      blockedUntil:
        nextCount >= MAX_OTP_REQUESTS
          ? now + COOLDOWN_MS
          : 0
    };

    this.saveLimits(limits);

    this._pending.set(e164);
    sessionStorage.setItem(PENDING_KEY, e164);

    const otp = String(
      Math.floor(100000 + Math.random() * 900000)
    );

    sessionStorage.setItem(OTP_KEY, otp);

    return otp;
  }

  currentMockOtp(): string {
    return sessionStorage.getItem(OTP_KEY) ?? '';
  }

  verifyOtp(code: string): boolean {
    const pending = this._pending();

    if (!pending || code !== this.currentMockOtp()) {
      return false;
    }

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
