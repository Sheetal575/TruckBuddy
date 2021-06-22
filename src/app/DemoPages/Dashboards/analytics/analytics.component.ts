import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { StorageService } from "src/app/core/storage-service/storage.service";
import { BookingRequest } from "src/app/models/booking-request/booking-request.class";
import { BookingSearchReq } from "src/app/models/booking-request/booking-search-req.class";
import { VehicleCategorySearchRequest } from "src/app/models/vehicle-category/vehicle-category-search-req.class";
import { VehicleCategoryService } from "src/app/services/vehicle-category.service";
import { BookingRequestService } from "./../../../services/booking-request.service";
import { StorageServiceTypeEnum } from "src/app/core/storage-service/storage-service-type.enum";
import { VehicleBookingSearchReq } from "../../../models/vehicle-booking/vehicle-booking-search-req.class";
import { Profile } from "../../../models/profile/profile.class";
import { MessagingService } from "../../../firebase-cloud-messaging.service";
import { Area } from "src/app/models/area.class";

@Component({
  selector: "app-analytics",
  templateUrl: "./analytics.component.html",
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  heading = "Truckbuddy Dashboard";
  subheading = "Here you can see all bookings and their status";
  icon = "pe-7s-plane icon-gradient bg-tempting-azure";

  bookingRequests: BookingRequest[] = [];
  awaitedBookingCount: number = 0;
  approvedBookingCount: number = 0;
  declinedBookingCount: number = 0;
  loginProfile: Profile;
  show;
  isInitiated = false;

  constructor(
    private bookingRequestService: BookingRequestService,
    private router: Router,
    private storageService: StorageService,
    private vehicleCategoryService: VehicleCategoryService,
    private messagingService: MessagingService
  ) {
    this.loginProfile = this.storageService.get("profile");
  }

  ngOnDestroy(): void {
    this.isInitiated = false;
  }

  ngOnInit() {
    this.isInitiated = true;
    console.log("intiated");
    this.messagingService.requestPermission();
    this.messagingService.receiveMessage();
    if (
      !this.loginProfile.notificationToken &&
      this.loginProfile.notificationToken === ""
    ) {
      this.show = this.messagingService.currentMessage;
    } else {
      // this.messagingService.receiveMessage();
      this.show = this.messagingService.currentMessage;
    }
    this.getBookings();
    setInterval(() => {
      if (this.loginProfile && this.isInitiated) {
        this.getBookings();
      }
    }, 20000);
    this.getVehicleCategories();
  }

  async getVehicleCategories() {
    let searchReq = new VehicleCategorySearchRequest();
    var vehicleCategories = await this.vehicleCategoryService
      .customSearchVehicleCategory(searchReq)
      .toPromise();
    this.storageService.store(
      StorageServiceTypeEnum.VEHICLE_CATEGORIES,
      vehicleCategories
    );
  }

  async getBookings() {
    let bookingSearchReq = this.createBookingSearchReq();
    var bookings = await this.bookingRequestService
      .customSearchBookingRequest(bookingSearchReq)
      .toPromise();
    this.bookingRequests = bookings;
    this.getCount();
  }

  createBookingSearchReq(): BookingSearchReq {
    var bookingSearchRequest = new BookingSearchReq();
    switch (this.loginProfile.type.toString()) {
      case "SUPER_ADMIN": {
        break;
      }
      case "TRUCKBUDDY_ADMIN":
      case "TRUCKBUDDY_SUPPORT": {
        bookingSearchRequest.source = new Area();
        bookingSearchRequest.source.city = this.loginProfile.address.city;
        break;
      }
      case "TAP_OWNER":
      default: {
        bookingSearchRequest.requestedById = this.loginProfile.id;
        break;
      }
    }
    return bookingSearchRequest;
  }

  async getVehicleBookings() {
    let vehicleBookingSearchRequest = new VehicleBookingSearchReq();
  }
  getCount() {
    this.awaitedBookingCount = 0;
    this.approvedBookingCount = 0;
    this.declinedBookingCount = 0;
    this.bookingRequests.forEach((booking) => {
      switch (booking.requestStatus.toString()) {
        case "AWAITED":
          ++this.awaitedBookingCount;
          break;
        case "ACCEPTED":
          ++this.approvedBookingCount;
          break;
        case "DECLINED":
          ++this.declinedBookingCount;
          break;
      }
    });
  }

  showBookings(statusType: number) {
    this.router.navigate(["/booking/list-booking"], {
      state: { data: { statusType: statusType } },
    });
  }
}
