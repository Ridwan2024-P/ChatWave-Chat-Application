import { Injectable, computed, signal } from '@angular/core';



const BD_MOBILE = /^(?:\+?880|0)(1[3-9]\d{8})$/;

export type PhoneResult = { ok: true; e164: string } | { ok: false; error: string };

@Injectable({ providedIn: 'root' })
export class AuthService {

  validatePhone(raw: string): PhoneResult {
    const cleaned = raw.replace(/[\s-]/g, '');
    if (!cleaned) return { ok: false, error: 'Enter your mobile number.' };
    if (!/^\+?\d+$/.test(cleaned)) return { ok: false, error: 'Use digits only (optionally starting with +880).' };
    const m = BD_MOBILE.exec(cleaned);
    if (!m) return { ok: false, error: 'Enter a valid Bangladesh number, e.g. 01712345678 or +8801712345678.' };
    return { ok: true, e164: `+880${m[1]}` };
  }

  
}
