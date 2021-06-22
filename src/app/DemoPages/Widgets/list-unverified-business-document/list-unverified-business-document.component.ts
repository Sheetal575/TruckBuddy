import { Component, OnInit } from "@angular/core";
import { DocumentPurposeEnum } from "../../../models/document/document-purpose-type.enum";
import { BusinessDesign } from "../../../models/business/business-design.class";
import { ActivatedRoute } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { BusinessService } from "../../../services/business.service";
import { VerificationStateEnum } from "src/app/models/profile/verification-status.enum";
import { RejectBookingBottomSheetComponent } from "../../bottom-sheet-pages/reject-booking-bottom-sheet/reject-booking-bottom-sheet.component";
import { MatDialog } from "@angular/material";
import {
  ToastMessage,
  ToastMessageType,
} from "../../../core/utils/toastr-message.helper";

@Component({
  selector: "app-list-unverified-business-document",
  templateUrl: "./list-unverified-business-document.component.html",
  styleUrls: ["./list-unverified-business-document.component.sass"],
})
export class ListUnverifiedBusinessDocumentComponent implements OnInit {
  heading = "Business Document Verification";
  subheading = "To verify business document(s)";
  icon = "pe-7s-menu icon-gradient bg-sunny-morning";

  purposes: DocumentPurposeEnum[] = [];
  profileRefId: string;
  profileRefName: string;
  isLoading = false;
  business: BusinessDesign;

  constructor(
    private activatedRoute: ActivatedRoute,
    private ngxUiLoaderService: NgxUiLoaderService,
    private businessService: BusinessService,
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
        var profile = await this.getBusiness(this.profileRefId);
      }
    });
  }
  async getBusiness(profileRefId: string) {
    this.purposes = [];
    this.business = await this.businessService
      .getBusiness(this.profileRefId)
      .toPromise();
    this.setPurposes(this.business.businessType.toString());
    this.isLoading = false;
    this.ngxUiLoaderService.stop();
    return this.business;
  }

  async afterDocumentVerified(isDocumentVerified: boolean) {
    if (isDocumentVerified) {
      this.isLoading = true;
      this.ngxUiLoaderService.start();
      var business = await this.getBusiness(this.profileRefId);
      if (business.verificationState == VerificationStateEnum.VERIFIED) {
        this.toastr.showToastr(
          "Verified",
          "Business Verified Successfully",
          ToastMessageType.SUCCESS
        );
      }
    }
  }

  async verifyOrReject(isRejected: boolean) {
    if (!isRejected) {
      this.business.verificationState = VerificationStateEnum.VERIFIED;
      this.updateBusiness(this.business);
    } else {
      const dialogRef = this.dialog.open(RejectBookingBottomSheetComponent, {
        data: {
          isRemarkRequired: false,
          headerLabel: "Do you want to REJECT Vehicle?",
        },
        width: "250px",
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result && result.status) {
          this.business.verificationState = VerificationStateEnum.REJECT;
          this.updateBusiness(this.business);
        }
      });
    }
  }

  async updateBusiness(business: BusinessDesign) {
    this.isLoading = true;
    this.ngxUiLoaderService.start();
    this.business = await this.businessService
      .updateBusinessDesign(business)
      .toPromise();
    if (this.business.verificationState.toString() == "REJECT") {
      this.toastr.showToastr(
        "Info !!!",
        "Business Rejected Successfully",
        ToastMessageType.WARNING
      );
    } else {
      this.toastr.showToastr(
        "Success",
        "Business Verified Successfully",
        ToastMessageType.SUCCESS
      );
    }

    this.isLoading = false;
    this.ngxUiLoaderService.stop();
  }

  getTextColorCss() {
    switch (this.business.verificationState.toString()) {
      case "VERIFIED":
        return "text-success";
      case "PENDING":
        return "text-warning";
      case "REJECTED":
        return "text-danger";
    }
  }

  setPurposes(state: string) {
    switch (state) {
      case "TAP_GENERAL":
      case "TAP_EXCLUSIVE":
        this.purposes.push(DocumentPurposeEnum.TAP_VERIFICATION_AGREEMENT_COPY);
        this.purposes.push(DocumentPurposeEnum.TAP_VERIFICATION_GST);
        break;
      case "CLIENT":
        this.purposes.push(
          DocumentPurposeEnum.CLIENT_VERIFICATION_AGREEMENT_COPY
        );
        this.purposes.push(DocumentPurposeEnum.CLIENT_VERIFICATION_GST);
        break;
    }
  }
}
