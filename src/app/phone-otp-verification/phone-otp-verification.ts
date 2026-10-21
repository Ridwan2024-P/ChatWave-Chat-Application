import { Component, inject, OnDestroy, signal } from '@angular/core';
import { AuthService } from '../services.ts/auth.service';
import { Router } from '@angular/router';
import { AuthShell } from '../auth-shell/auth-shell';
import {  BrnInputOtpImports } from '@spartan-ng/brain/input-otp';
import { LucideArrowLeft } from '@lucide/angular';

const RESEND_SECONDS = 30;

@Component({
  imports: [AuthShell, BrnInputOtpImports, LucideArrowLeft],
  selector: 'app-phone-otp-verification',
  styleUrl: './phone-otp-verification.css',
  templateUrl: './phone-otp-verification.html',
})
export class PhoneOtpVerification implements OnDestroy{
   private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private timer?: number;

  readonly masked = this.auth.mask(this.auth.pendingPhone() ?? '');
  readonly mockOtp = signal(this.auth.currentMockOtp());
  readonly code = signal('');
  readonly error = signal<string | null>(null);
  readonly loading = signal(false);
  readonly seconds = signal(RESEND_SECONDS);
  readonly slots = [0, 1, 2, 3, 4, 5];
  readonly digitsOnly = (text: string): string => text.replace(/\D/g, '').slice(0, 6);

  constructor() { this.startCountdown(); }

  
verify(): void {
  if (this.loading()) return;

  // OTP expires after 30 seconds
  if (this.seconds() <= 0) {
    this.error.set('OTP expired. Please request a new code.');
    return;
  }

  if (!/^\d{6}$/.test(this.code())) {
    this.error.set('Enter all 6 digits of the code.');
    return;
  }

  this.loading.set(true);

  window.setTimeout(() => {
    if (this.seconds() <= 0) {
      this.loading.set(false);
      this.error.set('OTP expired. Please request a new code.');
      return;
    }

    if (this.auth.verifyOtp(this.code())) {
      void this.router.navigateByUrl('/');
    } else {
      this.loading.set(false);
      this.error.set('Incorrect code. Check the demo code above and try again.');
    }
  }, 500);
}

resend(): void {
  if (this.seconds() > 0) return;

  const phone = this.auth.pendingPhone();
  if (!phone) return;

  this.mockOtp.set(this.auth.requestOtp(phone));
  this.code.set('');
  this.error.set(null);
  this.startCountdown();
}


  changeNumber(): void {
    this.auth.clearPending();
    void this.router.navigateByUrl('/verify-phone');
  }

  private startCountdown(): void {
    window.clearInterval(this.timer);
    this.seconds.set(RESEND_SECONDS);
    this.timer = window.setInterval(() => {
      this.seconds.update((s) => Math.max(0, s - 1));
      if (this.seconds() === 0) window.clearInterval(this.timer);
    }, 1000);
  }

  ngOnDestroy(): void { window.clearInterval(this.timer); }
}
