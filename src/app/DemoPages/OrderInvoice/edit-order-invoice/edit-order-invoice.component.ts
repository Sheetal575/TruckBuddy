import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { MatStepper } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment-timezone";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { DataRef } from "src/app/core/models/dataRef.class";
import { EntityRef } from "../../../core/models/entityRef.class";
import { OptionConfig } from "../../../core/models/option-config.class";
import {
  CityStateProvider,
  LocaleTypeEnum,
} from "../../../core/utils/city-state.helper";
import { DateTimeProvider } from "../../../core/utils/date-time.provider";
import { GeoLocationService } from "../../../core/utils/geo-location.service";
import {
  ToastMessage,
  ToastMessageType,
} from "../../../core/utils/toastr-message.helper";
import { ContactDetails } from "../../../models/contact-details.class";
import { DetailedAddress } from "../../../models/detailed-address.class";
import { GeoAddress } from "../../../models/geolocation.class";
import {
  ConsigneeNotificaton,
  DeliveryOperationTimeStats,
  DeliveryOperationTypeEnum,
  FreightChargeDetail,
  HaltChargeDetail,
  OrderChangeTypeEnum,
  OrderDeliveryLocation,
  OrderInvoice,
  OrderPackage,
  OrderPickupSource,
  PaymentDetail,
  PhysicalPod,
  TimeRange,
  VehicleDetails,
} from "../../../models/order-invoice/order-invoice.class";
import { ProfileSearchReq } from "../../../models/profile/profile-search-req.class";
import { ProfileTypeEnum } from "../../../models/profile/profile-type.enum";
import { Profile } from "../../../models/profile/profile.class";
import { VehicleDetail } from "../../../models/vehicle-info/vehicle-detail.class";
import { VehicleInfo } from "../../../models/vehicle-info/vehicle-info.class";
import { VehicleSearchReq } from "../../../models/vehicle-info/vehicle-search-req.class";
import { OrderInvoiceService } from "../../../services/order-invoice.service";
import { ProfileService } from "../../../services/profile.service";
import { VehicleInfoService } from "../../../services/vehicleInfo.service";
import { Location } from "./../../../core/models/geo-coding-response.class";
import { BusinessService } from "../../../services/business.service";
import { BookingRequestService } from "../../../services/booking-request.service";
import { BookingRequest } from "../../../models/booking-request/booking-request.class";

@Component({
  selector: "app-edit-order-invoice",
  templateUrl: "./edit-order-invoice.component.html",
  styleUrls: ["./edit-order-invoice.component.sass"],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class EditOrderInvoiceComponent implements OnInit {
  heading = "Update Order Invoice";
  subheading = "To Update Order Invoice";
  icon = "pe-7s-edit icon-gradient bg-sunny-morning";

  orderInvoice: OrderInvoice;
  copyOrderInvoice: OrderInvoice = new OrderInvoice();
  updatedOrderInvoice: OrderInvoice;
  @Output() outputEmitter = new EventEmitter<OrderInvoice>();
  isLoading: boolean = false;
  cities: Map<string, string> = new Map();
  states: Map<string, string> = new Map();
  public minDate: moment.Moment;
  public maxDate: moment.Moment;
  requestedTime: string = "";
  arrivalTime: string = "";
  workStartTime: string = "";
  workEndTime: string = "";
  haltingTime: string = "";
  lastStateIdFetched: string;
  providerNumber: string = "";
  tdsAmount: number = 0;
  totalFrieghtAmount: number = 0;
  totalExtraAmount: number = 0;
  totalOrderAmount: number = 0;
  gstList = [0, 5, 18];
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private ngxService: NgxUiLoaderService,
    private orderInvoiceService: OrderInvoiceService,
    private profileService: ProfileService,
    private toaster: ToastMessage,
    private vehicleInfoService: VehicleInfoService,
    private cityStateProvider: CityStateProvider,
    private dateTimeProvider: DateTimeProvider,
    private geoLocationService: GeoLocationService,
    private businessService: BusinessService,
    private bookingRequestService: BookingRequestService
  ) {}

  async ngOnInit() {
    try {
      this.isLoading = true;
      this.ngxService.start();
      this.activatedRoute.fragment.subscribe((id: string) => {
        if (id) {
          this.getOrderInvoice(id);
        } else {
          this.onError("Something went wrong. Please try again later.");
          this.router.navigate(["../list-order-invoice"]);
        }
      });
    } catch (error) {
      this.onError("Something went wrong. Please try again later.");
      this.router.navigate(["../list-order-invoice"]);
    }
  }

  onChangeRequestedTime() {
    this.orderInvoice.requestedTime = this.dateTimeProvider.getMillis(
      this.requestedTime
    );
    this.orderInvoice.changeType =
      OrderChangeTypeEnum.UPDATE_REQUESTED_BOOKING_TIME;
  }

  getDate(requestedTime: number): Date {
    if (requestedTime) return new Date(requestedTime);
  }

  async onDriverChange(driverNumber: string) {
    let driverProfileSearchReq = new ProfileSearchReq();
    driverProfileSearchReq.profileType = ProfileTypeEnum.TAP_DRIVER;
    driverProfileSearchReq.mobile = driverNumber;
    let driverProfile = (await this.profileService
      .customSearchProfile(driverProfileSearchReq)
      .toPromise()) as Profile[];

    if (driverProfile && driverProfile.length > 0) {
      if (!this.orderInvoice.vehicleDetails.driver) {
        this.orderInvoice.vehicleDetails.driver = new DataRef();
      }
      this.orderInvoice.vehicleDetails.driver.id = driverProfile[0].id;
      this.orderInvoice.vehicleDetails.driver.name = driverProfile[0].fullName;
    } else {
      this.orderInvoice.vehicleDetails.driver.id = this.copyOrderInvoice.vehicleDetails.driver.id;
      this.orderInvoice.vehicleDetails.driver.name = this.copyOrderInvoice.vehicleDetails.driver.name;
      this.onError("Driver Not found with number :- " + driverNumber);
    }
  }

  async updateBasicOrderInvoice(stepper: MatStepper) {
    if (
      this.orderInvoice.consignorNumber &&
      this.orderInvoice.consignorNumber.length < 10
    ) {
      this.onError("Invalid Consignor Number");
    }
    if (
      this.orderInvoice.consignorName &&
      this.orderInvoice.consignorName.length > 0 &&
      this.orderInvoice.consignorName.length < 2
    ) {
      this.onError("Invalid Consignor Name");
    }
    try {
      this.orderInvoice.changeType = OrderChangeTypeEnum.DEFAULT;
      this.orderInvoice = (await this.orderInvoiceService
        .updateOrderInvoice(this.orderInvoice)
        .toPromise()) as OrderInvoice;
      this.copyOrderInvoice = JSON.parse(JSON.stringify(this.orderInvoice));
      this.toaster.showToastr(
        "Success",
        "Order Invoice Updated Successfully",
        ToastMessageType.SUCCESS
      );
      stepper.next();
    } catch (error) {
      this.onError(
        "Error while Updating Order Invoice. Please try again later."
      );
    }
  }

  async updateVehicleDetailsInOrderInvoice(
    stepper: MatStepper,
    changeType: number
  ) {
    switch (changeType) {
      case 1: {
        if (
          this.copyOrderInvoice.vehicleDetails.vehicleRegNo !=
          this.orderInvoice.vehicleDetails.vehicleRegNo
        ) {
          this.orderInvoice.changeType = OrderChangeTypeEnum.VEHICLE_CHANGED;
        }
        else if (
          this.copyOrderInvoice.vehicleDetails.driver &&
          this.copyOrderInvoice.vehicleDetails.driver.id !=
            this.orderInvoice.vehicleDetails.driver.id
        ) {
          this.orderInvoice.changeType = OrderChangeTypeEnum.DRIVER_CHANGED;
        }
       else
      //   if (
      //     this.copyOrderInvoice.vehicleDetails.vehicleRegNo !=
      //       this.orderInvoice.vehicleDetails.vehicleRegNo &&
      //     this.copyOrderInvoice.vehicleDetails.driver.id !=
      //       this.orderInvoice.vehicleDetails.driver.id
      //   )
         {
          this.orderInvoice.changeType = OrderChangeTypeEnum.VEHICLE_DRIVER_CHANGED;
          // this.orderInvoice.changeType = OrderChangeTypeEnum.DRIVER_CHANGED;
        }
        break;
      }
      case 2: {
        this.orderInvoice.changeType =
          OrderChangeTypeEnum.NEW_SOURCE_LOCATION_ADDED;
        break;
      }
      case 3: {
        this.orderInvoice.changeType =
          OrderChangeTypeEnum.NEW_DROP_LOCATION_ADDED;
        break;
      }
      case 4: {
        this.orderInvoice.changeType = OrderChangeTypeEnum.FREIGHT_UPDATED;
        break;
      }
    }
    if (
      this.orderInvoice.vehicleDetails &&
      this.orderInvoice.vehicleDetails.vehicleRegNo &&
      this.orderInvoice.vehicleDetails.vehicleRegNo.length < 9
    ) {
      this.onError("Invalid Vehicle Registration Number");
    }
    for (let source of this.orderInvoice.orderPickupSources) {
      if (
        !source.address.geoAddress ||
        source.address.geoAddress.coordinates.length != 0
      ) {
        let sourceLocation = await this.geoLocationService.getGeoLocation(
          source.address
        );
        if (!source.address.geoAddress) {
          source.address.geoAddress = new GeoAddress();
          source.address.geoAddress.type = "Point";
          source.address.geoAddress.coordinates = [];
          source.address.geoAddress.coordinates.push(
            (sourceLocation as Location).lng
          );
          source.address.geoAddress.coordinates.push(
            (sourceLocation as Location).lat
          );
        }
      }
    }
    for (let destination of this.orderInvoice.orderDeliveryLocations) {
      if (
        !destination.address.geoAddress ||
        destination.address.geoAddress.coordinates.length != 0
      ) {
        let destinationLocation = await this.geoLocationService.getGeoLocation(
          destination.address
        );
        if (!destination.address.geoAddress) {
          destination.address.geoAddress = new GeoAddress();
          destination.address.geoAddress.type = "Point";
          destination.address.geoAddress.coordinates = [];
          destination.address.geoAddress.coordinates.push(
            (destinationLocation as Location).lng
          );
          destination.address.geoAddress.coordinates.push(
            (destinationLocation as Location).lat
          );
        }
      }
    }
    try {
      this.orderInvoice = (await this.orderInvoiceService
        .updateOrderInvoice(this.orderInvoice)
        .toPromise()) as OrderInvoice;
      this.copyOrderInvoice = this.orderInvoice;
      this.toaster.showToastr(
        "Success",
        "Order Invoice Updated Successfully",
        ToastMessageType.SUCCESS
      );
      stepper.next();
    } catch (error) {
      this.onError(
        "Error while Updating Order Invoice. Please try again later."
      );
    }
  }

  async onVehicleChange(vehicleRegNumber: string) {
    var vehicleInfoSearchReq = new VehicleSearchReq();
    let vehicleCategoryId = ((await this.bookingRequestService
      .getBookingRequest(this.orderInvoice.serviceProvider.bookingRequestId)
      .toPromise()) as BookingRequest).vehicleCategoryId;
    vehicleInfoSearchReq.vehCategoryId = vehicleCategoryId;
    vehicleInfoSearchReq.vehicleDetail = new VehicleDetail();
    vehicleInfoSearchReq.vehicleDetail.regNumber = vehicleRegNumber;
    if (this.orderInvoice.serviceProvider.vehicleLoadType == "HCV") {
      vehicleInfoSearchReq.tapId = this.orderInvoice.serviceProvider.provider.id;
    }
    let vehicleInfoList = (await this.vehicleInfoService
      .customSearchVehicle(vehicleInfoSearchReq)
      .toPromise()) as VehicleInfo[];
    if (vehicleInfoList && vehicleInfoList.length > 0) {
      this.orderInvoice.vehicleDetails.vehicle = new DataRef();
      this.orderInvoice.vehicleDetails.vehicle.id = vehicleInfoList[0].id;
      this.orderInvoice.vehicleDetails.vehicle.name =
        vehicleInfoList[0].detail.regNumber;
      this.orderInvoice.vehicleDetails.vehicleRegNo = vehicleInfoList[0].detail.regNumber.toUpperCase();
      if (vehicleInfoList[0].driverRef) {
        if (!this.orderInvoice.vehicleDetails.driver) {
          this.orderInvoice.vehicleDetails.driver = new DataRef();
        }
        this.orderInvoice.vehicleDetails.driver.id =
          vehicleInfoList[0].driverRef.id;
        this.orderInvoice.vehicleDetails.driver.name =
          vehicleInfoList[0].driverRef.name;
      }
    } else {
      if (!this.orderInvoice.vehicleDetails.vehicle) {
        this.orderInvoice.vehicleDetails.vehicle = new DataRef();
      }
      if (this.copyOrderInvoice.vehicleDetails.vehicle) {
        this.orderInvoice.vehicleDetails.vehicle.id = this.copyOrderInvoice.vehicleDetails.vehicle.id;
        this.orderInvoice.vehicleDetails.vehicle.name = this.copyOrderInvoice.vehicleDetails.vehicle.name;
        this.orderInvoice.vehicleDetails.vehicleRegNo = this.copyOrderInvoice.vehicleDetails.vehicleRegNo;
        this.orderInvoice.vehicleDetails.driver.id = this.copyOrderInvoice.vehicleDetails.driver.id;
        this.orderInvoice.vehicleDetails.driver.name = this.copyOrderInvoice.vehicleDetails.driver.name;
      }
      this.onError(
        "Required Vehicle OR No Vehicle found with Registration Number :- " +
          vehicleRegNumber
      );
    }
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
        return "text-muted";
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
      if (this.orderInvoice) {
        await this.fetchStates();
        this.orderInvoice = this.checkAndUpdateOrderInvoice(this.orderInvoice);
        this.copyOrderInvoice = JSON.parse(JSON.stringify(this.orderInvoice));
        var business = await this.getBusiness();
        this.isLoading = false;
        this.ngxService.stop();
      } else {
        this.onError("Something went wrong. Please try again later.");
      }
    } catch (error) {
      this.onError("Something went wrong. Please try again later.");
    }
  }
  async getBusiness() {
    if (
      !this.providerNumber &&
      !this.orderInvoice.serviceProvider.provider.id.includes("TAP_DRIVER")
    ) {
      var business = await this.businessService
        .getBusiness(this.orderInvoice.serviceProvider.provider.id)
        .toPromise();
      this.providerNumber = business.contact.mobile;
    }
  }
  checkAndUpdateOrderInvoice(orderInvoice: OrderInvoice) {
    if (orderInvoice.orderPickupSources.length == 0) {
      let orderPickupSource = new OrderPickupSource();
      orderPickupSource.timeStats = new DeliveryOperationTimeStats();
      orderPickupSource.address = new DetailedAddress();
      orderPickupSource.address.geoAddress = new GeoAddress();
      orderPickupSource.packages = [];
      orderPickupSource.packages.push(new OrderPackage());
      orderInvoice.orderPickupSources.push(orderPickupSource);
    } else {
      orderInvoice.orderPickupSources.forEach((location, index) => {
        if (!location.address) {
          orderInvoice.orderPickupSources[
            index
          ].address = new DetailedAddress();
          orderInvoice.orderPickupSources[
            index
          ].address.geoAddress = new GeoAddress();
        }
        if (!location.timeStats) {
          location.timeStats = new DeliveryOperationTimeStats();
        }
        if (!location.packages) {
          location.packages = [];
          location.packages.push(new OrderPackage());
        }
      });
    }
    if (orderInvoice.orderDeliveryLocations.length == 0) {
      let orderDeliveryLocation = new OrderDeliveryLocation();
      orderDeliveryLocation.timeStats = new DeliveryOperationTimeStats();
      orderDeliveryLocation.consigneeNotification = new ConsigneeNotificaton();
      orderDeliveryLocation.consigneeNotification.consigneeContact = new ContactDetails();
      orderDeliveryLocation.charges = new FreightChargeDetail();
      orderDeliveryLocation.charges.haltCharge = new HaltChargeDetail();
      orderDeliveryLocation.charges.haltCharge.duration = new TimeRange();
      orderDeliveryLocation.address = new DetailedAddress();
      orderDeliveryLocation.address.geoAddress = new GeoAddress();
      orderDeliveryLocation.packages = [];
      orderDeliveryLocation.packages.push(new OrderPackage());
      orderDeliveryLocation.physicalPod = new PhysicalPod();
      orderInvoice.orderDeliveryLocations.push(orderDeliveryLocation);
    } else {
      orderInvoice.orderDeliveryLocations.forEach((location, index) => {
        if (!location.address) {
          orderInvoice.orderDeliveryLocations[
            index
          ].address = new DetailedAddress();
          orderInvoice.orderDeliveryLocations[
            index
          ].address.geoAddress = new GeoAddress();
        }
        if (!location.timeStats) {
          location.timeStats = new DeliveryOperationTimeStats();
        }
        if (!location.packages) {
          location.packages = [];
          location.packages.push(new OrderPackage());
        }
        if (!location.charges) {
          location.charges = new FreightChargeDetail();
          location.charges.haltCharge = new HaltChargeDetail();
          location.charges.haltCharge.duration = new TimeRange();
        } else {
          if (!location.charges.haltCharge) {
            location.charges.haltCharge = new HaltChargeDetail();
          } else {
            if (!location.charges.haltCharge.duration) {
              location.charges.haltCharge.duration = new TimeRange();
            }
          }
        }
        if (!location.physicalPod) {
          location.physicalPod = new PhysicalPod();
        }
        if (!location.consigneeNotification) {
          location.consigneeNotification = new ConsigneeNotificaton();
          location.consigneeNotification.consigneeContact = new ContactDetails();
        } else {
          if (!location.consigneeNotification.consigneeContact) {
            location.consigneeNotification.consigneeContact = new ContactDetails();
          }
        }
      });
    }
    if (!orderInvoice.serviceProvider.provider) {
      orderInvoice.serviceProvider.provider = new EntityRef();
    }
    if (!orderInvoice.vehicleDetails) {
      orderInvoice.vehicleDetails = new VehicleDetails();
      if (!orderInvoice.vehicleDetails.vehicle) {
        orderInvoice.vehicleDetails.vehicle = new DataRef();
      }
      if (!orderInvoice.vehicleDetails.driver) {
        orderInvoice.vehicleDetails.driver = new DataRef();
      }
    }
    if (!orderInvoice.paymentDetail) {
      orderInvoice.paymentDetail = new PaymentDetail();
    }
    return orderInvoice;
  }

  async fetchStates() {
    var response = await this.cityStateProvider
      .fetchState(LocaleTypeEnum.ENGLISH)
      .then((optionConfigs: OptionConfig[]) => {
        this.states = this.cityStateProvider.fetchDataBasedOnLocale(
          optionConfigs,
          LocaleTypeEnum.ENGLISH
        );
      });

    var cities = await this.cityStateProvider
      .fetchCity("uttar_pradesh@in", LocaleTypeEnum.ENGLISH)
      .then((optionConfigs: OptionConfig[]) => {
        this.cities = this.cityStateProvider.fetchDataBasedOnLocale(
          optionConfigs,
          LocaleTypeEnum.ENGLISH
        );
      });
  }

  onError(msg: string) {
    this.toaster.showToastr("Opps!!!", msg, ToastMessageType.ERROR);
    this.isLoading = false;
    this.ngxService.stop();
  }

  getMobileNumberById(id: string) {
    if (!id) {
      return "";
    }
    return id.substr(id.indexOf("@") + 1);
  }

  getProviderNumber(provider: DataRef) {
    if (!provider) {
      return "";
    }
    if (provider && provider.id.includes("TAP_DRIVER")) {
      return provider.id.substr(provider.id.indexOf("@") + 1);
    } else {
      if (!this.providerNumber) {
        return this.providerNumber;
      }
      return "";
    }
  }

  async onStepperCompletion(stepper: MatStepper) {
    try {
      var result = this.updateVehicleDetailsInOrderInvoice(stepper, 4);
      this.outputEmitter.emit(this.updatedOrderInvoice);
      stepper.reset();
    } catch (error) {
      this.onError("Something went wrong. Please try later.");
    }
  }

  addMorePackage(addressIndex: number, isSource: boolean) {
    if (isSource) {
      this.orderInvoice.orderPickupSources[addressIndex].packages.push(
        new OrderPackage()
      );
    } else {
      this.orderInvoice.orderDeliveryLocations[addressIndex].packages.push(
        new OrderPackage()
      );
    }

    this.toaster.showToastr(
      "Info!",
      "New Package Field Added below",
      ToastMessageType.INFO
    );
  }

  addMoreLocation(isSource: boolean) {
    if (isSource) {
      let newPickupSource = new OrderPickupSource();
      newPickupSource.packages.push(new OrderPackage());
      this.orderInvoice.orderPickupSources.push(newPickupSource);
    } else {
      let newDropLocation = new OrderDeliveryLocation();
      newDropLocation.packages.push(new OrderPackage());
      newDropLocation.consigneeNotification = new ConsigneeNotificaton();
      newDropLocation.consigneeNotification.consigneeContact = new ContactDetails();
      this.orderInvoice.orderDeliveryLocations.push(newDropLocation);
    }

    this.toaster.showToastr(
      "Info!",
      "New Address Field Added below",
      ToastMessageType.INFO
    );
  }

  removeLocation(index: number, isSource: boolean) {
    if (isSource) {
      this.orderInvoice.orderPickupSources.splice(index, 1);
    } else {
      this.orderInvoice.orderDeliveryLocations.splice(index, 1);
    }
    this.toaster.showToastr(
      "Info",
      "Address removed. To save click 'Save & Next' button",
      ToastMessageType.INFO
    );
  }

  removePackage(addressIndex: number, packageIndex: number, isSource: boolean) {
    if (isSource) {
      this.orderInvoice.orderPickupSources[addressIndex].packages.splice(
        packageIndex,
        1
      );
    } else {
      this.orderInvoice.orderDeliveryLocations[addressIndex].packages.splice(
        packageIndex,
        1
      );
    }
    this.toaster.showToastr(
      "Info",
      "Package removed. To save click 'Save & Next' button",
      ToastMessageType.INFO
    );
  }

  updateLocalArea(localArea: string, i: number, isSource: boolean) {
    if (isSource) {
      let orderPickupSource = new OrderPickupSource();
      if (!this.orderInvoice.orderPickupSources) {
        this.orderInvoice.orderPickupSources = [];
      } else {
        if (i > this.orderInvoice.orderPickupSources.length - 1) {
          this.orderInvoice.orderPickupSources.push(orderPickupSource);
          orderPickupSource = this.orderInvoice.orderPickupSources[
            this.orderInvoice.orderPickupSources.length - 1
          ];
        } else {
          orderPickupSource = this.orderInvoice.orderPickupSources[i];
        }
      }
      if (!orderPickupSource.address) {
        orderPickupSource.address = new DetailedAddress();
      }
      orderPickupSource.address.localArea = localArea;
      if (this.orderInvoice.orderPickupSources.length > 0) {
        if (i > this.orderInvoice.orderPickupSources.length - 1) {
          this.orderInvoice.orderPickupSources[
            this.orderInvoice.orderPickupSources.length - 1
          ] = orderPickupSource;
        } else {
          this.orderInvoice.orderPickupSources[i] = orderPickupSource;
        }
      } else {
        this.orderInvoice.orderPickupSources.push(orderPickupSource);
      }
    } else {
      let orderDropLocation: OrderDeliveryLocation = new OrderDeliveryLocation();
      if (!this.orderInvoice.orderDeliveryLocations) {
        this.orderInvoice.orderDeliveryLocations = [];
      } else {
        if (i > this.orderInvoice.orderDeliveryLocations.length - 1) {
          this.orderInvoice.orderDeliveryLocations.push(orderDropLocation);
          orderDropLocation = this.orderInvoice.orderDeliveryLocations[
            this.orderInvoice.orderDeliveryLocations.length - 1
          ];
        } else {
          orderDropLocation = this.orderInvoice.orderDeliveryLocations[i];
        }
      }
      if (!orderDropLocation.address) {
        orderDropLocation.address = new DetailedAddress();
      }
      orderDropLocation.address.localArea = localArea;
      if (this.orderInvoice.orderDeliveryLocations.length > 0) {
        if (i > this.orderInvoice.orderDeliveryLocations.length - 1) {
          this.orderInvoice.orderDeliveryLocations[
            this.orderInvoice.orderDeliveryLocations.length - 1
          ] = orderDropLocation;
        } else {
          this.orderInvoice.orderDeliveryLocations[i] = orderDropLocation;
        }
      } else {
        this.orderInvoice.orderDeliveryLocations.push(orderDropLocation);
      }
    }
  }

  showCityLabel(index: number, isSource: boolean) {
    if (isSource) {
      if (!this.orderInvoice.orderPickupSources[index].address) {
        return false;
      } else if (
        this.copyOrderInvoice.orderPickupSources[index] &&
        this.orderInvoice.orderPickupSources[index].address.state !=
          this.copyOrderInvoice.orderPickupSources[index].address.state
      ) {
        return false;
      } else if (
        this.orderInvoice.orderPickupSources.length >
          this.copyOrderInvoice.orderPickupSources.length &&
        !this.copyOrderInvoice.orderPickupSources[index]
      ) {
        return false;
      }
      return true;
    } else {
      if (!this.orderInvoice.orderDeliveryLocations[index].address) {
        return false;
      }
      if (
        this.copyOrderInvoice.orderDeliveryLocations[index] &&
        this.orderInvoice.orderDeliveryLocations[index].address.state !=
          this.copyOrderInvoice.orderDeliveryLocations[index].address.state
      ) {
        return false;
      } else if (
        this.orderInvoice.orderDeliveryLocations.length >
          this.copyOrderInvoice.orderDeliveryLocations.length &&
        !this.copyOrderInvoice.orderDeliveryLocations[index]
      ) {
        return false;
      }
      return true;
    }
  }

  async onStateChange(stateId: string, index: number, isSource: boolean) {
    let currentSelectedStateId;
    if (isSource) {
      currentSelectedStateId = this.selectedState(
        this.orderInvoice.orderPickupSources[index].address.state
      );
    } else {
      currentSelectedStateId = this.selectedState(
        this.orderInvoice.orderDeliveryLocations[index].address.state
      );
    }
    if (isSource && stateId == currentSelectedStateId) {
      return;
    } else if (!isSource && stateId == currentSelectedStateId) {
      return;
    } else if (
      isSource &&
      !this.orderInvoice.orderPickupSources[index].address
    ) {
      return false;
    } else if (
      !isSource &&
      !this.orderInvoice.orderDeliveryLocations[index].address
    ) {
      return false;
    }
    if (!this.lastStateIdFetched || this.lastStateIdFetched != stateId) {
      this.lastStateIdFetched = stateId;
      var cityResponse = await this.cityStateProvider
        .fetchCity(stateId, LocaleTypeEnum.ENGLISH)
        .then((optionConfigs: OptionConfig[]) => {
          this.cities = this.cityStateProvider.fetchDataBasedOnLocale(
            optionConfigs,
            LocaleTypeEnum.ENGLISH
          );
        });
    } else {
      //nothing
    }
    if (isSource) {
      let orderPickupLocation: OrderPickupSource = new OrderPickupSource();
      if (!this.orderInvoice.orderPickupSources) {
        this.orderInvoice.orderPickupSources = [];
      } else {
        if (index > this.orderInvoice.orderDeliveryLocations.length - 1) {
          orderPickupLocation = this.orderInvoice.orderPickupSources[
            this.orderInvoice.orderPickupSources.length - 1
          ];
        } else {
          orderPickupLocation = this.orderInvoice.orderPickupSources[index];
        }
      }
      if (!orderPickupLocation.address) {
        orderPickupLocation.address = new DetailedAddress();
      }
      orderPickupLocation.address.state = this.states.get(stateId).toString();
      if (this.orderInvoice.orderPickupSources.length > 0) {
        if (index > this.orderInvoice.orderPickupSources.length - 1) {
          this.orderInvoice.orderPickupSources[
            this.orderInvoice.orderPickupSources.length - 1
          ] = orderPickupLocation;
        } else {
          this.orderInvoice.orderPickupSources[index] = orderPickupLocation;
        }
      } else {
        this.orderInvoice.orderPickupSources.push(orderPickupLocation);
      }
    } else {
      let orderDropLocation: OrderDeliveryLocation = new OrderDeliveryLocation();
      if (!this.orderInvoice.orderDeliveryLocations) {
        this.orderInvoice.orderDeliveryLocations = [];
      } else {
        if (index > this.orderInvoice.orderDeliveryLocations.length - 1) {
          orderDropLocation = this.orderInvoice.orderDeliveryLocations[
            this.orderInvoice.orderDeliveryLocations.length - 1
          ];
        } else {
          orderDropLocation = this.orderInvoice.orderDeliveryLocations[index];
        }
      }
      if (!orderDropLocation.address) {
        orderDropLocation.address = new DetailedAddress();
      }
      orderDropLocation.address.state = this.states.get(stateId).toString();
      if (this.orderInvoice.orderDeliveryLocations.length > 0) {
        if (index > this.orderInvoice.orderDeliveryLocations.length - 1) {
          this.orderInvoice.orderDeliveryLocations[
            this.orderInvoice.orderDeliveryLocations.length - 1
          ] = orderDropLocation;
        } else {
          this.orderInvoice.orderDeliveryLocations[index] = orderDropLocation;
        }
      } else {
        this.orderInvoice.orderDeliveryLocations.push(orderDropLocation);
      }
    }
    return;
  }

  selectedState(state: string) {
    for (let [key, value] of this.states.entries()) {
      if (value === state) return key;
    }
  }

  async onCityChange(cityId: string, index: number, isSource: boolean) {
    if (isSource) {
      let orderPickUpLocation: OrderPickupSource;
      if (index > this.orderInvoice.orderPickupSources.length) {
        orderPickUpLocation = this.orderInvoice.orderPickupSources[
          this.orderInvoice.orderPickupSources.length - 1
        ];
      } else {
        orderPickUpLocation = this.orderInvoice.orderPickupSources[index];
      }
      orderPickUpLocation.address.city = this.cities.get(cityId).toString();
    } else {
      let orderDeliveryLocation: OrderDeliveryLocation;
      if (index > this.orderInvoice.orderDeliveryLocations.length) {
        orderDeliveryLocation = this.orderInvoice.orderDeliveryLocations[
          this.orderInvoice.orderDeliveryLocations.length - 1
        ];
      } else {
        orderDeliveryLocation = this.orderInvoice.orderDeliveryLocations[index];
      }
      orderDeliveryLocation.address.city = this.cities.get(cityId).toString();
    }
  }

  onChangeArrivalTime(index: number, isSource: boolean) {
    if (isSource) {
      if (!this.orderInvoice.orderPickupSources[index].timeStats) {
        this.orderInvoice.orderPickupSources[
          index
        ].timeStats = new DeliveryOperationTimeStats();
      }
      this.orderInvoice.orderPickupSources[index].timeStats.type =
        DeliveryOperationTypeEnum.PICKUP;
      if (!this.orderInvoice.orderPickupSources[index].timeStats) {
        this.orderInvoice.orderPickupSources[
          index
        ].timeStats = new DeliveryOperationTimeStats();
      }
      this.orderInvoice.orderPickupSources[
        index
      ].timeStats.arrivalTime = this.dateTimeProvider.getMillis(
        this.arrivalTime
      );
    } else {
      if (!this.orderInvoice.orderDeliveryLocations[index].timeStats) {
        this.orderInvoice.orderDeliveryLocations[
          index
        ].timeStats = new DeliveryOperationTimeStats();
      }
      this.orderInvoice.orderDeliveryLocations[index].timeStats.type =
        DeliveryOperationTypeEnum.DELIVERY;
      if (!this.orderInvoice.orderDeliveryLocations[index].timeStats) {
        this.orderInvoice.orderDeliveryLocations[
          index
        ].timeStats = new DeliveryOperationTimeStats();
      }
      this.orderInvoice.orderDeliveryLocations[
        index
      ].timeStats.arrivalTime = this.dateTimeProvider.getMillis(
        this.arrivalTime
      );
    }
  }

  onChangeWorkStartTime(index: number, isSource: boolean) {
    if (isSource) {
      if (
        !this.orderInvoice.orderPickupSources[index].timeStats ||
        this.orderInvoice.orderPickupSources[index].timeStats.arrivalTime == 0
      ) {
        this.onError("Arrival Time is not yet marked");
        return;
      }
      if (!this.orderInvoice.orderPickupSources[index].timeStats) {
        this.orderInvoice.orderPickupSources[
          index
        ].timeStats = new DeliveryOperationTimeStats();
      }
      this.orderInvoice.orderPickupSources[
        index
      ].timeStats.workStart = this.dateTimeProvider.getMillis(
        this.workStartTime
      );
    } else {
      if (
        !this.orderInvoice.orderDeliveryLocations[index].timeStats ||
        this.orderInvoice.orderDeliveryLocations[index].timeStats.arrivalTime ==
          0
      ) {
        this.onError("Arrival Time is not yet marked");
        return;
      }
      if (!this.orderInvoice.orderDeliveryLocations[index].timeStats) {
        this.orderInvoice.orderDeliveryLocations[
          index
        ].timeStats = new DeliveryOperationTimeStats();
      }
      this.orderInvoice.orderDeliveryLocations[
        index
      ].timeStats.workStart = this.dateTimeProvider.getMillis(
        this.workStartTime
      );
    }
  }
  onChangeWorkEndTime(index: number, isSource: boolean) {
    if (isSource) {
      if (
        !this.orderInvoice.orderPickupSources[index].timeStats ||
        this.orderInvoice.orderPickupSources[index].timeStats.arrivalTime == 0
      ) {
        this.onError("Arrival Time is not yet marked");
        return;
      } else if (
        !this.orderInvoice.orderPickupSources[index].timeStats ||
        this.orderInvoice.orderPickupSources[index].timeStats.workStart == 0
      ) {
        this.onError("Work Start Time is not yet marked");
        return;
      }
      if (!this.orderInvoice.orderPickupSources[index].timeStats) {
        this.orderInvoice.orderPickupSources[
          index
        ].timeStats = new DeliveryOperationTimeStats();
      }
      this.orderInvoice.orderPickupSources[
        index
      ].timeStats.workEnd = this.dateTimeProvider.getMillis(this.workEndTime);
    } else {
      if (
        !this.orderInvoice.orderDeliveryLocations[index].timeStats ||
        this.orderInvoice.orderDeliveryLocations[index].timeStats.arrivalTime ==
          0
      ) {
        this.onError("Arrival Time is not yet marked");
        return;
      } else if (
        !this.orderInvoice.orderDeliveryLocations[index].timeStats ||
        this.orderInvoice.orderDeliveryLocations[index].timeStats.workStart == 0
      ) {
        this.onError("Work Start Time is not yet marked");
        return;
      }
      if (!this.orderInvoice.orderDeliveryLocations[index].timeStats) {
        this.orderInvoice.orderDeliveryLocations[
          index
        ].timeStats = new DeliveryOperationTimeStats();
      }
      this.orderInvoice.orderDeliveryLocations[
        index
      ].timeStats.workEnd = this.dateTimeProvider.getMillis(this.workEndTime);
    }
  }

  onChangeHaltTime(index: number, isStartTime: boolean) {
    if (isStartTime) {
      this.orderInvoice.orderDeliveryLocations[
        index
      ].charges.haltCharge.duration.startTimeInMillis = this.dateTimeProvider.getMillis(
        this.haltingTime
      );
    } else {
      this.orderInvoice.orderDeliveryLocations[
        index
      ].charges.haltCharge.duration.endTimeInMillis = this.dateTimeProvider.getMillis(
        this.haltingTime
      );
    }
  }

  addGSTAmount(gst) {
    gst = +gst;
    // this.orderInvoice.paymentDetail.totalAmount =
    //   +this.orderInvoice.paymentDetail.totalAmount -
    //   +this.orderInvoice.paymentDetail.gstTax;
    this.orderInvoice.paymentDetail.gstTax =
      (+this.orderInvoice.paymentDetail.freightCharge * gst) / 100;
    // this.orderInvoice.paymentDetail.totalAmount =
    //   +this.orderInvoice.paymentDetail.totalAmount -
    //   +this.orderInvoice.paymentDetail.gstTax;
    this.getTotalFrieghtAmount();
  }

  onChangeDriverFare() {
    if (
      +this.orderInvoice.paymentDetail.driverFare >
      +this.orderInvoice.paymentDetail.freightCharge
    ) {
      this.orderInvoice.paymentDetail.driverFare =
        +this.orderInvoice.paymentDetail.driverFare * 0;
      this.orderInvoice.paymentDetail.tdsAmount =
        +this.orderInvoice.paymentDetail.tdsAmount * 0;
      this.orderInvoice.paymentDetail.remainingAmount =
        +this.orderInvoice.paymentDetail.remainingAmount * 0;
      this.orderInvoice.paymentDetail.totalAmount =
        +this.orderInvoice.paymentDetail.totalAmount * 0;
      this.onError("Amount must not be greater than Freight Amount");
      return;
    } else {
      this.calculateTotal();
      this.orderInvoice.paymentDetail.tdsAmount =
        0.01 * +this.orderInvoice.paymentDetail.driverFare;
      this.orderInvoice.paymentDetail.dieselFare =
        +this.orderInvoice.paymentDetail.dieselFare * 0;
      this.orderInvoice.paymentDetail.remainingAmount =
        +this.orderInvoice.paymentDetail.driverFare -
        +this.orderInvoice.paymentDetail.advance -
        +this.orderInvoice.paymentDetail.tdsAmount;
    }
  }

  onChangeDieselFare() {
    if (
      +this.orderInvoice.paymentDetail.dieselFare >
      +this.orderInvoice.paymentDetail.freightCharge
    ) {
      this.orderInvoice.paymentDetail.dieselFare =
        +this.orderInvoice.paymentDetail.dieselFare * 0;
      this.orderInvoice.paymentDetail.remainingAmount =
        +this.orderInvoice.paymentDetail.remainingAmount * 0;
      this.orderInvoice.paymentDetail.totalAmount =
        +this.orderInvoice.paymentDetail.totalAmount * 0;
      this.onError("Amount must not be greater than Freight Amount");
      return;
    } else {
      this.calculateTotal();
      this.orderInvoice.paymentDetail.driverFare =
        +this.orderInvoice.paymentDetail.driverFare * 0;
      this.orderInvoice.paymentDetail.tdsAmount =
        +this.orderInvoice.paymentDetail.tdsAmount * 0;
      this.orderInvoice.paymentDetail.remainingAmount =
        +this.orderInvoice.paymentDetail.dieselFare -
        +this.orderInvoice.paymentDetail.advance -
        +this.orderInvoice.paymentDetail.tdsAmount;
    }
  }

  addExtraCharges() {
    if (+this.orderInvoice.paymentDetail.driverFare == 0) {
      this.onError("Driver Amount must not be zero");
      return;
    } else {
      this.orderInvoice.paymentDetail.totalAmount =
        +this.orderInvoice.paymentDetail.totalAmount - +this.totalExtraAmount;
      this.orderInvoice.paymentDetail.remainingAmount =
        +this.orderInvoice.paymentDetail.remainingAmount -
        +this.totalExtraAmount;
      this.totalExtraAmount =
        +this.orderInvoice.paymentDetail.haltTimeCharge +
        +this.orderInvoice.paymentDetail.labourCharge +
        +this.orderInvoice.paymentDetail.tollAmount -
        +this.orderInvoice.paymentDetail.fine;
      // -+this.orderInvoice.paymentDetail.discount;
      this.orderInvoice.paymentDetail.totalAmount =
        +this.orderInvoice.paymentDetail.totalAmount + +this.totalExtraAmount;
      this.orderInvoice.paymentDetail.remainingAmount =
        +this.orderInvoice.paymentDetail.remainingAmount +
        +this.totalExtraAmount;
    }
  }

  onChangeDiscount() {
    if (
      (+this.orderInvoice.paymentDetail.driverFare != 0 &&
        +this.orderInvoice.paymentDetail.discount >
          +this.orderInvoice.paymentDetail.freightCharge -
            +this.orderInvoice.paymentDetail.driverFare) ||
      (+this.orderInvoice.paymentDetail.dieselFare != 0 &&
        +this.orderInvoice.paymentDetail.discount >
          +this.orderInvoice.paymentDetail.freightCharge -
            +this.orderInvoice.paymentDetail.dieselFare)
    ) {
      this.onError("Discount Amount exceeds limit");
      this.orderInvoice.paymentDetail.discount =
        +this.orderInvoice.paymentDetail.discount * 0;
    } else {
      this.getTotalFrieghtAmount();
    }
  }

  getTotalFrieghtAmount() {
    this.totalFrieghtAmount =
      +this.orderInvoice.paymentDetail.freightCharge +
      +this.orderInvoice.paymentDetail.gstTax -
      +this.orderInvoice.paymentDetail.discount;
  }

  onChangeAdvanceAmount() {
    if (
      +this.orderInvoice.paymentDetail.driverFare == 0 &&
      +this.orderInvoice.paymentDetail.dieselFare == 0
    ) {
      this.onError("Amount must not be zero");
      return;
    } else {
      if (+this.orderInvoice.paymentDetail.driverFare == 0) {
        this.orderInvoice.paymentDetail.remainingAmount =
          +this.orderInvoice.paymentDetail.dieselFare -
          +this.orderInvoice.paymentDetail.advance;
      } else {
        this.orderInvoice.paymentDetail.remainingAmount =
          +this.orderInvoice.paymentDetail.driverFare -
          +this.orderInvoice.paymentDetail.advance -
          +this.orderInvoice.paymentDetail.tdsAmount;
      }
    }
  }
  onChangeFreightCharge() {
    var gst;
    this.totalFrieghtAmount = +this.orderInvoice.paymentDetail.freightCharge;
    if (+this.orderInvoice.paymentDetail.freightCharge == 0) {
      gst = 0;
    } else {
      gst = Math.floor(
        (+this.orderInvoice.paymentDetail.gstTax * 100) /
          +this.orderInvoice.paymentDetail.freightCharge
      );
    }
    this.addGSTAmount(gst);
  }

  calculateTotal() {
    if (+this.orderInvoice.paymentDetail.driverFare == 0) {
      this.orderInvoice.paymentDetail.totalAmount =
        +this.orderInvoice.paymentDetail.dieselFare +
        // +this.orderInvoice.paymentDetail.gstTax +
        +this.orderInvoice.paymentDetail.fine +
        +this.orderInvoice.paymentDetail.haltTimeCharge +
        +this.orderInvoice.paymentDetail.labourCharge +
        -+this.orderInvoice.paymentDetail.discount;
    } else {
      this.orderInvoice.paymentDetail.totalAmount =
        +this.orderInvoice.paymentDetail.driverFare +
        // +this.orderInvoice.paymentDetail.gstTax +
        +this.orderInvoice.paymentDetail.fine +
        +this.orderInvoice.paymentDetail.haltTimeCharge +
        +this.orderInvoice.paymentDetail.labourCharge +
        -+this.orderInvoice.paymentDetail.discount;
    }
  }
}
