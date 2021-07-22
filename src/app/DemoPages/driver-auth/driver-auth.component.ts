import { Component, OnInit } from "@angular/core";
import { DateTimeFormatEnum, DateTimeProvider } from "../../core/utils/date-time.provider";
import { DriverAuthReq } from "../../models/driver-auth/driver-auth.req";
import { DriverAuthService } from "../../services/driver-auth.sevice";
import { TimeRange } from "../../models/order-invoice/order-invoice.class";
import {
  ToastMessage,
  ToastMessageType,
} from "../../core/utils/toastr-message.helper";
import { NgForm } from "@angular/forms";
import { ReportServiceService } from "../Reports/report-service/report-service.service";

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
    private toaster: ToastMessage,
    private dateUtil:DateTimeProvider,
    private reportservice :ReportServiceService
  ) {}

  async ngOnInit() {}

  async onSearch(form:NgForm) {
    const number = form.value.number;
    console.log(number);
    if (!number) {
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
      );// old developer directly append profile type and called api now question is why driver number is empty
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
  onSuccess(msg:string){
    this.toaster.showToastr('', msg, ToastMessageType.SUCCESS);
    return;
  }
  downLoad_Report(form:NgForm){
    
    const startTimeInMillis = this.dateUtil.getMillis( this.fromDate,DateTimeFormatEnum.FULL_DATE_TIME);
    const endTimeInMillis =this.dateUtil.getMillis( this.toDate,DateTimeFormatEnum.FULL_DATE_TIME);
    const createdAtRange ={startTimeInMillis,endTimeInMillis};
    const body = {createdAtRange,"driverId":"TAP_DRIVER@8851773010"}
    this.reportservice.downloadReport("http://tbapi.truckbuddy.co.in/driverAuth/search/report",body)
    .subscribe(
      data=>{
          this.onSuccess("File is Downloading")
          saveAs(data,"Vehicle Distance Covered Report"+ '.csv');
      },
      error=>{
        this.onError("There is some issue while downloading this file.")
        console.log(error);
      }
    )
    
  }
}
