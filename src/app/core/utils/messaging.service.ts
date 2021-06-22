import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AngularFireMessaging } from '@angular/fire/messaging';
 
@Injectable()
export class MessagingService {
 
currentMessage = new BehaviorSubject(null);
 
constructor(private angularFireMessaging: AngularFireMessaging) {
 
  }
 
  requestPermission() {
    this.angularFireMessaging.requestToken.subscribe(
    (token) => {
    console.log(token);
    });
  }
 
  receiveMessage() {
    this.angularFireMessaging.messages.subscribe(
    (msg) => {
    console.log("show message!", msg);
    this.currentMessage.next(msg);
       })
    }
}
