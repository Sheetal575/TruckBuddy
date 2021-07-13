import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import * as moment from "moment-timezone";
import { DataRef } from "src/app/core/models/dataRef.class";
import { StorageService } from "src/app/core/storage-service/storage.service";
import { VehicleCategorySearchRequest } from "src/app/models/vehicle-category/vehicle-category-search-req.class";
import { VehicleCategory } from "src/app/models/vehicle-category/vehicle-category.class";
import { Location } from "./../../../core/models/geo-coding-response.class";
import { OptionConfig } from "./../../../core/models/option-config.class";
import {
  CityStateProvider,
  LocaleTypeEnum,
} from "./../../../core/utils/city-state.helper";
import { DateTimeProvider } from "./../../../core/utils/date-time.provider";
import { GeoLocationService } from "./../../../core/utils/geo-location.service";
import {
  ToastMessage,
  ToastMessageType,
} from "./../../../core/utils/toastr-message.helper";
import { BookingRequest } from "./../../../models/booking-request/booking-request.class";
import {
  LoadTypeEnum,
  LoadTypeFormatter,
} from "./../../../models/enums/load-type.enum";
import { ProfileSearchReq } from "./../../../models/profile/profile-search-req.class";
import { ProfileTypeEnum } from "./../../../models/profile/profile-type.enum";
import { Profile } from "./../../../models/profile/profile.class";
import { BookingRequestService } from "./../../../services/booking-request.service";
import { ProfileService } from "./../../../services/profile.service";
import { VehicleCategoryService } from "./../../../services/vehicle-category.service";
import { DetailedAddress } from "../../../models/detailed-address.class";
import { GeoAddress } from "src/app/models/geolocation.class";
import { BusinessService } from "../../../services/business.service";
import { BusinessDesignSRequest } from "../../../models/business/business-search-req.class";
import { BusinessTypeEnum } from "../../../models/enums/business-type.enum";
import { BusinessOwnership } from "src/app/models/business/business-ownership.class";
import { BusinessDesign } from "../../../models/business/business-design.class";

@Component({
  selector: "app-create-booking",
  templateUrl: "./create-booking.component.html",
  styleUrls: ["./create-booking.component.sass"],
})
export class CreateBookingComponent implements OnInit {
  heading = "Create New Booking";
  subheading =
    "Create a new booking for others and on the behalf of your clients";
  icon = "pe-7s-portfolio text-success";

  vehicleTypes: Map<string, string> = new Map();
  loadTypes: Map<LoadTypeEnum, string> = new Map();
  cities: Map<string, string> = new Map();
  states: Map<string, string> = new Map();
  booking: BookingRequest;
  profile: Profile;
  clientName: string = "";
  destinations = [0];
  bookingDateTime: string = "";
  public minDate: moment.Moment;
  public maxDate: moment.Moment;
 forcevehicleBooking:boolean;
 state=null;
 city=null;
  constructor(
    private vehicleCategoryService: VehicleCategoryService,
    private loadTypeFormatter: LoadTypeFormatter,
    private storage: StorageService,
    private cityStateProvider: CityStateProvider,
    private profileService: ProfileService,
    private toaster: ToastMessage,
    private dateTimeProvider: DateTimeProvider,
    private bookingRequestService: BookingRequestService,
    private router: Router,
    private geoLocationService: GeoLocationService,
    private businessService: BusinessService
  ) {}

  addMoreDestinations() {
    this.destinations.push(this.destinations.length + 1);
    this.booking.destinations.push(new DetailedAddress());
  }

  removeDestination(i: number) {
    this.destinations.splice(i, 1);
    this.booking.destinations.splice(i, 1);
  }

  async ngOnInit() {
    await this.getVehicleCategories();
    await this.getLoadTypes();
    await this.getStates();
    this.profile = this.storage.get("profile");
    if (!this.booking) {
      this.booking = new BookingRequest();
    }
  }

  async getStates() {
    await this.cityStateProvider
      .fetchState(LocaleTypeEnum.ENGLISH)
      .then((optionConfigs: OptionConfig[]) => {
        this.states = this.cityStateProvider.fetchDataBasedOnLocale(
          optionConfigs,
          LocaleTypeEnum.ENGLISH
        );
      });
  }

  async findClient(clientNumber: string) {
    if (clientNumber) {
      let profileSearchReq = new ProfileSearchReq();
      profileSearchReq.mobile = clientNumber;
      profileSearchReq.profileType = ProfileTypeEnum.CLIENT_MANAGER;
      this.profileService
        .customSearchProfile(profileSearchReq)
        .toPromise()
        .then(async (profile: Profile[]) => {
          if (profile.length > 0) {
            // this.clientName = profile[0].fullName;
            // this.booking.clientRef = new DataRef();
            // this.booking.clientRef.id = profile[0].id;
            // this.booking.clientRef.name = profile[0].fullName;
            const businessSReq = new BusinessDesignSRequest();
            businessSReq.businessType = BusinessTypeEnum.CLIENT;
            businessSReq.businessOwnership = new BusinessOwnership();
            businessSReq.businessOwnership.profileRef = new DataRef();
            businessSReq.businessOwnership.profileRef.id = profile[0].id;
            // businessSReq.businessOwnership.profileRef.name =
            //   profile[0].fullName;
            try {
              var business = (await this.businessService
                .customSearchBusiness(businessSReq)
                .toPromise()) as BusinessDesign[];
              if (business.length > 0) {
                this.createBookingRequest(profile[0]);
                this.clientName = business[0].businessName;
                this.booking.clientRef = new DataRef();
                this.booking.clientRef.id = business[0].id;
                this.booking.clientRef.name = business[0].businessName;
              } else {
                this.clientName = "";
                this.booking.clientRef = new DataRef();
                this.booking.clientRef.id = "";
                this.booking.clientRef.name = "";
                this.onError(
                  "No Business Profile found with number :- " + clientNumber
                );
              }
            } catch (error) {
              this.clientName = "";
              this.booking.clientRef = new DataRef();
              this.booking.clientRef.id = "";
              this.booking.clientRef.name = "";
              this.onError(
                "No Client Manager Profile found with number :- " + clientNumber
              );
            }
          } else {
            this.clientName = "";
            this.booking.clientRef = new DataRef();
            this.booking.clientRef.id = "";
            this.booking.clientRef.name = "";
            this.onError(
              "No Client Manager Profile found with number :- " + clientNumber
            );
          }
        })
        .catch((error) => {
          this.clientName = "";
          this.booking.clientRef = new DataRef();
          this.booking.clientRef.id = "";
          this.booking.clientRef.name = "";
          this.onError("Something went wrong. Please try later.");
        });
    } else {
      this.clientName = "";
      this.booking.clientRef = new DataRef();
      this.booking.clientRef.id = "";
      this.booking.clientRef.name = "";
      this.onError("Enter Client Number");
    }
  }

  updateLocalArea(localArea: string, i: number, isSource: boolean) {
    
    if (isSource) { //testing
      if (!this.booking.source) {
        this.booking.source = new DetailedAddress();
      }
      this.booking.source.localArea = localArea;
      // if(!this.forcevehicleBooking){

      // }
    } else {
      let destination: DetailedAddress = new DetailedAddress();
      if (!this.booking.destinations) {
        this.booking.destinations = [];
        
      } else {
        
        if (i > this.booking.destinations.length - 1) {
          console.log(this.booking.destinations.length);
          this.booking.destinations.push(destination);
          destination = this.booking.destinations[
            this.booking.destinations.length - 1
          ];
        } else {
          destination = this.booking.destinations[i];
        }
      }
      destination.localArea = localArea;
      if (this.booking.destinations.length > 0) {
        if (i > this.booking.destinations.length - 1) {
          this.booking.destinations[
            this.booking.destinations.length - 1
          ] = destination;
        } else {
          this.booking.destinations[i] = destination;
        }
      } else {
        this.booking.destinations.push(destination);
      }
    }
  }

  async onStateChange(stateId: string, isSource: boolean, index: number) {
    var cityResponse = await this.cityStateProvider
      .fetchCity(stateId, LocaleTypeEnum.ENGLISH)
      .then((optionConfigs: OptionConfig[]) => {
        this.cities = this.cityStateProvider.fetchDataBasedOnLocale(
          optionConfigs,
          LocaleTypeEnum.ENGLISH
        );
      });
      
    if (isSource) {
      if (!this.booking.source) {
        this.booking.source = new DetailedAddress();
      }
      this.booking.source.state = this.states.get(stateId).toString();
      this.state = this.booking.source.state;
      this.booking.source.city = null;
    } else {
      let destination: DetailedAddress = new DetailedAddress();
      if (!this.booking.destinations) {
        this.booking.destinations = [];
      } else {
        if (index > this.booking.destinations.length) {
          destination = this.booking.destinations[
            this.booking.destinations.length - 1
          ];
        } else {
          destination = this.booking.destinations[index];
        }
      }
      
      destination.state = this.states.get(stateId).toString();
      destination.city = null;
      if (this.booking.destinations.length > 0) {
        if (index > this.booking.destinations.length) {
          this.booking.destinations[
            this.booking.destinations.length - 1
          ] = destination;
        } else {
          this.booking.destinations[index] = destination;
        }
      } else {
        this.booking.destinations.push(destination);
      }
    }
  }



  async onCityChange(cityId: string, isSource: boolean, index: number) {
    if (isSource) {
      this.booking.source.city = this.cities.get(cityId).toString();
      
    } else {
      let destination;
      if (index > this.booking.destinations.length) {
        destination = this.booking.destinations[
          this.booking.destinations.length - 1
        ];
      } else {
        destination = this.booking.destinations[index];
      }
      destination.city = this.cities.get(cityId).toString();
      this.city = this.booking.source.city;
    }
  }

  async onVehicleChange(vehicle: string) {
    this.booking.vehicleCategoryId = vehicle.toString();
  }

  async createBooking() {
    console.log(this.booking);
    let isError: boolean = false;
    if (!this.booking.source || !this.booking.source.localArea) {
      this.onError("Enter Source Address");
      return;
    } else if (!this.booking.source.state) {
      this.onError("Enter Source State");
      return;
    } else if (!this.booking.source.city) {
      this.onError("Enter Source City");
      return;
    }
    if (!this.forcevehicleBooking) {
      if (this.booking.destinations.length > 0) {
      this.booking.destinations.forEach((destination) => {
        if (!destination.localArea) {
          this.onError("Enter Destination Address");
          isError = true;
          return;
        } else if (!destination.state) {
          this.onError("Enter Destination State");
          isError = true;
          return;
        } else if (!destination.city) {
          this.onError("Enter Destination City");
          isError = true;
          return;
        }
      });
    } 
    }
     
     if (!this.bookingDateTime) {
      this.onError("Select Booking Date & Time");
      return;
    } else if (!this.booking.vehicleCategoryId) {
      this.onError("Select Vehicle Category");
      return;
    } else if (this.isHCV && !this.booking.proposalMoney) {
      // this.onError("Enter Proposal Amount");
      // return;
    } else if (!this.booking.clientRef) {
      this.onError("Enter Client Number");
      return;
    } else if (!this.clientName) {
      this.onError("Enter Client Name");
      return;
    }
    if (isError) {
      return;
    } else {
      var sourceLocation = await this.geoLocationService.getGeoLocation(
        this.booking.source
      );
      this.booking.source.geoAddress = new GeoAddress();
      this.booking.source.geoAddress.type = "Point";
      this.booking.source.geoAddress.coordinates = [];
      this.booking.source.geoAddress.coordinates.push(
        (sourceLocation as Location).lng
      );
      this.booking.source.geoAddress.coordinates.push(
        (sourceLocation as Location).lat
      );
      if (!this.forcevehicleBooking) {
        for (let index = 0; index < this.booking.destinations.length; index++) {
          var destinationGeoLocation = await this.geoLocationService.getGeoLocation(
            this.booking.destinations[index]
          );
          this.booking.destinations[index].geoAddress = new GeoAddress();
          this.booking.destinations[index].geoAddress.type = "Point";
          this.booking.destinations[index].geoAddress.coordinates = [];
          this.booking.destinations[index].geoAddress.coordinates.push(
            (destinationGeoLocation as Location).lng
          );
          this.booking.destinations[index].geoAddress.coordinates.push(
            (destinationGeoLocation as Location).lat
          );
        }
      }
      

      this.booking.requestedTime = this.dateTimeProvider.getMillis(
        this.bookingDateTime
      ); 
      this.booking.deviceId = "ADMIN";
      try {
        var bookingCreated = await this.bookingRequestService
          .createBookingRequest(this.booking)
          .toPromise();
          // console.log(bookingCreated);
        this.toaster.showToastr(
          "Success", 
          "Booking created successfully",
          ToastMessageType.SUCCESS
        );
        this.router.navigate(["../../pages/login-boxed"]);
      } catch (err) {
        if (err.error.message == "Invalid requested time") {
          this.onError("Invalid Booking request time");
        } else if (err.error.message.includes("vehicleCategoryId")) {
          this.onError("Select Vehicle Type");
        } else if (err.error.message.includes("clientRef")) {
          this.clientName = "";
          this.onError("Enter Client Number");
        } else {
          this.onError("Something went wrong. Please try later.");
        }
      }
    }
  }

  createBookingRequest(profile: Profile) {
    // this.booking = new BookingRequest();
    this.booking.requestedByRef = new DataRef();
    this.booking.requestedByRef.id = profile.id;
    this.booking.requestedByRef.name = profile.fullName;
  }

  isFieldValid(form: FormGroup, field: string, validationName: string) {
    return form.get(field).touched && form.get(field).hasError(validationName);
  }

  async getVehicleCategories() {
    let vehicleCategorySReq = new VehicleCategorySearchRequest();
    this.vehicleCategoryService
      .customSearchVehicleCategory(vehicleCategorySReq)
      .subscribe((vehicleCategories: VehicleCategory[]) => {
        vehicleCategories.forEach((category) => {
          this.vehicleTypes.set(
            category.id,
            this.vehicleCategoryReferenceText(category.referenceTexts)
          );
        });
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

  async getLoadTypes() {
    let loads: LoadTypeEnum[] = [];
    loads.push(LoadTypeEnum.FMCG);
    loads.push(LoadTypeEnum.FURNITURE);
    loads.push(LoadTypeEnum.BEVERAGES);
    loads.push(LoadTypeEnum.GLASS);
    loads.forEach((load) => {
      this.loadTypes.set(load, this.loadTypeFormatter.format(load));
    });
  }

  onError(msg: string) {
    this.toaster.showToastr("Oops!!!", msg, ToastMessageType.ERROR);
    return;
  }

  isHCV(): boolean {
    if (this.booking && this.booking.vehicleCategoryId) {
      let wheelNumber = Number(this.booking.vehicleCategoryId.split("_")[1]);
      if (wheelNumber > 4) {
        return true;
      }
    }
    return false;
  }

  addProposalAmount(proposalAmount: string) {
    this.booking.proposalMoney = Number(proposalAmount);
  }

  //for force vehicle booking-----
  
  onchangeforceVehicleBooking(value:boolean){
      this.forcevehicleBooking = value;
      if(this.forcevehicleBooking){
        this.updateLocalArea("NO DESTINATION",0,false);
        this.onStateChange(this.state, false, 0);
        this.onCityChange(this.city, false, 0 )

      }
  }
}
