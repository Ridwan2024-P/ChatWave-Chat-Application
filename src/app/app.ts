import { Component, signal } from '@angular/core';
import { Welcome } from './welcome/welcome';


@Component({
  imports: [Welcome],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('ChatApplication');
}
