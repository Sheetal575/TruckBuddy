import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import {
  ToastMessage,
  ToastMessageType,
} from "../../../core/utils/toastr-message.helper";
import { DocumentPurposeEnum } from "../../../models/document/document-purpose-type.enum";
import { Profile } from "../../../models/profile/profile.class";
import { VerificationStateEnum } from "../../../models/profile/verification-status.enum";
import { ProfileService } from "../../../services/profile.service";
import { RejectBookingBottomSheetComponent } from "../../bottom-sheet-pages/reject-booking-bottom-sheet/reject-booking-bottom-sheet.component";
import { MatDialog } from '@angular/material';

@Component({
  selector: "app-list-unverified-profile-document",
  templateUrl: "./list-unverified-profile-document.component.html",
  styleUrls: ["./list-unverified-profile-document.component.sass"],
})
export class ListUnverifiedProfileDocumentComponent implements OnInit {
  heading = "Profile Document Verification";
  subheading = "To verify profile document(s)";
  icon = "pe-7s-menu icon-gradient bg-sunny-morning";

  purposes: DocumentPurposeEnum[] = [];
  profileRefId: string;
  profileRefName: string;
  isLoading = false;
  profile: Profile;

  constructor(
    private activatedRoute: ActivatedRoute,
    private ngxUiLoaderService: NgxUiLoaderService,
    private profileService: ProfileService,
    private toastr: ToastMessage,
    public dialog: MatDialog
  ) {}

  async ngOnInit() {
    this.isLoading = true;
    this.ngxUiLoaderService.start();
    this.activatedRoute.fragment.subscribe(async (id) => {
      if (id) {
        this.profileRefId = id.substring(0, id.lastIndexOf("@"));
        this.profileRefName = id.substring(id.lastIndexOf("@") + 1);
        this.setPurposes();
        var profile = await this.getProfile(this.profileRefId);
      }
    });
  }
  async getProfile(profileRefId: string) {
    this.profile = await this.profileService
      .getProfile(this.profileRefId)
      .toPromise();
    this.isLoading = false;
    this.ngxUiLoaderService.stop();
    return this.profile;
  }

  async verifyOrReject(isRejected: boolean) {
    if (!isRejected) {
      this.profile.state = VerificationStateEnum.VERIFIED;
      this.updateProfile(this.profile);
    } else {
      const dialogRef = this.dialog.open(RejectBookingBottomSheetComponent, {
        data: {
          isRemarkRequired: false,
          headerLabel: "Do you want to REJECT Profile?",
        },
        width: "250px",
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result && result.status) {
          this.profile.state = VerificationStateEnum.REJECT;
          this.updateProfile(this.profile);
        }
      });
    }
  }

  async updateProfile(profile: Profile) {
    this.isLoading = true;
    this.ngxUiLoaderService.start();
    this.profile = await this.profileService.updateProfile(profile).toPromise();
    if (this.profile.state.toString() == "REJECT") {
      this.toastr.showToastr(
        "Info !!!",
        "Profile Rejected Successfully",
        ToastMessageType.WARNING
      );
    } else {
      this.toastr.showToastr(
        "Success",
        "Profile Verified Successfully",
        ToastMessageType.SUCCESS
      );
    }
    this.isLoading = false;
    this.ngxUiLoaderService.stop();
  }

  async afterDocumentVerified(isDocumentVerified: boolean) {
    if (isDocumentVerified) {
      this.isLoading = true;
      this.ngxUiLoaderService.start();
      var profile = await this.getProfile(this.profileRefId);
      if (profile.state == VerificationStateEnum.VERIFIED) {
        this.toastr.showToastr(
          "Verified",
          "Profile Verified Successfully",
          ToastMessageType.SUCCESS
        );
      }
    }
  }

  getTextColorCss() {
    switch (this.profile.state.toString()) {
      case "VERIFIED":
        return "text-success";
      case "PENDING":
        return "text-warning";
      case "REJECTED":
        return "text-danger";
    }
  }

  setPurposes() {
    switch (this.profileRefId.substring(0, this.profileRefId.indexOf("@"))) {
      case "CLIENT_MANAGER":
      case "SUPER_ADMIN":
      case "TAP_OWNER":
      case "TRUCKBUDDY_ADMIN":
      case "TRUCKBUDDY_SUPPORT":
        this.purposes.push(DocumentPurposeEnum.TRUCKBUDDY_VERIFICATION_ADHAAR);
        this.purposes.push(DocumentPurposeEnum.TRUCKBUDDY_VERIFICATION_PAN);
        break;
      case "CLIENT_WAREHOUSE_KEEPER":
      case "TAP_HELPER":
        this.purposes.push(DocumentPurposeEnum.TRUCKBUDDY_VERIFICATION_ADHAAR);
        break;
      case "TAP_DRIVER":
        this.purposes.push(DocumentPurposeEnum.DRIVER_VERIFICATION_ADHAAR_CARD);
        this.purposes.push(
          DocumentPurposeEnum.DRIVER_VERIFICATION_DRIVING_LICENSE
        );
        break;
    }
  }
}
