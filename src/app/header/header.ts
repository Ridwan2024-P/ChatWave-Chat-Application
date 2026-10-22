
import {
  Component,
  ElementRef,
  HostListener,
  Input,
  computed,
  inject,
} from '@angular/core';

import { Router } from '@angular/router';
import {
  HlmSidebarImports,
  HlmSidebarService,
} from '@spartan-ng/helm/sidebar';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [HlmSidebarImports],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private router = inject(Router);
  private host = inject(ElementRef<HTMLElement>);
  private sidebarService = inject(HlmSidebarService);

  @Input() title = '';

  collapsed = computed(
    () =>
      !this.sidebarService.isMobile() &&
      this.sidebarService.state() === 'collapsed',
  );

  menuOpen = false;
  readonly appName = 'ChatWave';
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const wrap = this.host.nativeElement.querySelector('.profile-wrap');

    if (wrap && !wrap.contains(event.target as Node)) {
      this.menuOpen = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.menuOpen = false;
  }

  goProfile(): void {
    this.menuOpen = false;
    this.router.navigate(['/profile']);
  }

  logout(): void {
    this.menuOpen = false;
    this.router.navigate(['/login']);
  }
}
