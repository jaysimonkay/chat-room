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
  messages = [];
  currentRoom = <any>{};
  roomUsers = [];
  userRooms = [];

  connectToRoom(id) {
    this.messages = [];
    const { currentUser } = this;

    currentUser
      .subscribeToRoom({
        roomId: `${id}`,
        messageLimit: 100,
        hooks: {
          onMessage: message => {
            this.messages.push(message);
          },
          onPresenceChanged: () => {
            this.roomUsers = this.currentRoom.users.sort(a => {
              if (a.presence.state === 'online') return -1;

              return 1;
            });
          }
        }
      })
      .then(currentRoom => {
        this.currentRoom = currentRoom;
        this.roomUsers = currentRoom.users;
        this.userRooms = currentUser.rooms;
      });
  }

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
          this.connectToRoom(
            'aed434cb-2f28-4ff0-910e-30e41d9ab7a5:fdNFOp8mCcz1TEdbfWd68FUxXNktA5fb9N9QDasP6ao='
          );
        });
      })
      .catch(error => console.error(error));
  }
}
