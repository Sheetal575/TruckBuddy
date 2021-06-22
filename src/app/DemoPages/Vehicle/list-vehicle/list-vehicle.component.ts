import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { VehicleStatusEnumProvider } from "../../../utils/helpers/vehicle-status.provider";
import {
  ToastMessage,
  ToastMessageType
} from "./../../../core/utils/toastr-message.helper";
import { VehicleInfo } from "./../../../models/vehicle-info/vehicle-info.class";
import { VehicleSearchReq } from "./../../../models/vehicle-info/vehicle-search-req.class";
import { VehicleStatusEnum } from "./../../../models/vehicle-info/vehicle-status.enum";
import { VehicleInfoService } from "./../../../services/vehicleInfo.service";
import { StorageServiceTypeEnum } from '../../../core/storage-service/storage-service-type.enum';
import { StorageService } from '../../../core/storage-service/storage.service';
import { Profile } from '../../../models/profile/profile.class';

@Component({
  selector: "app-list-vehicle",
  templateUrl: "./list-vehicle.component.html",
  styleUrls: ["./list-vehicle.component.sass"],
})
export class ListVehicleComponent implements OnInit, AfterViewInit {
  public displayedColumns = ["vehicleNumber", "origin", "driver", "status"];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public dataSource = new MatTableDataSource<VehicleInfo>();
  isLoading: boolean = false;
  tapInfoId: string;
  loginProfile: Profile;

  constructor(
    private vehicleInfoService: VehicleInfoService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private toaster: ToastMessage,
    private storage: StorageService,
    private vehicleStatusProvier: VehicleStatusEnumProvider
  ) {
    this.loginProfile = this.storage.get(StorageServiceTypeEnum.PROFILE);
    if (this.loginProfile.type.toString() == "SUPER_ADMIN") {
     this.displayedColumns.push("delete");
    }
  }

  public async deleteVehicle(vehicleInfo: VehicleInfo) {
    try {
      var deletedVehicle = await this.vehicleInfoService.deleteVehicle(vehicleInfo.id).toPromise();
      this.toaster.showToastr(
        "Success",
        "Vehicle removed successfully.",
        ToastMessageType.SUCCESS
      );
      this.getAllVehicles(this.tapInfoId);
    } catch (error) {
      this.toaster.showToastr(
        "Oops !!!",
        "Something wents wrong. Please try later.",
        ToastMessageType.ERROR
      );
    }
  }


  ngOnInit() {
    this.isLoading = true;
    this.activatedRoute.fragment.subscribe((id: string) => {
      if (id) {
        this.ngxService.start();
        this.tapInfoId = id;
        this.getAllVehicles(id);
      } else {
        this.router.navigate(["../../tap/list-tap"], {
          relativeTo: this.activatedRoute,
        });
      }
    });
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
        case "driver":
          return item.driverRef.name;
        case "status":
          return item.status;
      }
    };
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getAllVehicles(id: string) {
    let req = new VehicleSearchReq();
    req.tapId = id;
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

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  };

  getVehicleStatus(status: VehicleStatusEnum): string {
    return this.vehicleStatusProvier.getVehicleStatus(status);
  }
}
