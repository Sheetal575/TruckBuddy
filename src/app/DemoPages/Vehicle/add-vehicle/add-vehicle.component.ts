import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  Input,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatStepper } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { DataRef } from "src/app/core/models/dataRef.class";
import { ToastMessage } from "src/app/core/utils/toastr-message.helper";
import { OriginLocation } from "src/app/models/origin-location.class";
import { TapInfo } from "src/app/models/tap-info.class";
import { VehicleCategory } from "src/app/models/vehicle-category/vehicle-category.class";
import { ToastMessageType } from "./../../../core/utils/toastr-message.helper";
import { BusinessDesign } from "./../../../models/business/business-design.class";
import { VehicleCategorySearchRequest } from "./../../../models/vehicle-category/vehicle-category-search-req.class";
import { VehicleDetail } from "./../../../models/vehicle-info/vehicle-detail.class";
import { VehicleInfo } from "./../../../models/vehicle-info/vehicle-info.class";
import { VehicleSearchReq } from "./../../../models/vehicle-info/vehicle-search-req.class";
import {
  ServiceTypeEnum,
  ServiceTypeEnumFormatter,
} from "./../../../models/vehicle-info/vehicle-service-type.enum";
import { VehicleStatusEnum } from "./../../../models/vehicle-info/vehicle-status.enum";
import { BusinessService } from "./../../../services/business.service";
import { VehicleCategoryService } from "./../../../services/vehicle-category.service";
import { VehicleInfoService } from "./../../../services/vehicleInfo.service";
import { VehicleServiceTypeProvider } from "./../../../utils/helpers/vehicle-service-type.provider";
import {
  LocaleTypeEnum,
  CityStateProvider,
} from "../../../core/utils/city-state.helper";
import { OptionConfig } from "../../../core/models/option-config.class";
import { StorageService } from "../../../core/storage-service/storage.service";
import { StorageServiceTypeEnum } from "../../../core/storage-service/storage-service-type.enum";

@Component({
  selector: "app-add-vehicle",
  templateUrl: "./add-vehicle.component.html",
  styleUrls: ["./add-vehicle.component.sass"],
})
export class AddVehicleComponent implements OnInit {
  vehicleInfoForm: FormGroup;

  isLoading: boolean = false;
  business: BusinessDesign;
  createOrUpdateVehicleInfo: VehicleInfo;
  isStateChanged = false;
  @Input() vehicleId: string;

  heading = "Add / Update Vehicle";
  subheading = "To Add or modify Vehicle Info";
  icon = "pe-7s-fa-truck icon-gradient bg-sunny-morning";

  vehicleServcieTypeList: Map<ServiceTypeEnum, string> = new Map();
  cities: Map<string, string> = new Map();
  states: Map<string, string> = new Map();

  @ViewChild("stepper") stepper: ElementRef;

  vehicleTypes: Map<string, string> = new Map();
  lastFetchedState: string = "";

  constructor(
    private vehicleInfoService: VehicleInfoService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private toaster: ToastMessage,
    private formBuilder: FormBuilder,
    private serviceTypeProvider: VehicleServiceTypeProvider,
    private vehicleServiceTypeFormatter: ServiceTypeEnumFormatter,
    private businessService: BusinessService,
    private vehicleCategoryService: VehicleCategoryService,
    private cityStateProvider: CityStateProvider,
    private changeDetector: ChangeDetectorRef,
    private session: StorageService
  ) {}

  async ngOnInit() {
    this.isLoading = true;
    await this.getData();
    await this.getStates();
    this.createForm();
    this.getVehicleCategories();
    this.activatedRoute.fragment.subscribe(
      (id: string) => {
        if (id) {
          this.ngxService.start();
          this.getTapInfo(id);
        } else if (this.vehicleId) {
          this.ngxService.start();
          this.getVehicleInfo();
        } else {
          this.router.navigate(["../../tap/list-tap"], {
            relativeTo: this.activatedRoute,
          });
        }
      },
      (error) => {
        this.somethingWentsWrong();
      },
      () => {
        this.isLoading = false;
        this.ngxService.stop();
        this.changeDetector.detectChanges();
      }
    );
  }
  async getVehicleInfo() {
    try {
      var vehicle = (await this.vehicleInfoService
        .getVehicle(this.vehicleId)
        .toPromise()) as VehicleInfo;
      if (vehicle) {
        this.createOrUpdateVehicleInfo = vehicle;
        this.vehicleInfoForm.patchValue(this.createOrUpdateVehicleInfo);
        this.vehicleInfoForm.patchValue({
          vehCategoryRef: this.createOrUpdateVehicleInfo.vehCategoryRef.id,
        });
        this.stepper.nativeElement.next();
      } else {
        this.somethingWentsWrong();
        this.router.navigate(["../../tap/list-tap"], {
          relativeTo: this.activatedRoute,
        });
      }
    } catch (error) {
      this.somethingWentsWrong();
      this.router.navigate(["../../tap/list-tap"], {
        relativeTo: this.activatedRoute,
      });
    }
  }

  getVehicleCategories() {
    (this.session.get(
      StorageServiceTypeEnum.VEHICLE_CATEGORIES
    ) as VehicleCategory[]).forEach((vehicleCategory) => {
      this.vehicleTypes.set(
        vehicleCategory.id,
        this.vehicleCategoryReferenceText(vehicleCategory.referenceTexts)
      );
    });
  }

  vehicleCategoryReferenceText(referenceTexts: string[]): string {
    let name = "";
    referenceTexts.forEach((referenceText, index: number) => {
      if (index === referenceTexts.length - 1) {
        name += referenceText;
      } else {
        name += referenceText + " / ";
      }
    });
    return name;
  }

  async getData() {
    await this.serviceTypeProvider
      .getAllVehicleServiceTypes()
      .forEach((serviceType: ServiceTypeEnum) => {
        this.vehicleServcieTypeList.set(
          serviceType,
          this.vehicleServiceTypeFormatter.format(serviceType)
        );
      });
  }

  async getTapInfo(id: string) {
    await this.businessService.getBusiness(id).subscribe(
      (response: BusinessDesign) => {
        this.business = response;
        this.isLoading = false;
        this.ngxService.stop();
      },
      (error) => {
        this.somethingWentsWrong();
      }
    );
  }

  createForm() {
    this.vehicleInfoForm = this.formBuilder.group({
      detail: this.formBuilder.group({
        regNumber: ["", Validators.required],
        originFrom: this.formBuilder.group({
          city: ["", Validators.required],
          state: ["", Validators.required],
        }),
      }),
      serviceType: ["", Validators.required],
      vehCategoryRef: ["", Validators.required],
    });
  }

  isFieldValid(form: FormGroup, field: string, validationName: string) {
    return form.get(field).touched && form.get(field).hasError(validationName);
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  checkOrCreateVehicleInfo(stepper: MatStepper) {
    if (
      this.vehicleInfoForm.get("detail").get("regNumber").valid &&
      this.vehicleInfoForm.get("serviceType").valid
    ) {
      let req = new VehicleSearchReq();
      req.vehicleDetail = new VehicleDetail();
      req.vehicleDetail.regNumber = this.vehicleInfoForm
        .get("detail")
        .get("regNumber").value;
      // req.serviceType = this.vehicleInfoForm.get("serviceType").value;
      // req.vehCategoryId = this.vehicleInfoForm.get("vehCategoryRef").value;
      this.vehicleInfoService.customSearchVehicle(req).subscribe(
        (vehicles: VehicleInfo[]) => {
          if (vehicles.length > 0) {
            this.createOrUpdateVehicleInfo = vehicles[0];
            this.vehicleInfoForm.patchValue(this.createOrUpdateVehicleInfo);
            this.vehicleInfoForm.patchValue({
              vehCategoryRef: this.createOrUpdateVehicleInfo.vehCategoryRef.id,
            });
          } else {
            this.vehicleInfoForm.patchValue(this.vehicleInfoForm.value);
          }
          stepper.next();
        },
        (error) => {
          this.somethingWentsWrong();
        }
      );
    }
  }

  onSubmitVehicleInfo(stepper: MatStepper) {
    this.setVehicleInfo();
    if (this.createOrUpdateVehicleInfo.id) {
      this.vehicleInfoService
        .updateVehicle(this.createOrUpdateVehicleInfo)
        .subscribe(
          (vehicleInfo: VehicleInfo) => {
            this.createOrUpdateVehicleInfo = vehicleInfo;
            stepper.next();
          },
          (error) => {
            this.somethingWentsWrong();
          }
        );
    } else {
      this.vehicleInfoService
        .createVehicle(this.createOrUpdateVehicleInfo)
        .subscribe(
          (vehicleInfo: VehicleInfo) => {
            this.createOrUpdateVehicleInfo = vehicleInfo;
            stepper.next();
          },
          (error) => {
            this.somethingWentsWrong();
          }
        );
    }
  }

  setVehicleInfo() {
    if (!this.createOrUpdateVehicleInfo) {
      this.createOrUpdateVehicleInfo = new VehicleInfo();
      this.createOrUpdateVehicleInfo.status = VehicleStatusEnum.AVAILABLE;
      this.createOrUpdateVehicleInfo.tapInfo = new TapInfo();
      this.createOrUpdateVehicleInfo.tapInfo.id = this.business.id;
      this.createOrUpdateVehicleInfo.tapInfo.name = this.business.businessName;
      this.createOrUpdateVehicleInfo.tapInfo.type = this.business.businessType;
    }
    if (!this.createOrUpdateVehicleInfo.detail) {
      this.createOrUpdateVehicleInfo.detail = new VehicleDetail();
    }
    if (!this.createOrUpdateVehicleInfo.detail.regNumber) {
      this.createOrUpdateVehicleInfo.detail.regNumber = this.vehicleInfoForm
        .get("detail")
        .get("regNumber").value;
    }
    if (!this.createOrUpdateVehicleInfo.detail.originFrom) {
      this.createOrUpdateVehicleInfo.detail.originFrom = new OriginLocation();
    }
    this.createOrUpdateVehicleInfo.detail.originFrom.city = this.vehicleInfoForm
      .get("detail")
      .get("originFrom")
      .get("city").value;
    this.createOrUpdateVehicleInfo.detail.originFrom.state = this.vehicleInfoForm
      .get("detail")
      .get("originFrom")
      .get("state").value;
    if (!this.createOrUpdateVehicleInfo.vehCategoryRef) {
      this.createOrUpdateVehicleInfo.vehCategoryRef = new DataRef();
      this.createOrUpdateVehicleInfo.vehCategoryRef.id = this.vehicleInfoForm.get(
        "vehCategoryRef"
      ).value;
    }
    if (!this.createOrUpdateVehicleInfo.serviceType) {
      this.createOrUpdateVehicleInfo.serviceType = this.vehicleInfoForm.get(
        "serviceType"
      ).value;
    }
  }

  somethingWentsWrong() {
    this.toaster.showToastr(
      "Opps !!!",
      "Something wents wrong. Please try later",
      ToastMessageType.ERROR
    );
    this.isLoading = false;
    this.ngxService.stop();
    return;
  }

  onStepperCompletion(stepper: MatStepper) {
    this.vehicleInfoForm.reset();
    stepper.reset();
    this.router.navigate(["../list-vehicle"], {
      relativeTo: this.activatedRoute,
      fragment: this.business.id,
    });
  }

  async getStates() {
    var fetchState = await this.cityStateProvider
      .fetchState(LocaleTypeEnum.ENGLISH)
      .then((optionConfigs: OptionConfig[]) => {
        this.states = this.cityStateProvider.fetchDataBasedOnLocale(
          optionConfigs,
          LocaleTypeEnum.ENGLISH
        );
      });
  }

  async onStateChange(stateId: string) {
    this.vehicleInfoForm
      .get("detail")
      .get("originFrom")
      .patchValue({
        state: this.states.get(stateId),
      });
    this.isStateChanged = true;
    var fetchState = await this.cityStateProvider
      .fetchCity(stateId, LocaleTypeEnum.ENGLISH)
      .then((optionConfigs: OptionConfig[]) => {
        this.cities = this.cityStateProvider.fetchDataBasedOnLocale(
          optionConfigs,
          LocaleTypeEnum.ENGLISH
        );
      });
  }
  async onCityChange(cityId: string) {
    this.vehicleInfoForm
      .get("detail")
      .get("originFrom")
      .patchValue({
        city: this.cities.get(cityId),
      });
  }

  selectedState(state: string) {
    for (let [key, value] of this.states.entries()) {
      if (value === state) {
        return key;
      }
    }
  }
}
