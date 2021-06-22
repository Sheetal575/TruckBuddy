import { Component, OnInit, ViewChild } from "@angular/core";
import { MatBottomSheet, MatDialog } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ProfileTypeEnum } from "src/app/models/profile/profile-type.enum";
import { ProfileTypeEnumFormatter } from "./../../../models/profile/profile-type.enum";
import {
  VerificationStateEnum,
  VerificationStateEnumFormatter,
} from "../../../models/profile/verification-status.enum";
import { Profile } from "./../../../models/profile/profile.class";
import { ProfileService } from "./../../../services/profile.service";
import { EditProfileComponent } from "./../edit-profile/edit-profile.component";
import { ImageViewerComponent } from "../../image-viewer/image-viewer.component";

@Component({
  selector: "app-view-profile",
  templateUrl: "./view-profile.component.html",
  styleUrls: ["./view-profile.component.sass"],
})
export class ViewProfileComponent implements OnInit {
  profile: Profile;
  isLoading: boolean = false;
  image: string;
  @ViewChild("closeProfileUpdateModal") closeProfileUpdateModal;

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private profileService: ProfileService,
    private ngxService: NgxUiLoaderService,
    private profileTypeEnumFormatter: ProfileTypeEnumFormatter,
    private profileVerificationStateEnumFormatter: VerificationStateEnumFormatter,
    private _bottomSheet: MatBottomSheet,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.activeRoute.fragment.subscribe((id) => {
      if (id) {
        this.ngxService.start();
        this.getProfile(id);
      } else {
        this.routeToProfilesList();
      }
    });
  }

  editProfile() {
    const bottomSheetRef = this._bottomSheet.open(EditProfileComponent, {
      data: {
        mobile: this.profile.contact.mobile,
        type: this.profile.type,
      },
    });
    bottomSheetRef.afterDismissed().subscribe((profile: Profile) => {
      if (profile) {
        this.profile = profile;
        this.getProfilePic(profile);
      }
    });
  }

  openImage(id: string) {
    const dialogRef = this.dialog.open(ImageViewerComponent, {
      data: { image: id },
    });

    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  afterProfileUpdate(profile: Profile) {
    this.profile = profile;
  }

  getProfilePic(profile: Profile) {
    if (profile.profilePic != null) {
      this.image = this.profileService.getProfileImagePath(profile.profilePic);
    }
  }

  async getProfile(id: string) {
    await this.profileService.getProfile(id).subscribe(
      (profile: Profile) => {
        if (profile) {
          this.profile = profile;
          this.getProfilePic(profile);
        } else {
          this.routeToProfilesList();
        }
      },
      (error) => {
        this.routeToProfilesList();
      },
      () => {
        this.isLoading = false;
        this.ngxService.stop();
      }
    );
  }

  profileTypeFormatter(profileType: ProfileTypeEnum) {
    if (profileType != null) {
      return this.profileTypeEnumFormatter.formatProfileType(
        profileType.toString()
      );
    }
    return this.profileTypeEnumFormatter.formatProfileType(null);
  }

  profileVerificationStateFormatter(status: VerificationStateEnum) {
    if (status != null) {
      return this.profileVerificationStateEnumFormatter.formatVerificationState(
        status.toString()
      );
    }
    return this.profileVerificationStateEnumFormatter.formatVerificationState(
      null
    );
  }

  routeToProfilesList() {
    this.router.navigate(["../list-profile"], { relativeTo: this.activeRoute });
  }
}
