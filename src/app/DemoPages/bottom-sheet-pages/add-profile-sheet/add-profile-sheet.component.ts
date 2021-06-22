import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  MatDialogRef,
  MatPaginator,
  MatSort,
  MatTableDataSource,
  MAT_DIALOG_DATA,
} from "@angular/material";
import { VerificationStateEnum } from "src/app/models/profile/verification-status.enum";
import {
  ToastMessage,
  ToastMessageType,
} from "../../../core/utils/toastr-message.helper";
import { ProfileSearchReq } from "../../../models/profile/profile-search-req.class";
import {
  ProfileTypeEnum,
  ProfileTypeEnumFormatter,
} from "../../../models/profile/profile-type.enum";
import { Profile } from "../../../models/profile/profile.class";
import { ProfileService } from "../../../services/profile.service";

@Component({
  selector: "app-add-profile-sheet",
  templateUrl: "./add-profile-sheet.component.html",
  styleUrls: ["./add-profile-sheet.component.sass"],
})
export class AddProfileSheetComponent implements OnInit, AfterViewInit {
  profileTypes: ProfileTypeEnum[] = [];
  mobileNumber: string = "";
  title: string = "";
  profiles: Profile[] = [];
  public displayedColumns = ["name", "type", "contact", "action"];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public dataSource = new MatTableDataSource<Profile>();

  constructor(
    public dialogRef: MatDialogRef<AddProfileSheetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private profileService: ProfileService,
    private toaster: ToastMessage,
    private profileTypeEnumFormatter: ProfileTypeEnumFormatter
  ) {}

  ngOnInit() {
    this.profileTypes = this.data.profileTypes;
    this.title = this.data.title;
  }

  profileTypeFormatter(profileType: ProfileTypeEnum) {
    if (profileType != null) {
      return this.profileTypeEnumFormatter.formatProfileType(
        profileType.toString()
      );
    }
    return this.profileTypeEnumFormatter.formatProfileType(null);
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
      }
    };
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  };

  async getProfiles() {
    if (!this.mobileNumber) {
      this.toaster.showToastr(
        "Opps!!!",
        "Enter Mobile Number",
        ToastMessageType.ERROR
      );
    }else if (this.mobileNumber.length !=10) {
      this.toaster.showToastr(
        "Opps!!!",
        "Invalid Mobile Number",
        ToastMessageType.ERROR
      );
    }
     else {
      var profileSearchReq = new ProfileSearchReq();
      if(this.profileTypes && this.profileTypes.length>0)
      profileSearchReq.profileTypeList = this.profileTypes;
      profileSearchReq.mobile = this.mobileNumber;
      profileSearchReq.profileState = VerificationStateEnum.VERIFIED;
      try {
        this.profiles = await this.profileService
          .customSearchProfile(profileSearchReq)
          .toPromise();
        this.dataSource.data = this.profiles.reverse();
        if(this.profiles && this.profiles.length == 0){
          this.toaster.showToastr(
            "Opps!!!",
            "No Verified Profile found.",
            ToastMessageType.ERROR
          );
        }
      } catch (error) {
        this.toaster.showToastr(
          "Opps!!!",
          "Something went wrong. Please try again later.",
          ToastMessageType.ERROR
        );
      }
    }
  }

  addProfile(profile: Profile) {
    this.dialogRef.close({ profile: profile });
  }
}
