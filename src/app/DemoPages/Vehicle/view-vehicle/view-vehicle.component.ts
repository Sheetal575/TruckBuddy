import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { VerificationStateEnum } from "src/app/models/profile/verification-status.enum";
import { DataRef } from "../../../core/models/dataRef.class";
import {
  ToastMessage,
  ToastMessageType,
} from "../../../core/utils/toastr-message.helper";
import { ProfileSearchReq } from "../../../models/profile/profile-search-req.class";
import { ProfileTypeEnum } from "../../../models/profile/profile-type.enum";
import { Profile } from "../../../models/profile/profile.class";
import { VehicleInfo } from "../../../models/vehicle-info/vehicle-info.class";
import {
  ServiceTypeEnum,
  ServiceTypeEnumFormatter,
} from "../../../models/vehicle-info/vehicle-service-type.enum";
import { VehicleStatusEnum } from "../../../models/vehicle-info/vehicle-status.enum";
import { ProfileService } from "../../../services/profile.service";
import { VehicleInfoService } from "../../../services/vehicleInfo.service";
import { VehicleStatusEnumProvider } from "../../../utils/helpers/vehicle-status.provider";
import { VehicleCategoryService } from "./../../../services/vehicle-category.service";

@Component({
  selector: "app-view-vehicle",
  templateUrl: "./view-vehicle.component.html",
  styleUrls: ["./view-vehicle.component.sass"],
})
export class ViewVehicleComponent implements OnInit {
  vehicleInfo: VehicleInfo;
  isLoading: boolean = false;
  isDriverLinked: boolean = false;
  mobile: string;
  vehicleCategoryName: string = "";

  constructor(
    private vehicleStatusProvier: VehicleStatusEnumProvider,
    private vehicleServiceTypeFormatter: ServiceTypeEnumFormatter,
    private vehicleCategoryService: VehicleCategoryService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleInfoService,
    private ngxService: NgxUiLoaderService,
    private toaster: ToastMessage,
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.activeRoute.fragment.subscribe((id) => {
      if (id) {
        this.ngxService.start();
        this.getVehicle(id);
      } else {
        this.routeToVehicleList(id);
      }
    });
  }

  async getVehicleCategory() {
    try {
      var vehicleCategory = await this.vehicleCategoryService
        .getVehicleCategory(this.vehicleInfo.vehCategoryRef.id)
        .toPromise();
      vehicleCategory.referenceTexts.forEach((referenceText, index: number) => {
        if (index == vehicleCategory.referenceTexts.length - 1) {
          this.vehicleCategoryName += referenceText;
        } else {
          this.vehicleCategoryName += referenceText + " / ";
        }
      });
    } catch (err) {}
  }
  async getVehicle(id: string) {
    await this.vehicleService.getVehicle(id).subscribe(
      (vehicle: VehicleInfo) => {
        if (vehicle) {
          this.vehicleInfo = vehicle;
          if (!this.vehicleInfo.state) {
            this.vehicleInfo.state = VerificationStateEnum.PENDING;
          }
          this.getVehicleCategory();
          if (!this.vehicleInfo.driverRef || !this.vehicleInfo.driverRef.name) {
            this.isDriverLinked = false;
          } else {
            this.isDriverLinked = true;
          }
        } else {
          this.routeToVehicleList(id);
        }
      },
      (error) => {
        this.routeToVehicleList(id);
      },
      () => {
        this.isLoading = false;
        this.ngxService.stop();
      }
    );
  }

  getTapType(type: string) {
    return type.replace("_", " ");
  }

  async linkDriver() {
    this.isLoading = true;
    this.ngxService.start();
    // if (
    //   this.vehicleInfo.state.toString() == "PENDING" ||
    //   this.vehicleInfo.state.toString() == "2"
    // ) {
    //   this.isLoading = false;
    //   this.ngxService.stop();
    //   this.toaster.showToastr(
    //     "Opps !!!",
    //     "Vehicle is not yet verified. Please contact to Truckbuddy Support.",
    //     ToastMessageType.ERROR
    //   );
    //   this.mobile = "";
    //   return;
    // }
    if (this.mobile) {
      // let req: ProfileSearchReq = new ProfileSearchReq();
      // req.mobile = this.mobile;
      // req.profileType = ProfileTypeEnum.TAP_DRIVER;
      await this.vehicleService
        .checkDriverAvailability(this.mobile)
        .subscribe(
          async (profile: Profile) => {
            if (profile) {
              let driverProfile: Profile = profile;
              this.vehicleInfo.driverRef = new DataRef();
              this.vehicleInfo.driverRef.id = driverProfile.id;
              this.vehicleInfo.driverRef.name = driverProfile.fullName;
              await this.vehicleService
                .updateVehicle(this.vehicleInfo)
                .subscribe(
                  (vehicleInfo: VehicleInfo) => {
                    this.vehicleInfo = vehicleInfo;
                    this.isDriverLinked = true;
                  },
                  (error) => {
                    this.somethingWentsWrong();
                  },
                  () => {
                    this.isLoading = false;
                    this.ngxService.stop();
                  }
                );
            } else {
              this.isLoading = false;
              this.ngxService.stop();
              this.toaster.showToastr(
                "Opps !!!",
                "No Driver profile found.",
                ToastMessageType.ERROR
              );
            }
          },
          (error) => {
            this.toaster.showToastr(
              "Opps !!!",
              "Driver is already associated with some vehicle",
              ToastMessageType.ERROR
            );
            this.isLoading = false;
            this.ngxService.stop();
          },
          () => {
            this.isLoading = false;
            this.ngxService.stop();
          }
        );
    } else {
      this.toaster.showToastr(
        "Opps !!!",
        "Please Enter Driver Mobile Number",
        ToastMessageType.ERROR
      );
      this.isLoading = false;
      this.ngxService.stop();
    }
  }
  async removeDriver() {
    this.isLoading = true;
    this.ngxService.start();
    this.vehicleInfo.driverRef = new DataRef();
    await this.vehicleService.updateVehicle(this.vehicleInfo).subscribe(
      (vehicleInfo: VehicleInfo) => {
        this.vehicleInfo = vehicleInfo;
        this.mobile = "";
        this.isDriverLinked = false;
      },
      (error) => {
        this.somethingWentsWrong();
      },
      () => {
        this.isLoading = false;
        this.ngxService.stop();
      }
    );
  }

  somethingWentsWrong() {
    this.toaster.showToastr(
      "Opps !!!",
      "Something wents wrong. Please try later",
      ToastMessageType.ERROR
    );
    return;
  }

  routeToVehicleList(id: string) {
    this.router.navigate(["../../vehicle/list-vehicle"], { fragment: id });
  }

  getVehicleStatus(status: VehicleStatusEnum): string {
    return this.vehicleStatusProvier.getVehicleStatus(status);
  }

  getVehicleServiceType(serviceType: ServiceTypeEnum): string {
    return this.vehicleServiceTypeFormatter.format(serviceType);
  }
}
