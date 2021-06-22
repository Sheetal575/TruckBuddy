import { StorageService } from "../storage-service/storage.service";
import { Profile } from "../../models/profile/profile.class";
import { Injectable } from "@angular/core";
import { BusinessDesign } from "../../models/business/business-design.class";
import { StorageServiceTypeEnum } from "../storage-service/storage-service-type.enum";

@Injectable({
  providedIn: "root",
})
export class AccessManageService {
  profile: Profile;
  businessProfile: BusinessDesign;
  isBookingServiceEnabled: boolean;
  isWarRoomServiceEnabled: boolean;
  isClientServiceEnabled: boolean;
  isTapServiceEnabled: boolean;
  isVehicleServiceEnabled: boolean;
  isProfileServiceEnabled: boolean;
  isListProfileServiceEnabled: boolean;
  isOrderInvoiceServiceEnabled: boolean;
  isVerificationServiceEnabled: boolean;
  isDriverLogServiceEnabled: boolean;
  isReportServiceEnabled: boolean;

  constructor(private storageService: StorageService) {
    this.profile = this.storageService.get(StorageServiceTypeEnum.PROFILE);
    this.businessProfile = this.storageService.get(
      StorageServiceTypeEnum.BUSINESS_PROFILE
    );
    this.enableServices();
  }

  private enableServices() {
    switch (this.profile.type.toString()) {
      case "SUPER_ADMIN":
      case "TRUCKBUDDY_SUPPORT":
      case "TRUCKBUDDY_ADMIN": {
        this.isBookingServiceEnabled = true;
        this.isWarRoomServiceEnabled = true;
        this.isClientServiceEnabled = true;
        this.isTapServiceEnabled = true;
        this.isVehicleServiceEnabled = false;
        this.isProfileServiceEnabled = true;
        this.isListProfileServiceEnabled = true;
        this.isOrderInvoiceServiceEnabled = true;
        this.isVerificationServiceEnabled = true;
        this.isDriverLogServiceEnabled = true;
        this.isReportServiceEnabled = true;
        break;
      }
      case "TAP_OWNER": {
        this.isBookingServiceEnabled = true;
        this.isWarRoomServiceEnabled = true;
        this.isClientServiceEnabled = false;
        this.isTapServiceEnabled = false;
        this.isVehicleServiceEnabled = true;
        this.isProfileServiceEnabled = true;
        this.isListProfileServiceEnabled = false;
        this.isOrderInvoiceServiceEnabled = false;
        this.isVerificationServiceEnabled = false;
        this.isDriverLogServiceEnabled = true;
        this.isReportServiceEnabled = false;
        break;
      }
    }
  }
}
