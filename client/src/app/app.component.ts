import { Component } from '@angular/core';
import Chatkit from '@pusher/chatkit-client';
import axios from 'axios';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  userId = '';
  currentUser = <any>{};

  addUser() {
    const { userId } = this;
    axios
      .post('http://localhost:5200/users', { userId })
      .then(() => {
        const tokenProvider = new Chatkit.TokenProvider({
          url: 'http://localhost:5200/authenticate'
        });

        const chatManager = new Chatkit.ChatManager({
          instanceLocator: 'v1:us1:17839bba-49c6-4ed3-9c60-c70a93a0f129',
          userId,
          tokenProvider
        });

        return chatManager.connect().then(currentUser => {
          this.currentUser = currentUser;
        });
      })
      .catch(error => console.error(error));
  }
}
