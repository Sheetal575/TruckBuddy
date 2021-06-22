import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DocumentPurposeEnum } from "../../../models/document/document-purpose-type.enum";
import { VehicleInfoService } from "../../../services/vehicleInfo.service";
import { VehicleInfo } from "../../../models/vehicle-info/vehicle-info.class";
import { NgxUiLoaderService } from "ngx-ui-loader";
import {
  ToastMessage,
  ToastMessageType,
} from "../../../core/utils/toastr-message.helper";
import { VerificationStateEnum } from "../../../models/profile/verification-status.enum";
import { RejectBookingBottomSheetComponent } from "../../bottom-sheet-pages/reject-booking-bottom-sheet/reject-booking-bottom-sheet.component";
import { MatDialog } from "@angular/material";

@Component({
  selector: "app-list-unverified-document.component",
  templateUrl: "./list-unverified-document.component.html",
  styleUrls: ["./list-unverified-document.component.sass"],
})
export class ListUnverifiedDocumentComponent implements OnInit {
  heading = "Vehicle Document Verification";
  subheading = "To verify vehicle document(s)";
  icon = "pe-7s-menu icon-gradient bg-sunny-morning";

  purposes: DocumentPurposeEnum[] = [];
  profileRefId: string;
  profileRefName: string;
  isLoading = false;
  vehicleInfo: VehicleInfo;

  constructor(
    private activatedRoute: ActivatedRoute,
    private ngxUiLoaderService: NgxUiLoaderService,
    private vehicleInfoService: VehicleInfoService,
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
        var vehicleInfo = await this.getVehicleInfo(this.profileRefId);
      }
    });
  }

  async afterDocumentVerified(isDocumentVerified: boolean) {
    if (isDocumentVerified) {
      this.isLoading = true;
      this.ngxUiLoaderService.start();
      var vehicleInfo = await this.getVehicleInfo(this.profileRefId);
      if (vehicleInfo.state == VerificationStateEnum.VERIFIED) {
        this.toastr.showToastr(
          "Verified",
          "Vehicle Verified Successfully",
          ToastMessageType.SUCCESS
        );
      }
    }
  }

  async verifyOrReject(isRejected: boolean) {
    if (!isRejected) {
      this.vehicleInfo.state = VerificationStateEnum.VERIFIED;
      this.updateVehicleInfo(this.vehicleInfo);
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
          this.vehicleInfo.state = VerificationStateEnum.REJECT;
          this.updateVehicleInfo(this.vehicleInfo);
        }
      });
    }
  }

  async updateVehicleInfo(vehicleInfo: VehicleInfo) {
    this.isLoading = true;
    this.ngxUiLoaderService.start();
    this.vehicleInfo = await this.vehicleInfoService
      .updateVehicle(vehicleInfo)
      .toPromise();
    if (this.vehicleInfo.state.toString() == "REJECT") {
      this.toastr.showToastr(
        "Info !!!",
        "Vehicle Rejected Successfully",
        ToastMessageType.WARNING
      );
    } else {
      this.toastr.showToastr(
        "Success",
        "Vehicle Verified Successfully",
        ToastMessageType.SUCCESS
      );
    }

    this.isLoading = false;
    this.ngxUiLoaderService.stop();
  }

  async getVehicleInfo(profileRefId: string) {
    this.vehicleInfo = await this.vehicleInfoService
      .getVehicle(this.profileRefId)
      .toPromise();
    this.isLoading = false;
    this.ngxUiLoaderService.stop();
    return this.vehicleInfo;
  }

  getTextColorCss() {
    switch (this.vehicleInfo.status.toString()) {
      case "VERIFIED":
        return "text-success";
      case "PENDING":
        return "text-warning";
      case "REJECTED":
        return "text-danger";
    }
  }

  setPurposes() {
    this.purposes.push(
      DocumentPurposeEnum.VEHICLE_VERIFICATION_REGISTRATION_CERTIFICATE
    );
    this.purposes.push(
      DocumentPurposeEnum.VEHICLE_VERIFICATION_INSURANCE_CERTIFICATE
    );
    this.purposes.push(DocumentPurposeEnum.VEHICLE_VERIFICATION_PERMIT);
    this.purposes.push(
      DocumentPurposeEnum.VEHICLE_VERIFICATION_POLLUTION_CERTIFICATE
    );
  }
}
