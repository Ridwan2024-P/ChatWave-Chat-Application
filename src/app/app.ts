import { Component, signal } from '@angular/core';
import { Welcome } from './welcome/welcome';
import { RouterOutlet } from '@angular/router';
import { AuthShell } from './auth-shell/auth-shell';


@Component({
  imports: [RouterOutlet, AuthShell, Welcome],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('ChatApplication');
}
