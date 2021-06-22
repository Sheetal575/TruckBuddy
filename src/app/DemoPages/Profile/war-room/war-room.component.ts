// import { MouseEvent } from '@agm/core';
import { MapsAPILoader } from "@agm/core";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatBottomSheet, MatSliderChange } from "@angular/material";
import { StorageService } from "src/app/core/storage-service/storage.service";
import {
  ToastMessage,
  ToastMessageType,
} from "src/app/core/utils/toastr-message.helper";
import { Marker } from "../../../models/marker.class";
import { VehicleLocationLogSRequest } from "../../../models/vehicle-location-log/vehicle-location-log-search-req.class";
import { VehicleLocationLog } from "../../../models/vehicle-location-log/vehicle-location-log.class";
import { VehicleLocationLogService } from "../../../services/vehicle-location-log.sevice";
import { Profile } from "./../../../models/profile/profile.class";
import { VehicleDetailBottomSheetComponent } from "./../../bottom-sheet-pages/vehicle-detail-bottom-sheet/vehicle-detail-bottom-sheet.component";

declare const google: any;

@Component({
  selector: "app-google-maps",
  templateUrl: "./war-room.component.html",
  styleUrls: ["./war-room.component.sass"],
})
export class WarRoomComponent implements OnInit, OnDestroy {
  heading = "War Room";
  subheading = "All Vehicles status in your selected range";
  icon = "pe-7s-map icon-gradient bg-sunny-morning";

  profile: Profile;
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  isSearchByVehicleNumber: boolean = false;
  vehicleNumber: string;

  // Radius
  radius: number = 0;
  radiusLat = 0;
  radiusLong = 0;

  isInitiated = false;
  markers: Marker[] = [];

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private vehicleLocationLogService: VehicleLocationLogService,
    private storage: StorageService,
    private toaster: ToastMessage,
    private _bottomSheet: MatBottomSheet
  ) {}

  ngOnDestroy(): void {
    this.isInitiated = false;
  }

  ngOnInit() {
    this.isInitiated = true;
    //load Map
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
    });
    setInterval(() => {
      if (
        ((this.isSearchByVehicleNumber && this.vehicleNumber) ||
          !this.isSearchByVehicleNumber) &&
        this.isInitiated
      ) {
        this.getVehicles();
      }
    }, 10000);
    this.profile = this.storage.get("profile");
  }

  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos: any) => {
        this.latitude = pos.coords.latitude;
        this.longitude = pos.coords.longitude;
        this.radiusLat = this.latitude;
        this.radiusLong = this.longitude;
        this.zoom = 15;
        this.radius = 10000;
        this.markers.push({
          lat: this.latitude,
          lng: this.longitude,
          label: this.profile.fullName.charAt(0).toUpperCase(),
          draggable: false,
          content: `You`,
          isShown: true,
          icon: "./assets/icons/green_marker.webp",
        });
        this.getVehicles();
      });
    }
  }

  formatLabel(value: number) {
    return value;
  }

  onDistanceChange(event: MatSliderChange) {
    let value: number = event.value;
    let oldValue: number = this.radius / 1000;
    this.radius = event.value * 1000;
    if (value == 20) {
      this.zoom = 12;
    }
    if (oldValue < value) {
      if (value >= 20 && value <= 50) {
        this.zoom = this.zoom - ((value - oldValue) / 10) * 0.5;
      } else {
        this.zoom = this.zoom - ((value - oldValue) / 20) * 0.25;
      }
    } else if (oldValue > value) {
      if (value >= 20 && value <= 50) {
        this.zoom = this.zoom + ((oldValue - value) / 10) * 0.5;
      } else {
        this.zoom = this.zoom + ((oldValue - value) / 20) * 0.25;
      }
    }
    this.getVehicles();
  }

  searchByVehicleNumber(value: boolean) {
    this.isSearchByVehicleNumber = value;
    this.vehicleNumber = "";
    if (!this.isSearchByVehicleNumber) {
      this.getVehicles();
    }
  }

  async getVehicles() {
    let req = new VehicleLocationLogSRequest();
    var vehicleLocationLog: VehicleLocationLog[];
    let tempMarker: Marker[] = [];
    tempMarker.push(this.markers[0]);
    var retry = true;
    try {
      if (this.isSearchByVehicleNumber) {
        if (!this.vehicleNumber) {
          this.onError("Enter Vehicle Number");
          return;
        }
        req.vehicleNumber = this.vehicleNumber;
        req.isForLogging = false;
        vehicleLocationLog = await this.vehicleLocationLogService
          .customSearchVehicles(req)
          .toPromise();
      } else {
        vehicleLocationLog = await this.vehicleLocationLogService
          .getAllVehiclesLastLog(
            this.longitude.toString() +
              "/" +
              this.latitude.toString() +
              "/" +
              this.radius
          )
          .toPromise();
      }
    } catch (error) {
      if (!retry) {
        this.onError("Something went wrong. Please try later");
        retry = !retry;
      }
    }
    if (this.isSearchByVehicleNumber && vehicleLocationLog.length > 1) {
      vehicleLocationLog = vehicleLocationLog
        .reverse()
        .splice(0, vehicleLocationLog.length - 1);
    }
    // this.markers.splice(1, this.markers.length);
    if (vehicleLocationLog && vehicleLocationLog.length > 0) {
      vehicleLocationLog.forEach(async (vehicleLog) => {
        tempMarker.push({
          lat: vehicleLog.lastLocation.geoAddress.coordinates[1],
          lng: vehicleLog.lastLocation.geoAddress.coordinates[0],
          // label: this.getLabel(vehicleLog.),//vehicleLog.vehicleRef.name,
          draggable: false,
          content: this.getContent(vehicleLog),
          isShown: true,
          icon: this.getIcon(vehicleLog.extraData),
        });
        if (this.isSearchByVehicleNumber) {
          this.latitude = vehicleLog.lastLocation.geoAddress.coordinates[1];
          this.longitude = vehicleLog.lastLocation.geoAddress.coordinates[0];
          this.zoom = 16;
        } else {
          this.latitude = this.radiusLat;
          this.longitude = this.radiusLong;
          // this.zoom = 14;
        }
      });
    }
    //  else {
    //   if (this.isSearchByVehicleNumber) {
    //     this.onError("Vehicle log not found for " + this.vehicleNumber.toUpperCase());
    //   }
    // }
    this.markers = tempMarker;
  }

  onError(msg: string) {
    this.toaster.showToastr("Oops!!!", msg, ToastMessageType.ERROR);
  }

  getContent(vehicleLocationLog: VehicleLocationLog): string {
    return vehicleLocationLog.id;
    // if (vehicleLocationLog.vehicleRef.name) {
    //   content = content + vehicleLocationLog.vehicleRef.name + "\n";
    // }
    // if (vehicleLocationLog.driverRef.name) {
    //   content = content + vehicleLocationLog.driverRef.name + "\n";
    // }
    // if (vehicleLocationLog.lastLocation.localArea) {
    //   content = content + vehicleLocationLog.lastLocation.localArea + " ";
    // }
    // if (vehicleLocationLog.lastLocation.city) {
    //   content = content + vehicleLocationLog.lastLocation.city + " ";
    // }
    // if (vehicleLocationLog.lastLocation.state) {
    //   content = content + vehicleLocationLog.lastLocation.state;
    // }
  }

  getLabel(data: string): string {
    var vehicleType = JSON.parse(data);
    return vehicleType["vehicleServiceType"].substring(0, 1).toUpperCase();
  }

  getIcon(data: string): string {
    return "./assets/icons/vehicle_marker.webp";
  }

  async clickedMarker(label: string, index: string) {
    var vehicleDetailBottomSheet = this._bottomSheet.open(
      VehicleDetailBottomSheetComponent,
      {
        data: {
          vehicleLocationLogId: index,
        },
      }
    );
  }

  showHideMarkers() {
    Object.values(this.markers).forEach((value) => {
      value.isShown = this.getDistanceBetween(
        value.lat,
        value.lng,
        this.radiusLat,
        this.radiusLong
      );
    });
  }

  getDistanceBetween(lat1, long1, lat2, long2) {
    var from = new google.maps.LatLng(lat1, long1);
    var to = new google.maps.LatLng(lat2, long2);

    if (
      google.maps.geometry.spherical.computeDistanceBetween(from, to) <=
      this.radius
    ) {
      console.log("Radius", this.radius);
      console.log(
        "Distance Between",
        google.maps.geometry.spherical.computeDistanceBetween(from, to)
      );
      return true;
    } else {
      return false;
    }
  }
}
