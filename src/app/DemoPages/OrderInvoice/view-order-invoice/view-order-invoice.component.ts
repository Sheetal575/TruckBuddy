import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import {
  OrderInvoice,
  OrderStateEnum,
  TimeRange,
} from "../../../models/order-invoice/order-invoice.class";
import { OrderInvoiceService } from "../../../services/order-invoice.service";
import { RejectBookingBottomSheetComponent } from "../../bottom-sheet-pages/reject-booking-bottom-sheet/reject-booking-bottom-sheet.component";
import {
  ToastMessage,
  ToastMessageType,
} from "../../../core/utils/toastr-message.helper";
import { MatDialog } from "@angular/material";
import { DetailedAddress } from "../../../models/detailed-address.class";
import { RestService } from "../../../core/rest-service/rest.service";
import { Location } from "@angular/common";
import { ImageViewerComponent } from "../../image-viewer/image-viewer.component";
import {
  PhysicalPod,
  OrderChangeTypeEnum,
  OrderDeliveryLocation,
} from "../../../models/order-invoice/order-invoice.class";
import { AddProfileSheetComponent } from "../../bottom-sheet-pages/add-profile-sheet/add-profile-sheet.component";
import { ProfileTypeEnum } from "../../../models/profile/profile-type.enum";
import { DataRef } from "src/app/core/models/dataRef.class";
import { Profile } from "../../../models/profile/profile.class";
import { AddAddressSheetComponent } from "../../bottom-sheet-pages/add-address-sheet/add-address-sheet.component";

@Component({
  selector: "app-view-order-invoice",
  templateUrl: "./view-order-invoice.component.html",
  styleUrls: ["./view-order-invoice.component.sass"],
})
export class ViewOrderInvoiceComponent implements OnInit {
  orderInvoice: OrderInvoice;
  isLoading: boolean = false;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private ngxService: NgxUiLoaderService,
    private orderInvoiceService: OrderInvoiceService,
    private toaster: ToastMessage,
    public dialog: MatDialog,
    private restService: RestService,
    private _location: Location
  ) {}

  showCancelOrder(){
   if(this.orderInvoice.state.toString() != 'CANCELLED' ||
   this.orderInvoice.state.toString() != 'REJECTED' ||
   this.orderInvoice.state.toString() != 'ORDER_COMPLETED'){
     
   }
  }

  ngOnInit() {
    this.activatedRoute.fragment.subscribe((id) => {
      if (id) {
        this.ngxService.start();
        this.isLoading = true;
        this.getOrderInvoice(id);
      } else {
        this.routeToBookingRequest(id);
      }
    });
  }
  getTextColorCss() {
    if (!this.orderInvoice.state) {
      return "text-muted";
    }
    switch (this.orderInvoice.state.toString()) {
      case "CREATED":
        return "text-primary";
      case "READY_FOR_PICKUP":
      case "READY_FOR_SHIPPING":
      case "SHIPPING_COMPLETE":
        return "text-info";
      case "DELIVERY_DONE":
        return "text-success";
      case "CANCELLED":
      case "REJECTED":
        return "text-danger";
      default:
        return "text-muted";
    }
  }

  async getOrderInvoice(id: string) {
    try {
      this.orderInvoice = await this.orderInvoiceService
        .getOrderInvoice(id)
        .toPromise();
      if (!this.orderInvoice) {
        this.routeToBookingRequest(id);
      } else {
        this.isLoading = false;
        this.ngxService.stop();
      }
    } catch (error) {
      this.toaster.showToastr(
        "Oops!!!",
        "No order invoice found. Check Booing Requests.",
        ToastMessageType.ERROR
      );
      this.routeToBookingRequest(id);
    }
  }

  getImages(imageId: string) {
    if (imageId) {
      return this.restService.getImageUrl() + imageId;
    } else {
      return null;
    }
  }

  openImage(id: string) {
    const dialogRef = this.dialog.open(ImageViewerComponent, {
      data: { image: id },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  trackOrder(orderId: string) {
    return this.restService.getOrderTrackingUrl() + "/t/" + orderId;
  }
  downloadLR(orderId: string, lrID: string) {
    return (
      this.restService.getOrderTrackingUrl() + "/lr/" + orderId + "/" + lrID
    );
  }

  async routeToBookingRequest(id: string) {
    this.ngxService.stop();
    this.router.navigate(["../../booking/view-booking"], { fragment: id });
  }

  async cancelOrder() {
    const dialogRef = this.dialog.open(RejectBookingBottomSheetComponent, {
      data: {
        isRemarkRequired: true,
      },
      width: "250px",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.status) {
        console.log("Order Invoice Cancelled :- " + result.status);
        if (result.status) {
          this.orderInvoice.state = OrderStateEnum.CANCELLED;
          this.orderInvoice.remarks = result.remark;
          this.updateOrderInvoice();
        }
      }
    });
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

  async goBack() {
    // this.router.navigate(["../../orderInvoice/list-order-invoice"], {
    //   fragment: this.orderInvoice.id,
    // });
    this._location.back();
  }

  async updateOrderInvoice() {
    try {
      this.orderInvoice = await this.orderInvoiceService
        .updateOrderInvoice(this.orderInvoice)
        .toPromise();
      this.toaster.showToastr(
        "Success",
        "Order Invoice cancelled successfully.",
        ToastMessageType.SUCCESS
      );
    } catch (err) {
      this.toaster.showToastr(
        "Oops!!!",
        "Something went wrong. Please try later.",
        ToastMessageType.ERROR
      );
    }
  }

  getDate(requestedTime: number): Date {
    return new Date(requestedTime);
  }

  getHaltDuration(timeRange: TimeRange) {
    var difference = timeRange.endTimeInMillis - timeRange.startTimeInMillis;
    let secondsInMiliseconds = 1000,
      minutesInMiliseconds = 60 * secondsInMiliseconds,
      hoursInMiliseconds = 60 * minutesInMiliseconds,
      daysInMiliseconds = 24 * hoursInMiliseconds;

    var differenceInDays = difference / daysInMiliseconds,
      differenceInHours = (differenceInDays % 1) * 24,
      differenceInMinutes = (differenceInHours % 1) * 60,
      differenceInSeconds = (differenceInMinutes % 1) * 60;
    return (
      Math.floor(differenceInDays) +
      " Days, " +
      Math.floor(differenceInHours) +
      " Hours, " +
      Math.floor(differenceInMinutes) +
      " Minutes "
      //  +
      // Math.floor(differenceInSeconds) +
      // " Second"
    );
  }

  getPODChecked(orderDeliveryLocation: OrderDeliveryLocation) {
    if (
      orderDeliveryLocation &&
      orderDeliveryLocation.physicalPod &&
      orderDeliveryLocation.physicalPod.podAvailable
    ) {
      return true;
    } else {
      return false;
    }
  }

  getContactNumber(id: string) {
    if (!id) {
      return "";
    } else {
      return id.substring(id.indexOf("@") + 1);
    }
  }

  podReceived(index: number, isChecked: any) {
    if (isChecked) {
      let physicalPod: PhysicalPod = new PhysicalPod();
      if (!this.orderInvoice.orderDeliveryLocations[index].physicalPod) {
        this.orderInvoice.orderDeliveryLocations[
          index
        ].physicalPod = new PhysicalPod();
      }
      if (
        !this.orderInvoice.orderDeliveryLocations[index].physicalPod
          .podAvailable
      ) {
        physicalPod.podAvailable = true;
        const submittedByDialogRef = this.dialog.open(
          AddProfileSheetComponent,
          {
            data: {
              profileTypes: [],
              title: "Submitted By",
            },
            width: "600px",
          }
        );

        submittedByDialogRef.afterClosed().subscribe((result) => {
          if (result && result.profile) {
            let submittedByProfile: Profile = result.profile as Profile;
            physicalPod.submittedBy = new DataRef();
            physicalPod.submittedBy.id = submittedByProfile.id;
            physicalPod.submittedBy.name = submittedByProfile.fullName;
            const recievedByDialogRef = this.dialog.open(
              AddProfileSheetComponent,
              {
                data: {
                  profileTypes: [],
                  title: "Recieved By",
                },
                width: "600px",
              }
            );

            recievedByDialogRef.afterClosed().subscribe((result) => {
              if (result && result.profile) {
                let receivedByProfile: Profile = result.profile as Profile;
                physicalPod.receivedBy = new DataRef();
                physicalPod.receivedBy.id = receivedByProfile.id;
                physicalPod.receivedBy.name = receivedByProfile.fullName;
                const addressDialogRef = this.dialog.open(
                  AddAddressSheetComponent,
                  {
                    width: "600px",
                  }
                );

                addressDialogRef.afterClosed().subscribe(async (result) => {
                  if (result && result.address) {
                    physicalPod.location = result.address;
                    this.orderInvoice.orderDeliveryLocations[
                      index
                    ].physicalPod = physicalPod;
                    this.orderInvoice.changeType = OrderChangeTypeEnum.DEFAULT;
                    var updateOrderInvoice = await this.updateOrderInvoiceForPODReceived();
                  }
                });
              }
            });
          }
        });
      }
    }
  }

  async updateOrderInvoiceForPODReceived() {
    try {
      this.orderInvoice = await this.orderInvoiceService
        .updateOrderInvoice(this.orderInvoice)
        .toPromise();
      this.toaster.showToastr(
        "Success",
        "POD Recieved successfully.",
        ToastMessageType.SUCCESS
      );
    } catch (err) {
      this.toaster.showToastr(
        "Oops!!!",
        "Something went wrong. Please try later.",
        ToastMessageType.ERROR
      );
    }
  }
}
