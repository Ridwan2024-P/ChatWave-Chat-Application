import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
 {
    path: 'verify-otp',
    renderMode: RenderMode.Client,
  },
  {
    path: 'chat',
    renderMode: RenderMode.Client,
  },
  {
    path: 'verify-phone',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
