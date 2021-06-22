import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { Router } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { VerificationStateEnum } from "src/app/models/profile/verification-status.enum";
import {
  ToastMessage,
  ToastMessageType,
} from "../../../core/utils/toastr-message.helper";
import { VehicleInfo } from "../../../models/vehicle-info/vehicle-info.class";
import { VehicleSearchReq } from "../../../models/vehicle-info/vehicle-search-req.class";
import { VehicleInfoService } from "../../../services/vehicleInfo.service";
import { StorageService } from "../../../core/storage-service/storage.service";
import { Profile } from "../../../models/profile/profile.class";
import { StorageServiceTypeEnum } from "../../../core/storage-service/storage-service-type.enum";
import { VehicleDetail } from "../../../models/vehicle-info/vehicle-detail.class";
import { OriginLocation } from "../../../models/origin-location.class";

@Component({
  selector: "app-list-unverified-vehicle",
  templateUrl: "./list-unverified-vehicle.component.html",
  styleUrls: ["./list-unverified-vehicle.component.sass"],
})
export class ListUnverifiedVehicleComponent implements OnInit {
  public displayedColumns = [
    "vehicleNumber",
    "origin",
    "tapName",
    "serviceType",
    "state",
    "action",
  ];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public dataSource = new MatTableDataSource<VehicleInfo>();
  isLoading: boolean = false;
  loginProfile: Profile;

  constructor(
    private vehicleInfoService: VehicleInfoService,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private toaster: ToastMessage,
    private storage: StorageService
  ) {
    this.loginProfile = this.storage.get(StorageServiceTypeEnum.PROFILE);
  }

  async ngOnInit() {
    this.isLoading = true;
    this.ngxService.start();
    var getVehicles = await this.getAllUnVerifiedVehicles();
  }

  ngAfterViewInit(): void {
    this.dataSource.filterPredicate = (data: any, filter) => {
      const dataStr = JSON.stringify(data).toLowerCase();
      return dataStr.indexOf(filter) != -1;
    };
    this.dataSource.sortingDataAccessor = (item, property) => {
      // Split '.' to allow accessing property of nested object
      switch (property) {
        case "vehicleNumber":
          return item.detail.regNumber;
        case "origin":
          return item.detail.originFrom.city;
        case "tapName":
          return item.tapInfo.name;
        case "serviceType":
          return item.serviceType;
        case "state":
          return item.state;
      }
    };
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  async getAllUnVerifiedVehicles() {
    let req = this.createVehicleSearchRequest();
    // req.state = VerificationStateEnum.PENDING;
    this.vehicleInfoService.customSearchVehicle(req).subscribe(
      (vehicles: VehicleInfo[]) => {
        this.dataSource.data = vehicles.reverse();
      },
      (error) => {
        this.toaster.showToastr(
          "Opps !!!",
          "Something wents wrong. Please try later",
          ToastMessageType.ERROR
        );
        return;
      },
      () => {
        this.isLoading = false;
        this.ngxService.stop();
      }
    );
  }
  createVehicleSearchRequest() {
    let req = new VehicleSearchReq();
    switch (this.loginProfile.type.toString()) {
      case "SUPER_ADMIN": {
        break;
      }
      case "TRUCKBUDDY_ADMIN":
      case "TRUCKBUDDY_SUPPORT": {
        req.vehicleDetail = new VehicleDetail();
        req.vehicleDetail.originFrom = new OriginLocation();
        req.vehicleDetail.originFrom.city = this.loginProfile.address.city;
        break;
      }
    }
    return req;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  };

  public getState(state: string) {
    if (state) {
      return state;
    } else {
      return "PENDING";
    }
  }
}
