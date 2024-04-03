import { Component, OnInit } from '@angular/core';
import { environment } from "../environment.js";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { UploadFmcTokenService } from './services/upload-fmc-token.service.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'af-notification';
  message: any = null;
  constructor(private uploadfmc: UploadFmcTokenService) { }
  ngOnInit(): void {
    this.requestPermission();
    this.listen()

  }
  requestPermission() {
    const messaging = getMessaging();
    getToken(messaging,
      { vapidKey: environment.firebase.vapidKey }).then(
        (currentToken) => {
          if (currentToken) {
            console.log("Hurraaa!!! we got the token.....");
            console.log(currentToken);
            this.uploadfmc.getToken(currentToken).subscribe({
              next: (response) => {
                console.log("Send successfully");

              },
              error: (err) => {
                console.log(err);
              }
            })
          } else {
            console.log('No registration token available. Request permission to generate one.');
          }
        }).catch((err) => {
          console.log('An error occurred while retrieving token. ', err);
        });
  }
  listen() {
    const messaging = getMessaging();
    console.log("before on message...");
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      this.message = payload;

    });


  }
  // title = '06_frontend';
}
