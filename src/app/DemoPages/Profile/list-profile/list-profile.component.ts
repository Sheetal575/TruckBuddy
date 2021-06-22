import { Component, OnInit, ViewChild } from "@angular/core";
import {
  MatPaginator,
  MatSort,
  MatTableDataSource,
  MatDialog,
} from "@angular/material";
import { Profile } from "src/app/models/profile/profile.class";
import {
  ToastMessage,
  ToastMessageType,
} from "./../../../core/utils/toastr-message.helper";
import { ProfileService } from "./../../../services/profile.service";
import { StorageService } from "../../../core/storage-service/storage.service";
import { StorageServiceTypeEnum } from "../../../core/storage-service/storage-service-type.enum";
import { ProfileSearchReq } from "../../../models/profile/profile-search-req.class";
import { ProfileTypeEnum } from "src/app/models/profile/profile-type.enum";
import { ProfileTypeEnumFormatter } from "../../../models/profile/profile-type.enum";
import { ConfirmationPromptSheetComponent } from "../../bottom-sheet-pages/confirmation-prompt-sheet/confirmation-prompt-sheet.component";
import { VerificationStateEnum } from "src/app/models/profile/verification-status.enum";
import { Router } from "@angular/router";

@Component({
  selector: "app-list-profile",
  templateUrl: "./list-profile.component.html",
  styleUrls: ["./list-profile.component.sass"],
})
export class ListProfileComponent implements OnInit {
  public displayedColumns = [
    "name",
    "type",
    "contact",
    "email",
    "status",
    "verifyProfile",
  ];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public dataSource = new MatTableDataSource<Profile>();
  loginProfile: Profile;

  constructor(
    private profileService: ProfileService,
    private toaster: ToastMessage,
    private storage: StorageService,
    private profileTypeEnumFormatter: ProfileTypeEnumFormatter,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.loginProfile = this.storage.get(StorageServiceTypeEnum.PROFILE);
    if (this.loginProfile.type.toString() == "SUPER_ADMIN") {
      this.displayedColumns.push("delete");
    }
  }

  ngOnInit() {
    this.getAllProfiles();
  }

  public async getAllProfiles() {
    let profileSearchRequest = this.createProfileSearchReq();
    this.profileService.customSearchProfile(profileSearchRequest).subscribe(
      (response: Profile[]) => {
        this.dataSource.data = response.reverse();
      },
      (error) => {
        this.toaster.showToastr(
          "Oops !!!",
          "Something wents wrong. Please try later.",
          ToastMessageType.ERROR
        );
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

  createProfileSearchReq(): ProfileSearchReq {
    let profileSearchRequest = new ProfileSearchReq();
    switch (this.loginProfile.type.toString()) {
      case "SUPER_ADMIN": {
        break;
      }
      case "TRUCKBUDDY_ADMIN": {
        profileSearchRequest.city = this.loginProfile.address.city;
        profileSearchRequest.profileTypeList = [];
        profileSearchRequest.profileTypeList.push(
          ProfileTypeEnum.TRUCKBUDDY_ADMIN
        );
        profileSearchRequest.profileTypeList.push(
          ProfileTypeEnum.TRUCKBUDDY_SUPPORT
        );
        profileSearchRequest.profileTypeList.push(
          ProfileTypeEnum.CLIENT_MANAGER
        );
        profileSearchRequest.profileTypeList.push(
          ProfileTypeEnum.CLIENT_WAREHOUSE_KEEPER
        );
        profileSearchRequest.profileTypeList.push(ProfileTypeEnum.TAP_OWNER);
        profileSearchRequest.profileTypeList.push(ProfileTypeEnum.TAP_DRIVER);
        profileSearchRequest.profileTypeList.push(ProfileTypeEnum.TAP_HELPER);
        break;
      }
      case "TRUCKBUDDY_SUPPORT": {
        profileSearchRequest.city = this.loginProfile.address.city;
        profileSearchRequest.profileTypeList = [];
        profileSearchRequest.profileTypeList.push(
          ProfileTypeEnum.TRUCKBUDDY_SUPPORT
        );
        profileSearchRequest.profileTypeList.push(
          ProfileTypeEnum.CLIENT_MANAGER
        );
        profileSearchRequest.profileTypeList.push(
          ProfileTypeEnum.CLIENT_WAREHOUSE_KEEPER
        );
        profileSearchRequest.profileTypeList.push(ProfileTypeEnum.TAP_OWNER);
        profileSearchRequest.profileTypeList.push(ProfileTypeEnum.TAP_DRIVER);
        profileSearchRequest.profileTypeList.push(ProfileTypeEnum.TAP_HELPER);
        break;
      }
      case "TAP_OWNER": {
        profileSearchRequest.city = this.loginProfile.address.city;
        profileSearchRequest.profileTypeList = [];
        profileSearchRequest.profileTypeList.push(ProfileTypeEnum.TAP_DRIVER);
        profileSearchRequest.profileTypeList.push(ProfileTypeEnum.TAP_HELPER);
        break;
      }
    }
    return profileSearchRequest;
  }

  ngAfterViewInit(): void {
    this.dataSource.sortingDataAccessor = (item, property) => {
      // Split '.' to allow accessing property of nested object
      switch (property) {
        case "name":
          return item.fullName;
        case "type":
          return item.type;
        case "contact":
          return item.contact.mobile;
        case "email":
          return item.contact.email;
        case "status":
          return item.state;
      }
    };
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  };

  public async deleteProfile(profile: Profile) {
    try {
      var deletedProfile = await this.profileService.deleteProfile(profile.id).toPromise();
      this.toaster.showToastr(
        "Success",
        "Profile deleted successfully.",
        ToastMessageType.SUCCESS
      );
      this.getAllProfiles();
    } catch (error) {
      this.toaster.showToastr(
        "Oops !!!",
        "Something wents wrong. Please try later.",
        ToastMessageType.ERROR
      );
    }
  }

  public async verifyAndUpdateProfile(
    profile: Profile,
    isRejectedOrBlocked: boolean
  ) {
    if (isRejectedOrBlocked) {
      const dialogRef = this.dialog.open(ConfirmationPromptSheetComponent, {
        width: "250px",
      });

      dialogRef.afterClosed().subscribe(async (result) => {
        if (result.isConfirmed) {
          profile.state = VerificationStateEnum.VERIFIED;
          var profileUpdate = await this.updateProfile(profile);
          this.getAllProfiles();
        }
      });
    } else {
      this.router.navigate(["../../document/verify-profile-document"], {
        fragment: profile.id + "@" + profile.fullName,
      });
    }
  }

  async updateProfile(profile: Profile) {
    try {
      let updateProfile = (await this.profileService
        .updateProfile(profile)
        .toPromise()) as Profile;
      this.toaster.showToastr(
        "Success",
        "Profile updated successfully.",
        ToastMessageType.SUCCESS
      );
    } catch (err) {
      this.toaster.showToastr(
        "Oops !!!",
        "Something wents wrong. Please try later.",
        ToastMessageType.ERROR
      );
    }
  }
}
