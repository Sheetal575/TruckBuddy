import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { StorageServiceTypeEnum } from "src/app/core/storage-service/storage-service-type.enum";
import { StorageService } from "src/app/core/storage-service/storage.service";
import { BookingRequestStatusEnum } from "src/app/models/booking-request/booking-request-status.enum";
import { BookingRequest } from "src/app/models/booking-request/booking-request.class";
import { Profile } from "src/app/models/profile/profile.class";
import { VehicleCategorySearchRequest } from "src/app/models/vehicle-category/vehicle-category-search-req.class";
import { VehicleCategory } from "src/app/models/vehicle-category/vehicle-category.class";
import { BookingRequestService } from "src/app/services/booking-request.service";
import { VehicleCategoryService } from "src/app/services/vehicle-category.service";
import {
  ToastMessage,
  ToastMessageType
} from "../../../core/utils/toastr-message.helper";
import { DetailedAddress } from "../../../models/detailed-address.class";
import { VehicleBookingService } from "../../../services/vehicle-booking.service.";
import { RejectBookingBottomSheetComponent } from "../../bottom-sheet-pages/reject-booking-bottom-sheet/reject-booking-bottom-sheet.component";
import { EmailValidator, Form, NgForm } from '@angular/forms';
@Component({
  selector: "app-view-booking",
  templateUrl: "./view-booking.component.html",
  styleUrls: ["./view-booking.component.sass"],
})
export class ViewBookingComponent implements OnInit {
  bookingReq: BookingRequest;
  isLoading: boolean = false;
  vehicleCategories: VehicleCategory[] = [];
  profile: Profile;
 
  // approvedMoney:number;

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private bookingReqService: BookingRequestService,
    private ngxService: NgxUiLoaderService,
    private vehicleCategoryService: VehicleCategoryService,
    private vehicleBookingService: VehicleBookingService,
    private storageService: StorageService,
    private toaster: ToastMessage,
    public dialog: MatDialog
  ) {}
  async ngOnInit() {
    this.isLoading = true;
    this.profile = this.storageService.get("profile");
    this.vehicleCategories = await this.getVehicleCategories();
    this.activeRoute.fragment.subscribe((id) => {
      if (id) {
        this.ngxService.start();
        this.getBookingRequest(id);
      } else {
        this.routeToDashboard();
      }
    });
  }

  onBack(status: BookingRequestStatusEnum) {
    let statusType;
    switch (this.bookingReq.requestStatus.toString()) {
      case "AWAITED":
        statusType = 0;
        break;
      case "ACCEPTED":
        statusType = 1;
        break;
      case "DECLINED":
        statusType = 2;
        break;
    }
    this.router.navigate(["/booking/list-booking"], {
      state: { data: { statusType: statusType } },
    });
  }

  getContactNumber(id: string) {
    return id.substring(id.indexOf("@") + 1);
  }

  getTextColorCss() {
    switch (this.bookingReq.requestStatus.toString()) {
      case "ACCEPTED":
        return "text-success";
      case "AWAITED":
        return "text-warning";
      case "DECLINED":
        return "text-danger";
    }
  }

  async cancelBooking(bookingReq: BookingRequest) {
    const dialogRef = this.dialog.open(RejectBookingBottomSheetComponent, {
      data: {
        isRemarkRequired: false,
      },
      width: "250px",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.status) {
        console.log("Booking Accepted :- " + result.status);
        this.updateBookingRequest(bookingReq);
      }
    });
  }

  async updateBookingRequest(bookingReq: BookingRequest) {
    try {
      this.isLoading = true;
      this.ngxService.start();
      bookingReq.requestStatus = BookingRequestStatusEnum.DECLINED;
      this.bookingReq = await this.bookingReqService
        .cancelBookingRequest(bookingReq)
        .toPromise();
      this.toaster.showToastr(
        "Success",
        "Booking declined successfully",
        ToastMessageType.SUCCESS
      );
      this.isLoading = false;
      this.ngxService.stop();
    } catch (error) {
      this.showErrorMessage("Something went wrong. Please try later.");
      this.isLoading = false;
      this.ngxService.stop();
    }
  }

  showErrorMessage(msg: string) {
    this.toaster.showToastr("Oops!!!", msg, ToastMessageType.ERROR);
  }

  async getVehicleCategories() {
    let vehicleCategories = this.storageService.get(
      StorageServiceTypeEnum.VEHICLE_CATEGORIES
    ) as VehicleCategory[];
    if (vehicleCategories.length > 0) {
      return vehicleCategories;
    } else {
      var vehicleCategorySearchReq = new VehicleCategorySearchRequest();
      try {
        vehicleCategories = await this.vehicleCategoryService
          .customSearchVehicleCategory(vehicleCategorySearchReq)
          .toPromise();
        return vehicleCategories;
      } catch (error) {
        return null;
      }
    }
  }

  async getBookingRequest(id: string) {
    try {
      this.bookingReq = await this.bookingReqService
        .getBookingRequest(id)
        .toPromise();
    } catch (error) {
      this.routeToDashboard();
    } finally {
      this.isLoading = false;
      this.ngxService.stop();
    }
  }

  async routeToDashboard() {
    this.router.navigate([""], { relativeTo: this.activeRoute });
  }

  getBookingDateTime(dataTime: number): Date {
    return new Date(dataTime);
  }

  getAddress(addressData: DetailedAddress): string {
    let address = "";
    if (addressData.localArea) {
      address += addressData.localArea;
    }
    if (addressData.city) {
      if (!address) {
        address += addressData.city;
      } else {
        address += ", " + addressData.city;
      }
    }
    if (addressData.state) {
      if (!address) {
        address += addressData.state;
      } else {
        address += ", " + addressData.state;
      }
    }
    return address;
  }

  getVehicleName(id: string) {
    let vehicle = undefined;
    for (let vehicleCategory of this.vehicleCategories) {
      if (vehicleCategory.id == id) {
        vehicle = vehicleCategory;
        break;
      }
    }
    let vehicleName = "";
    if (vehicle) {
      vehicle.referenceTexts.forEach((referenceText) => {
        vehicleName += referenceText + " / ";
      });
      return vehicleName.substr(0, vehicleName.length - 3);
    } else {
      return vehicleName;
    }
  }


  
}
