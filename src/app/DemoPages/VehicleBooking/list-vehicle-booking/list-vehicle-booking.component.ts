import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import {
  MatDialog,
  MatPaginator,
  MatSort,
  MatTableDataSource
} from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import {
  ApprovedProposal,
  BookingRequestDetail,
  VehicleLoadTypeEnum
} from "src/app/models/vehicle-booking/vehicle-booking.class";
import { DataRef } from "../../../core/models/dataRef.class";
import { StorageServiceTypeEnum } from "../../../core/storage-service/storage-service-type.enum";
import { StorageService } from "../../../core/storage-service/storage.service";
import {
  ToastMessage,
  ToastMessageType
} from "../../../core/utils/toastr-message.helper";
import { BookingRequest } from "../../../models/booking-request/booking-request.class";
import { Profile } from "../../../models/profile/profile.class";
import { VehicleBookingStatusEnum } from "../../../models/vehicle-booking/vehicle-booking-request-status.enum";
import { VehicleBookingSearchReq } from "../../../models/vehicle-booking/vehicle-booking-search-req.class";
import {
  FreightBookingProposal, VehicleBooking
} from "../../../models/vehicle-booking/vehicle-booking.class";
import { BookingRequestService } from "../../../services/booking-request.service";
import { BusinessService } from "../../../services/business.service";
import { VehicleBookingService } from "../../../services/vehicle-booking.service.";
import { RejectBookingBottomSheetComponent } from "../../bottom-sheet-pages/reject-booking-bottom-sheet/reject-booking-bottom-sheet.component";
import { AddVehicleBookingComponent } from "../add-vehicle-booking/add-vehicle-booking.component";

@Component({
  selector: "app-list-vehicle-booking",
  templateUrl: "./list-vehicle-booking.component.html",
  styleUrls: ["./list-vehicle-booking.component.sass"],
})
export class ListVehicleBookingComponent implements OnInit, AfterViewInit {
  bookingReqId: string;
  isLoading = false;
  vehicleBookingList: VehicleBooking[];

  public displayedColumns = ["driverName", "driverNumber", "status", "action"];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public dataSource = new MatTableDataSource<VehicleBooking>();
  bookingRequest: BookingRequest;
  business: Map<string, string> = new Map();
  isTAP: boolean = false;
  loginProfile: Profile;

  constructor(
    private activatedroute: ActivatedRoute,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private vehicleBookingService: VehicleBookingService,
    private toaster: ToastMessage,
    private bookingRequestService: BookingRequestService,
    public dialog: MatDialog,
    private businessService: BusinessService,
    private storageService: StorageService
  ) {
    this.loginProfile = this.storageService.get(StorageServiceTypeEnum.PROFILE);
  }

  refreshing(){
    window.setInterval('refresh()', 10000);
  }
  refresh(){
    window.location.reload();
  }
  async ngOnInit() {
     
    this.isLoading = true;
    this.ngxService.start();
    this.activatedroute.fragment.subscribe(
      async (id) => {
        this.bookingReqId = id;
        if (this.bookingReqId) {
          var bookingReq = await this.getBookingRequest();
          this.getVehicleBookings();
        } else {
          this.isLoading = false;
          this.ngxService.stop();
          this.router.navigate(["../../bookingRequest/view-booking"], {
            fragment: this.bookingReqId,
          });
        }
      },
      (error) => {
        this.isLoading = false;
        this.ngxService.stop();
        this.onError(
          "Something went wrong. Please try later or contact development team."
        );
        this.router.navigate(["../../bookingRequest/view-booking"], {
          fragment: this.bookingReqId,
        });
      }
    );
    if (
      this.vehicleBookingList &&
      this.vehicleBookingList.length > 0 &&
      this.vehicleBookingList[0].freigtBookingProposal &&
      this.vehicleBookingList[0].freigtBookingProposal.requestMoney
    ) {
      // this.displayedColumns.push("requestedAmount");
    }
 
  }
  async getBookingRequest() {
    try {
      this.bookingRequest = await this.bookingRequestService
        .getBookingRequest(this.bookingReqId)
        .toPromise();
      if (Number(this.bookingRequest.vehicleCategoryId.split("_")[1]) > 4) {
        this.isTAP = true;
        this.displayedColumns.splice(3, 0, "requestedAmount");
        this.displayedColumns.splice(4, 0, "approvedAmount");
        this.displayedColumns.splice(5, 0, "approvedBy");
      }
      this.isLoading = false;
      this.ngxService.stop();
    } catch (error) {
      this.isLoading = false;
      this.ngxService.stop();
      this.onError("Something went wrong. Please try later.");
      this.router.navigate(["../../bookingRequest/view-booking"], {
        fragment: this.bookingReqId,
      });
    }

  }

  async handleBooking(vehicleBooking: VehicleBooking, isAccepted: boolean) { 
    if (isAccepted) {
      const dialogRef = this.dialog.open(RejectBookingBottomSheetComponent, {
        data: {
          headerLabel: "Comfirm Approval Amount",
          remarkLabel: "Enter approval amount (e.g. - 12500)",
          isRemarkRequired: true,
        },
        width: "250px",
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result && result.status) {
          vehicleBooking.status = VehicleBookingStatusEnum.ACCEPTED;
          if(!vehicleBooking.freigtBookingProposal){
          vehicleBooking.freigtBookingProposal = new FreightBookingProposal();
          }
          vehicleBooking.freigtBookingProposal.approvedProposal = new ApprovedProposal();
          vehicleBooking.freigtBookingProposal.approvedProposal.money = Number(
            result.remark
          );
          vehicleBooking.freigtBookingProposal.approvedProposal.approvedBy = new DataRef();
          vehicleBooking.freigtBookingProposal.approvedProposal.approvedBy.id = this.loginProfile.id;
          vehicleBooking.freigtBookingProposal.approvedProposal.approvedBy.name = this.loginProfile.fullName;
          this.updateVehicleBooking(vehicleBooking);
        }
      });
      // this.updateVehicleBooking(vehicleBooking);
    } else {
      const dialogRef = this.dialog.open(RejectBookingBottomSheetComponent, {
        data: {
          isRemarkRequired: true,
        },
        width: "250px",
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result && result.status) {
          vehicleBooking.status = VehicleBookingStatusEnum.REJECTED;
          vehicleBooking.reasonOfRejection = result.remark;
          this.updateVehicleBooking(vehicleBooking);
        }
      });
    }
  }

  async updateVehicleBooking(vehicleBooking: VehicleBooking) {
    try {
      var updateVehicleBooking = await this.bookingRequestService
        .acceptVehicleBooking(vehicleBooking)
        .toPromise();
      if (
        updateVehicleBooking.status.toString() == "ACCEPTED" ||
        updateVehicleBooking.status.toString() == "REJECTED"
      ) {
        this.toaster.showToastr(
          "Success",
          "Vehicle Booking request updated successfully.",
          ToastMessageType.SUCCESS
        );
        this.isLoading = true;
        this.ngxService.start();
        this.getVehicleBookings();
      } else if (updateVehicleBooking.status.toString() == "DECLINED") {
        this.toaster.showToastr(
          "Alert!!!",
          "Booking already accepted by someone.",
          ToastMessageType.INFO
        );
        this.getVehicleBookings();
      }
    } catch (error) {
      this.isLoading = true;
      this.ngxService.start();
      this.getVehicleBookings();
      this.toaster.showToastr(
        "Error!!!",
        "Something went wrong. Please try later.",
        ToastMessageType.ERROR
      );
    }
  }

  async addVehicleBookingRequest() {
    const dialogRef = this.dialog.open(AddVehicleBookingComponent, {
      data: {
        bookingRequest: this.bookingRequest,
      },
      width: "50%",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.assigneeRef && (result.assigneeRef as DataRef).id) {
        this.addBookingRequest(result.assigneeRef);
      }
    });
  }

  disableAddVehicleBookingButton() {
    if (
      this.bookingRequest &&
      this.bookingRequest.requestStatus.toString() == "AWAITED"
    ) {
      return false;
    }
    return true;
  }

  async addBookingRequest(assigneeRef: DataRef) {
    var vehicleBooking = new VehicleBooking();
    vehicleBooking.bookingRequest = new BookingRequestDetail();
    vehicleBooking.bookingRequest.bookingReqRef = new DataRef();
    vehicleBooking.bookingRequest.bookingReqRef.id = this.bookingRequest.id;
    vehicleBooking.bookingRequest.destinations = this.bookingRequest.destinations;
    vehicleBooking.bookingRequest.source = this.bookingRequest.source;
    vehicleBooking.bookingRequest.requestedTime = this.bookingRequest.requestedTime;
    vehicleBooking.bookingRequest.vehicleCategoryId = this.bookingRequest.vehicleCategoryId;
    if (Number(this.bookingRequest.vehicleCategoryId.split("_")[1]) > 4) {
      vehicleBooking.createdForVehLoadType = VehicleLoadTypeEnum.HCV;
      vehicleBooking.freigtBookingProposal = new FreightBookingProposal();
      vehicleBooking.freigtBookingProposal.approvedProposal = new ApprovedProposal();
      vehicleBooking.freigtBookingProposal.approvedProposal.money = Number(assigneeRef.extraData);
      vehicleBooking.freigtBookingProposal.approvedProposal.approvedBy = new DataRef();
      vehicleBooking.freigtBookingProposal.approvedProposal.approvedBy.id = this.loginProfile.id;
      vehicleBooking.freigtBookingProposal.approvedProposal.approvedBy.name = this.loginProfile.fullName;

    } else {
      vehicleBooking.createdForVehLoadType = VehicleLoadTypeEnum.LCV;
    }
    vehicleBooking.status = VehicleBookingStatusEnum.ACCEPTED;
    vehicleBooking.assigneeRef = assigneeRef;
    try {
      this.isLoading = true;
      this.ngxService.start();
      try {
        var addVehicleBooking = await this.vehicleBookingService
          .createAndAcceptVehicleBooking(vehicleBooking)
          .toPromise();
        // try {
        //   var updateBookingRequest = await this.updateVehicleBooking(
        //     addVehicleBooking
        //   );
        // } catch (error) {
        //   this.isLoading = false;
        //   this.ngxService.stop();
        //   this.onError(
        //     "Something went wrong while assigning booking. Please try later."
        //   );
        // }
      } catch (err) {
        this.isLoading = false;
        this.ngxService.stop();
        this.onError("Something went wrong. Please try later.");
      }
      this.getVehicleBookings();
      this.isLoading = false;
      this.ngxService.stop();
    } catch (error) {
      this.isLoading = false;
      this.ngxService.stop();
      this.onError("Something went wrong. Please try later.");
      this.router.navigate(["../../bookingRequest/view-booking"], {
        fragment: this.bookingReqId,
      });
    }
  }

  getTextColorCss(status) {
    switch (status) {
      case "ACCEPTED":
        return "text-primary";
      case "AWAIT":
      case "IN_TRANSIT":
        return "text-info";
      case "COMPLETED":
        return "text-success";
      case "DECLINED":
      case "REJECTED":
        return "text-danger";
      default:
        return "text-muted";
    }
  }

  getStatus(status) {
    switch (status) {
      case "ACCEPTED":
        return "ACCEPTED";
      case "AWAIT":
        return "AWAIT";
      case "IN_TRANSIT":
        return "IN TRANSIT";
      case "COMPLETED":
        return "COMPLETED";
      case "DECLINED":
        return "DECLINED";
      case "REJECTED":
        return "REJECTED";
    }
  }

  goBack() {
    this.router.navigate(["../../booking/view-booking"], {
      fragment: this.bookingReqId,
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sortingDataAccessor = (item, property) => {
      // Split '.' to allow accessing property of nested object
      switch (property) {
        case "driverName":
          return item.assigneeRef ? item.assigneeRef.name : "";
        case "driverNumber":
          return item.assigneeRef
            ? this.getMobileNumberById(item.assigneeRef.id)
            : "";
        case "status":
          return item.status ? item.status.toString() : "";
      }
    };
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  async getVehicleBookings() {
    var vehicleBookingSReq = new VehicleBookingSearchReq();
    vehicleBookingSReq.bookingRequest = new BookingRequestDetail();
    vehicleBookingSReq.bookingRequest.bookingReqRef = new DataRef();
    vehicleBookingSReq.bookingRequest.bookingReqRef.id = this.bookingReqId;
    try {
      this.vehicleBookingList = await this.vehicleBookingService
        .customSearchVehicleBooking(vehicleBookingSReq)
        .toPromise();
      var businessMap = await this.getBusinessProfiles(this.vehicleBookingList);
      this.dataSource.data = this.vehicleBookingList.reverse();
      this.isLoading = false;
      this.ngxService.stop();
    } catch (error) {
      this.isLoading = false;
      this.ngxService.stop();
      this.onError("Something went wrong. Please try later.");
      this.router.navigate(["../../bookingRequest/view-booking"], {
        fragment: this.bookingReqId,
      });
    }
  }

  async getBusinessProfiles(vehicleBookingList: VehicleBooking[]) {
    for await (const vehicleBooking of vehicleBookingList) {
      if (!vehicleBooking.assigneeRef.id.includes("TAP_DRIVER")) {
        var business = await this.businessService
          .getBusiness(vehicleBooking.assigneeRef.id)
          .toPromise();
        this.business.set(business.id, business.contact.mobile);
      }
    }
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  };

  getMobileNumberById(id: string) {
    if (!id) {
      return "";
    } else if (id.startsWith("TAP_DRIVER")) {
      return id.substr(id.indexOf("@") + 1);
    } else {
      return this.business.get(id);
    }
  }

  onError(msg: string) {
    this.toaster.showToastr("Opps!!!", msg, ToastMessageType.ERROR);
  }
}
