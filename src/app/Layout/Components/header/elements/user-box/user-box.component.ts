import { EditProfileComponent } from "./../../../../../DemoPages/Profile/edit-profile/edit-profile.component";
import { ProfileService } from "./../../../../../services/profile.service";
import { Profile } from "src/app/models/profile/profile.class";
import { Router, ActivatedRoute } from "@angular/router";
import { StorageService } from "./../../../../../core/storage-service/storage.service";
import { Component, OnInit } from "@angular/core";
import { ThemeOptions } from "../../../../../theme-options";
import { MatBottomSheet } from "@angular/material";
import { StorageServiceTypeEnum } from "../../../../../core/storage-service/storage-service-type.enum";
import {
  ProfileTypeEnumFormatter,
  ProfileTypeEnum,
} from "../../../../../models/profile/profile-type.enum";

@Component({
  selector: "app-user-box",
  templateUrl: "./user-box.component.html",
})
export class UserBoxComponent implements OnInit {
  private profile: Profile;
  profileImage: string;
  isImageAvailable = false;
  constructor(
    public globals: ThemeOptions,
    private router: Router,
    private storageService: StorageService,
    private profileService: ProfileService,
    private _bottomSheet: MatBottomSheet,
    private profileTypeEnumFormatter: ProfileTypeEnumFormatter
  ) {}

  ngOnInit() {
    if (!this.profile) {
      if (this.storageService.get(StorageServiceTypeEnum.PROFILE)) {
        this.profile = this.storageService.get(StorageServiceTypeEnum.PROFILE);
        if (this.profile.profilePic != null) {
          this.isImageAvailable = true;
          this.profileImage = this.profileService.getProfileImagePath(
            this.profile.profilePic
          );
        } else {
          this.profileImage = this.profile.fullName
            .toUpperCase()
            .substring(0, 1);
        }
      }
    } else {
      this.router.navigate(["login-boxed"]);
    }
  }

  profileTypeFormatter(profileType: ProfileTypeEnum) {
    if (profileType != null) {
      return this.profileTypeEnumFormatter.formatProfileType(
        profileType.toString()
      );
    }
    return this.profileTypeEnumFormatter.formatProfileType(null);
  }

  editProfile() {
    const bottomSheetRef = this._bottomSheet.open(EditProfileComponent, {
      data: {
        mobile: this.profile.contact.mobile,
        type: this.profile.type,
      },
    });
    bottomSheetRef.afterDismissed().subscribe((profile: Profile) => {
      if(profile){
        this.profile = profile;
      }
    });
  }

  logout() {
    this.storageService.clearAll();
    this.router.navigate(["pages/login-boxed"]);
  }
}
