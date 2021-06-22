import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { VehicleDetail } from "../../../../app/models/vehicle-info/vehicle-detail.class";
import { BusinessTypeEnum } from "../../../../app/models/enums/business-type.enum";
import { StorageServiceTypeEnum } from "../../../core/storage-service/storage-service-type.enum";
import { StorageService } from "../../../core/storage-service/storage.service";
import {
  ToastMessage,
  ToastMessageType,
} from "../../../core/utils/toastr-message.helper";
import { BookingRequest } from "../../../models/booking-request/booking-request.class";
import { BusinessDesignSRequest } from "../../../models/business/business-search-req.class";
import { Profile } from "../../../models/profile/profile.class";
import { VehicleCategory } from "../../../models/vehicle-category/vehicle-category.class";
import { VehicleInfo } from "../../../models/vehicle-info/vehicle-info.class";
import { VehicleSearchReq } from "../../../models/vehicle-info/vehicle-search-req.class";
import { ProfileService } from "../../../services/profile.service";
import { VehicleInfoService } from "../../../services/vehicleInfo.service";
import { BusinessOwnership } from "../../../models/business/business-ownership.class";
import { DataRef } from "../../../core/models/dataRef.class";
import { BusinessService } from "../../../services/business.service";
import { BusinessDesign } from "../../../models/business/business-design.class";
import { VerificationStateEnum } from "../../../models/profile/verification-status.enum";

@Component({
  selector: "app-add-vehicle-booking",
  templateUrl: "./add-vehicle-booking.component.html",
  styleUrls: ["./add-vehicle-booking.component.sass"],
})
export class AddVehicleBookingComponent implements OnInit {
  searchText = "";
  approvalAmount = "";
  isSearchByVehicleNumber = false;
  bookingRequest: BookingRequest;
  vehicleInfo: VehicleInfo;
  vehicleCategories: VehicleCategory[];
  isLCV: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<AddVehicleBookingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private vehicleInfoService: VehicleInfoService,
    private profileService: ProfileService,
    private businessService: BusinessService,
    private toaster: ToastMessage,
    private sessionStorage: StorageService
  ) {}

  ngOnInit() {
    this.bookingRequest = this.data.bookingRequest;
    this.vehicleCategories = this.sessionStorage.get(
      StorageServiceTypeEnum.VEHICLE_CATEGORIES
    );
    this.checkForLCV(this.bookingRequest.vehicleCategoryId);
  }

  searchByVehicleInfo(value: boolean) {
    this.isSearchByVehicleNumber = value;
    this.searchText = "";
  }

  async assignVehicleBooking() {
    var vehicleInfoSearchReq = new VehicleSearchReq();
    if (!this.searchText) {
      let msg = "";
      if (this.isSearchByVehicleNumber) {
        msg = "Enter Vehicle Number";
      } else {
        msg = "Enter Assignee Mobile Number";
      }
      this.toaster.showToastr("Oppss!!", msg, ToastMessageType.ERROR);
    } else {
      vehicleInfoSearchReq.vehCategoryId = this.bookingRequest.vehicleCategoryId;
      // vehicleInfoSearchReq.state = VerificationStateEnum.VERIFIED;
      if (this.isSearchByVehicleNumber) {
        vehicleInfoSearchReq.vehicleDetail = new VehicleDetail();
        vehicleInfoSearchReq.vehicleDetail.regNumber = this.searchText
          .toLowerCase()
          .replace(" ", "");
      } else {
        if (this.isLCV) {
          vehicleInfoSearchReq.driverId =
            "TAP_DRIVER@" + this.searchText.toLowerCase();
        } else {
          var tapProfile: Profile;
          try {
            tapProfile = (await this.profileService
              .getProfile("TAP_OWNER@" + this.searchText.toLowerCase())
              .toPromise()) as Profile;
            // if (tapProfile.state.toString() == "VERIFIED") {
            //   //continue
            // } else {
            //   this.toaster.showToastr(
            //     "Oppss!!",
            //     "TAP Profile is not verified with Mobile number :-" +
            //       this.searchText.toUpperCase(),
            //     ToastMessageType.ERROR
            //   );
            //   return;
            // }
          } catch (err) {
            this.toaster.showToastr(
              "Oppss!!",
              "No TAP found with Mobile number :- " +
                this.searchText.toUpperCase(),
              ToastMessageType.ERROR
            );
            return;
          }
          var businessSearchReq = new BusinessDesignSRequest();
          businessSearchReq.businessType = BusinessTypeEnum.TAP_GENERAL;
          businessSearchReq.businessOwnership = new BusinessOwnership();
          businessSearchReq.businessOwnership.profileRef = new DataRef();
          businessSearchReq.businessOwnership.profileRef.id = tapProfile.id;
          businessSearchReq.businessOwnership.profileRef.name =
            tapProfile.fullName;
          let business: BusinessDesign;
          var businessList = ((await this.businessService
            .customSearchBusiness(businessSearchReq)
            .toPromise()) as BusinessDesign[]).reverse();
          if (businessList.length > 0) {
            business = businessList[0];
            vehicleInfoSearchReq.tapId = business.id;
          } else {
            this.toaster.showToastr(
              "Oppss!!",
              "No TAP Business found with Mobile number :- " +
                this.searchText.toUpperCase(),
              ToastMessageType.ERROR
            );
            return;
          }
        }
      }

      try {
        var vehicleInfoList = await this.vehicleInfoService
          .customSearchVehicle(vehicleInfoSearchReq)
          .toPromise();
        if (vehicleInfoList.length > 0) {
          var assigneeRef: DataRef = new DataRef();
          if (this.isLCV) {
            assigneeRef = vehicleInfoList[0].driverRef;
          } else {
            assigneeRef.id = vehicleInfoList[0].tapInfo.id;
            assigneeRef.name = vehicleInfoList[0].tapInfo.name;
            if(this.bookingRequest.proposalMoney >= Number(this.approvalAmount)){
              assigneeRef.extraData = this.approvalAmount;
            }else{
              this.toaster.showToastr(
                "Error",
                "Amount is greater than proposal amount.",
                ToastMessageType.ERROR
              );
              return;
            }
          }
          this.toaster.showToastr(
            "Success",
            "Request created successfully.",
            ToastMessageType.SUCCESS
          );
          this.dialogRef.close({ assigneeRef: assigneeRef });
        } else {
          if (this.isSearchByVehicleNumber) {
            this.toaster.showToastr(
              "Oppss!!",
              "No Vehicle Info found with registraion number :- " +
                this.searchText.toUpperCase() +
                "with required vehicle type.",
              ToastMessageType.ERROR
            );
          } else {
            if (this.isLCV) {
              this.toaster.showToastr(
                "Oppss!!",
                "Driver with number " +
                  this.searchText +
                  " is not associated with any vehicle",
                ToastMessageType.ERROR
              );
            } else {
              this.toaster.showToastr(
                "Oppss!!",
                "Required Vehicle not found at TAP with number " +
                  this.searchText,
                ToastMessageType.ERROR
              );
            }
          }
        }
      } catch (error) {
        this.toaster.showToastr(
          "Oppss!!!",
          "Something went wrong. Please try later.",
          ToastMessageType.ERROR
        );
      }
    }
  }

  checkForLCV(id: string) {
    this.vehicleCategories.forEach((vehicleCategory) => {
      if (vehicleCategory.id == id && vehicleCategory.wheel <= 4)
        this.isLCV = true;
    });
    return this.isLCV;
  }
}
