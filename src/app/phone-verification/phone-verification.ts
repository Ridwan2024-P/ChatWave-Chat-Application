import { Component,inject, signal } from '@angular/core';
import { AuthShell } from '../auth-shell/auth-shell';
import { Router } from '@angular/router';
import { AuthService } from '../services.ts/auth.service';
import { LucideArrowLeft } from '@lucide/angular';

@Component({
  imports: [AuthShell,LucideArrowLeft],
  selector: 'app-phone-verification',
  styleUrl: './phone-verification.css',
  templateUrl: './phone-verification.html',
})
export class PhoneVerification {
 private readonly auth = inject(AuthService);
 private readonly router = inject(Router);
  readonly phone = signal('');
  readonly error = signal<string | null>(null);
  readonly loading = signal(false);

  submit(): void {
    const result = this.auth.validatePhone(this.phone());
    if (!result.ok) { this.error.set(result.error); return; }
    this.error.set(null);
    this.loading.set(true);
    window.setTimeout(() => {
      this.auth.requestOtp(result.e164);
      void this.router.navigateByUrl('/verify-otp');
    }, 600);
  }
goBack() {
  this.router.navigate(['/']);
}

}
