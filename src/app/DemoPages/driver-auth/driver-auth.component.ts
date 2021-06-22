import { Component, OnInit } from "@angular/core";
import { DateTimeProvider } from "../../core/utils/date-time.provider";
import { DriverAuthReq } from "../../models/driver-auth/driver-auth.req";
import { DriverAuthService } from "../../services/driver-auth.sevice";
import { TimeRange } from "../../models/order-invoice/order-invoice.class";
import {
  ToastMessage,
  ToastMessageType,
} from "../../core/utils/toastr-message.helper";

@Component({
  selector: "app-driver-auth",
  templateUrl: "./driver-auth.component.html",
  styleUrls: ["./driver-auth.component.sass"],
})
export class DriverAuthComponent implements OnInit {
  driverMobile: string = "";
  fromDate: string = "";
  toDate: string = "";
  driverAuthList = [];

  constructor(
    private driverAuthService: DriverAuthService,
    private dateTimeProvider: DateTimeProvider,
    private toaster: ToastMessage
  ) {}

  async ngOnInit() {}

  async onSearch() {
    if (!this.driverMobile) {
      this.onError("Enter Driver Number");
      return;
    } else if (!this.fromDate) {
      this.onError("Enter Start Date");
      return;
    } else if (!this.toDate) {
      this.onError("Enter End Number");
      return;
    } else {
      let driverAuthReq = new DriverAuthReq();
      driverAuthReq.createdAtRange = new TimeRange();
      driverAuthReq.createdAtRange.startTimeInMillis = this.dateTimeProvider.getMillis(
        this.fromDate
      );
      driverAuthReq.createdAtRange.endTimeInMillis = this.dateTimeProvider.getMillis(
        this.toDate
      );
      driverAuthReq.driverId = "TAP_DRIVER@" + this.driverMobile;
      this.driverAuthList = await this.driverAuthService
        .search(driverAuthReq)
        .toPromise();
    }
  }

  onError(msg: string) {
    this.toaster.showToastr("Oops!!!", msg, ToastMessageType.ERROR);
    return;
  }
}
