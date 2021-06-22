import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import {
  MatDialog,
  MatPaginator,
  MatSort,
  MatTableDataSource,
} from "@angular/material";
import { Router } from "@angular/router";
import { StorageServiceTypeEnum } from "src/app/core/storage-service/storage-service-type.enum";
import { StorageService } from "src/app/core/storage-service/storage.service";
import { BookingRequestStatusEnum } from "src/app/models/booking-request/booking-request-status.enum";
import { BookingRequest } from "src/app/models/booking-request/booking-request.class";
import { BookingSearchReq } from "src/app/models/booking-request/booking-search-req.class";
import { BookingRequestService } from "src/app/services/booking-request.service";
import { OptionConfig } from "../../../core/models/option-config.class";
import { TimeRange } from "../../../core/models/time-range.class";
import {
  CityStateProvider,
  LocaleTypeEnum,
} from "../../../core/utils/city-state.helper";
import { DateTimeProvider } from "../../../core/utils/date-time.provider";
import { Area } from "../../../models/area.class";
import { DetailedAddress } from "../../../models/detailed-address.class";
import { Profile } from "../../../models/profile/profile.class";
import { VehicleCategory } from "./../../../models/vehicle-category/vehicle-category.class";
import { VehicleCategoryService } from "./../../../services/vehicle-category.service";
import { RejectBookingBottomSheetComponent } from "../../bottom-sheet-pages/reject-booking-bottom-sheet/reject-booking-bottom-sheet.component";
import {
  ToastMessageType,
  ToastMessage,
} from "../../../core/utils/toastr-message.helper";

@Component({
  selector: "app-list-booking",
  templateUrl: "./list-booking.component.html",
  styleUrls: ["./list-booking.component.sass"],
})
export class ListBookingComponent implements OnInit, AfterViewInit {
  statusType: number;
  bookingRequests: BookingRequest[] = [];
  vehicleCategories: VehicleCategory[] = [];
  loggedInProfile: Profile;
  cities: Map<string, string> = new Map();
  sourceCityFilter: string;
  destinationCityFilter: string;

  public displayedColumns = [
    "createdBy",
    "clientName",
    "source",
    "destination",
    "vehicle",
    "bookingDateTime",
    "PropsalMoney",
    "action",
  ];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public dataSource = new MatTableDataSource<BookingRequest>();

  startDate: number;
  endDate: number;
  visible: boolean = false;

  constructor(
    private router: Router,
    private bookingRequestService: BookingRequestService,
    private vehicleCategoryService: VehicleCategoryService,
    private storageService: StorageService,
    public dialog: MatDialog,
    private cityStateProvider: CityStateProvider,
    private _dateTimeProvider: DateTimeProvider,
    private toaster: ToastMessage
  ) {
    this.loggedInProfile = this.storageService.get(
      StorageServiceTypeEnum.PROFILE
    );
    if (this.router.getCurrentNavigation().extras.state) {
      this.statusType = this.router.getCurrentNavigation().extras.state.data.statusType;
      if (this.statusType == 0) {
        this.displayedColumns.push("delete");
      }else if (this.statusType == 1){
        this.visible = true
      }
    } else {
      this.router.navigate(["../"]);
    }
    this.fetchCities();
  }

  async fetchCities() {
    var cityResponse = await this.cityStateProvider
      .fetchCity("uttar_pradesh@in", LocaleTypeEnum.ENGLISH)
      .then((optionConfigs: OptionConfig[]) => {
        this.cities = this.cityStateProvider.fetchDataBasedOnLocale(
          optionConfigs,
          LocaleTypeEnum.ENGLISH
        );
      });
  }

  async deleteBooking(bookingReq: BookingRequest) {
    const dialogRef = this.dialog.open(RejectBookingBottomSheetComponent, {
      data: {
        isRemarkRequired: false,
        headerLabel: "Do you want to delete?",
      },
      width: "250px",
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result && result.status) {
        this.deleteBookingRequest(bookingReq.id);
      }
    });
  }
  async deleteBookingRequest(id: string) {
    var deleteBooking = await this.bookingRequestService
      .deleteBookingRequest(id)
      .toPromise();
    this.toaster.showToastr(
      "Success",
      "Booking deleted successfully",
      ToastMessageType.SUCCESS
    );
    this.creteBookingRequest();
  }

  changeCityFilter(event, isSource: boolean) {
    if (event.isUserInput) {
      if (event.source.selected) {
        if (isSource) {
          this.sourceCityFilter = event.source.value;
        } else {
          this.destinationCityFilter = event.source.value;
        }
      }
      var bookingSearchRequest = this.createBookingSearchReq();
      this.getBookings(bookingSearchRequest);
    }
  }

  choosedDate(data) {
    if (data && data.startDate && data.endDate) {
    } else {
      return;
    }
    this.startDate = data.startDate.valueOf();
    this.endDate = data.endDate.valueOf();
    console.log(this.startDate);
    console.log(this.endDate);
    var bookingSearchRequest = this.createBookingSearchReq();
    this.getBookings(bookingSearchRequest);
  }

  OnScroll() {
    document.getElementById("app-header").style.display = "none";
  }

  onBack() {}

  getBookingDateTime(requestedTime: number): Date {
    return new Date(requestedTime);
  }

  async ngOnInit() {
    this.vehicleCategories = this.storageService.get(
      StorageServiceTypeEnum.VEHICLE_CATEGORIES
    );
    this.creteBookingRequest();
  }

  creteBookingRequest() {
    var bookingSearchRequest = this.createBookingSearchReq();
    this.getBookings(bookingSearchRequest);
  }

  async getBookings(bookingSearchRequest) {
    bookingSearchRequest.requestStatus = this.getStatusEnum();
    this.bookingRequests = await this.bookingRequestService
      .customSearchBookingRequest(bookingSearchRequest)
      .toPromise();
    this.dataSource.data = this.bookingRequests.reverse();
  }

  createBookingSearchReq(): BookingSearchReq {
    var bookingSearchRequest = new BookingSearchReq();
    switch (this.loggedInProfile.type.toString()) {
      case "SUPER_ADMIN": {
        if (this.sourceCityFilter) {
          bookingSearchRequest.source = new Area();
          bookingSearchRequest.source.city = this.sourceCityFilter;
        }
        if (this.destinationCityFilter) {
          bookingSearchRequest.destination = new Area();
          bookingSearchRequest.destination.city = this.destinationCityFilter;
        }
        if (this.startDate && this.endDate) {
          bookingSearchRequest.requestedTime = new TimeRange();
          bookingSearchRequest.requestedTime.startTimeInMillis = this.startDate;
          bookingSearchRequest.requestedTime.endTimeInMillis = this.endDate;
        }
        break;
      }
      case "TRUCKBUDDY_ADMIN":
      case "TRUCKBUDDY_SUPPORT": {
        bookingSearchRequest.source = new Area();
        bookingSearchRequest.source.city = this.loggedInProfile.address.city;
        break;
      }
      case "TAP_OWNER":
      default: {
        bookingSearchRequest.requestedById = this.loggedInProfile.id;
        break;
      }
    }
    return bookingSearchRequest;
  }

  ngAfterViewInit(): void {
    this.dataSource.filterPredicate = (data: any, filter) => {
      const dataStr = JSON.stringify(data).toLowerCase();
      return dataStr.indexOf(filter) != -1;
    };
    this.dataSource.sortingDataAccessor = (item, property) => {
      // Split '.' to allow accessing property of nested object
      switch (property) {
        case "createdBy":
          return item.requestedByRef.name;
        case "clientName":
          return item.clientRef.name;
        case "source":
          return this.getAddress(item.source);
        case "destination":
          return this.getDestinationAddress(item.destinations);
        case "bookingDateTime":
          return item.requestedTime;
        case "PropsalMoney":
          return item.proposalMoney;
        case "ApprovedMoney":
          return item.approvedMoney;
        case "vehicle":
          return item.vehicleCategoryId;
      }
    };
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getProperty = (obj, path) => path.split(".").reduce((o, p) => o && o[p], obj);

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  };

  getStatusEnum(): BookingRequestStatusEnum {
    switch (this.statusType) {
      case 0:
        return BookingRequestStatusEnum.AWAITED;
      case 1:
        return BookingRequestStatusEnum.ACCEPTED;
      case 2:
        return BookingRequestStatusEnum.DECLINED;
    }
  }

  getDestinationAddress(destinations: DetailedAddress[]): string {
    let address = "";
    destinations.forEach((destination) => {
      address += this.getAddress(destination) + " / ";
    });
    return address.substr(0, address.length - 3);
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

  getAddress(source: DetailedAddress): string {
    let address = "";
    if (source.localArea) {
      address += source.localArea;
    }
    if (source.city) {
      if (!address) {
        address += source.city;
      } else {
        address += ", " + source.city;
      }
    }
    if (source.state) {
      if (!address) {
        address += source.state;
      } else {
        address += ", " + source.state;
      }
    }
    return address;
  }

  show
}
