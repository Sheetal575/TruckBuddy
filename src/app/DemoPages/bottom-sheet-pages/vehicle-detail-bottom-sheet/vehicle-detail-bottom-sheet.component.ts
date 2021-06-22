import { ChangeDetectorRef, Component, Inject, OnInit } from "@angular/core";
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from "@angular/material";
import { GeoLocationService } from "../../../core/utils/geo-location.service";
import { VehicleLocationLog } from "../../../models/vehicle-location-log/vehicle-location-log.class";
import { VehicleRide } from "../../../models/vehicle-ride/vehicle-ride.class";
import { VehicleLocationLogService } from "../../../services/vehicle-location-log.sevice";
import { VehicleRideService } from "../../../services/vehicle-ride.service";
import { VehicleCategoryService } from "./../../../services/vehicle-category.service";

@Component({
  selector: "app-vehicle-detail-bottom-sheet",
  templateUrl: "./vehicle-detail-bottom-sheet.component.html",
  styleUrls: ["./vehicle-detail-bottom-sheet.component.sass"],
})
export class VehicleDetailBottomSheetComponent implements OnInit {
  vehicleLocationLog: VehicleLocationLog;
  vehicleLocationLogId: string;
  lastLocation: string = "";
  vehicleType: string = "";
  lastUpdatedTime: Date;
  vehicleRide: VehicleRide;
  _loading = false;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private _bottomSheetRef: MatBottomSheetRef<VehicleDetailBottomSheetComponent>,
    private geoLocationService: GeoLocationService,
    private vehicleCategoryService: VehicleCategoryService,
    private vehicleLocationLogService: VehicleLocationLogService,
    private vehicleRideService: VehicleRideService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.vehicleLocationLogId = this.data.vehicleLocationLogId;
    setTimeout(() => {
      this.syncVehicleData();
    }, 200);
  }

  async syncVehicleData() {
    this.vehicleLocationLog = await this.vehicleLocationLogService
      .getVehicleLog(this.vehicleLocationLogId)
      .toPromise();
    if (this._loading) {
      return;
    } else {
      this._loading = true;
    }
    var lastLocation = await this.getReverseGeoLocation();
    var vehicleCategory = await this.getVehicleCategory();
    var vehicleRide = await this.getVehicleRideInfo();
    this.lastUpdatedTime = new Date(this.vehicleLocationLog.updatedAt);
    this.changeDetectorRef.detectChanges();
    this._loading = false;
  }

  async getVehicleCategory() {
    let vehicleCategory = await this.vehicleCategoryService
      .getVehicleCategory(this.vehicleLocationLog.vehicleCategoryId)
      .toPromise();
    vehicleCategory.referenceTexts.forEach((referenceText, index: number) => {
      if (index == vehicleCategory.referenceTexts.length - 1) {
        this.vehicleType += referenceText;
      } else {
        this.vehicleType += referenceText + " / ";
      }
    });
  }

  getDriverNumber() {
    return this.vehicleLocationLog.driverRef.id.substr(
      this.vehicleLocationLog.driverRef.id.indexOf("@") + 1
    );
  }

  async getReverseGeoLocation() {
    this.lastLocation = await this.geoLocationService.getReverseGeoLocation(
      this.vehicleLocationLog.lastLocation.geoAddress
    );
  }

  closeBottomSheet(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

  async getVehicleRideInfo() {
    if (
      this.vehicleLocationLog &&
      this.vehicleLocationLog.tripRef &&
      this.vehicleLocationLog.tripRef.id
    ) {
      this.vehicleRide = await this.vehicleRideService
        .getVehicleRide(this.vehicleLocationLog.tripRef.id)
        .toPromise();
    }
  }

  getDateAndTime(data: number) {
    if (data) {
      return new Date(data);
    }
  }

  getDuration(milli) {
    let minutes = Math.floor(milli / 60000);
    let hours = Math.round(minutes / 60);
    let days = Math.round(hours / 24);
    hours = hours - days * 24;
    minutes = minutes - hours * 60 - days * 24 * 60;
    var haltTime = "";
    if (days > 0) {
      haltTime = haltTime + days + " Days, ";
    }
    if (hours > 0) {
      haltTime = haltTime + hours + " Hours, ";
    }
    if (minutes > 0) {
      haltTime = haltTime + minutes + " Minutes";
    }
    return haltTime;
  }
}
