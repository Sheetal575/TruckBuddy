import { Injectable } from "@angular/core";
import { AngularFireMessaging } from "@angular/fire/messaging";
import { SnotifyPosition, SnotifyService } from "ng-snotify";
import { BehaviorSubject } from "rxjs";
import { Howl } from "howler";
import { ProfileService } from "./services/profile.service";
import { StorageService } from "./core/storage-service/storage.service";
import { Profile } from "./models/profile/profile.class";
import { StorageServiceTypeEnum } from "./core/storage-service/storage-service-type.enum";

@Injectable()
export class MessagingService {
  currentMessage = new BehaviorSubject(null);
  sound;
  profile: Profile;
  constructor(
    private angularFireMessaging: AngularFireMessaging,
    private snotify: SnotifyService,
    private _profileService: ProfileService,
    private _session: StorageService
  ) {
    this.profile = _session.get(StorageServiceTypeEnum.PROFILE);
  }
  async requestPermission() {
    console.log("ask permission");
    this.angularFireMessaging.requestToken.subscribe(
      async (token) => {
        console.log("token received");
        if (
          !this.profile.notificationToken ||
          this.profile.notificationToken != token
        ) {
          this.profile.notificationToken = token;
          console.log("token synced");
          this.profile = await this._profileService
            .updateProfile(this.profile)
            .toPromise();
          this._session.store(StorageServiceTypeEnum.PROFILE, this.profile);
        }
      },
      (err) => {
        console.error("Unable to get permission to notify.", err);
      }
    );
  }
  receiveMessage() {
    this.angularFireMessaging.messages.subscribe((payload: any) => {
      this.handleNotification({
        title: payload.notification.title,
        body: payload.notification.body,
        image: payload.notification.image,
      });
      // navigator.serviceWorker.getRegistration('/firebase-cloud-messaging-push-scope').then(registration => {
      //     registration.showNotification(payload.notification.title, NotificationOptions);
      // });
      this.currentMessage.next(payload);
    });
  }

  handleNotification(data: { title: string; body: string; image: string }) {
    var sound = new Howl({
      src: ["assets/ring.mp3"],
    });

    sound.play();
    this.snotify.info(data.body, data.title, {
      timeout: 2000,
      showProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      bodyMaxLength: 300,
      icon: data.image,
      position: SnotifyPosition.leftBottom,
    });
  }
}
