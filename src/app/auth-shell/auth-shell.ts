import { Component,ChangeDetectionStrategy } from '@angular/core';
import { LucideShieldCheck, LucideUsers, LucideZap, LucideCheckCheck } from '@lucide/angular';
@Component({
  imports: [LucideShieldCheck, LucideUsers, LucideZap, LucideCheckCheck],
   changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-auth-shell',
  styleUrl: './auth-shell.css',
  templateUrl: './auth-shell.html',
})
export class AuthShell {}
