import { Component } from '@angular/core';

import {  ChatSidebar } from '../sidebar/sidebar';

@Component({
  imports: [ChatSidebar],
  selector: 'app-chat',
  styleUrl: './chat.css',
  templateUrl: './chat.html',
})
export class Chat {
 activeView = 'POS';

  selectNav(id: string): void {
    this.activeView = id;
  }
}
