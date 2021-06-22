import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
} from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatStepper } from "@angular/material";
import { DataRef } from "src/app/core/models/dataRef.class";
import { ProfileTypeEnum } from "src/app/models/profile/profile-type.enum";
import {
  ToastMessage,
  ToastMessageType,
} from "./../../../core/utils/toastr-message.helper";
import { BusinessDesign } from "./../../../models/business/business-design.class";
import { BusinessOwnership } from "./../../../models/business/business-ownership.class";
import { BusinessTypeEnum } from "./../../../models/enums/business-type.enum";
import { ProfileSearchReq } from "./../../../models/profile/profile-search-req.class";
import { BusinessService } from "./../../../services/business.service";
import { ProfileService } from "./../../../services/profile.service";
import {
  LocaleTypeEnum,
  CityStateProvider,
} from "../../../core/utils/city-state.helper";
import { OptionConfig } from "../../../core/models/option-config.class";
import { Profile } from "../../../models/profile/profile.class";
import { BusinessDesignSRequest } from "../../../models/business/business-search-req.class";
import { Output, EventEmitter } from "@angular/core";
import { DetailedAddress } from '../../../models/detailed-address.class';

@Component({
  selector: "app-add-business",
  templateUrl: "./add-business.component.html",
  styleUrls: ["./add-business.component.sass"],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class AddBusinessComponent implements OnInit {
  @Input() mobile: string;
  @Input() businessType: BusinessTypeEnum;
  @Input() id: string;
  @Output() outputEmitter = new EventEmitter<BusinessDesign>();
  @ViewChild("stepper") stepper;
  address: FormGroup;
  contact: FormGroup;
  loadProfileForm: boolean = false;
  isLoading: boolean = false;
  businessTypes: Map<BusinessTypeEnum, string> = new Map();
  selectedBusiness: BusinessTypeEnum;
  businessForm: FormGroup;
  businessOwnerships: FormArray = new FormArray([new FormControl()]);
  profile: Profile;
  profileSearchReq: ProfileSearchReq;
  createOrUpdateBusiness: BusinessDesign;
  isStateChanged: boolean;
  selectedStateId: string;
  cities: Map<string, string> = new Map();
  states: Map<string, string> = new Map();

  heading = "Add Business";
  subheading = "To Add Business";
  icon = "pe-7s-fa-handshake-o icon-gradient bg-sunny-morning";

  constructor(
    private _formBuilder: FormBuilder,
    private profileService: ProfileService,
    private toaster: ToastMessage,
    private businessService: BusinessService,
    private cityStateProvider: CityStateProvider,
    private detectChange: ChangeDetectorRef
  ) {}

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
    this.isStateChanged = true;
    this.businessForm.get("address").patchValue({
      state: this.states.get(stateId),
    });
    var fetchState = await this.cityStateProvider
      .fetchCity(stateId, LocaleTypeEnum.ENGLISH)
      .then((optionConfigs: OptionConfig[]) => {
        this.cities = this.cityStateProvider.fetchDataBasedOnLocale(
          optionConfigs,
          LocaleTypeEnum.ENGLISH
        );
      });
      this.detectChange.detectChanges();
  }

  async onCityChange(city: string) {
    this.businessForm.get("address").patchValue({
      city: city,
    });
  }

  async ngOnInit() {
    this.isLoading = true;
    await this.getStates();
    this.addBusinessTypes();
    this.contact = this._formBuilder.group({
      mobile: [
        "",
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
    });

    this.address = this._formBuilder.group({
      localArea: ["", Validators.required],
      city: ["", Validators.required],
      state: ["", Validators.required],
    });

    this.businessForm = this._formBuilder.group({
      businessName: ["", Validators.required],
      businessOwnerships: this.businessOwnerships,
      businessType: [""],
      gst: ["", Validators.required],
      contact: this._formBuilder.group({
        email: [
          "",
          [
            Validators.email,
            Validators.required,
            Validators.pattern(
              /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            ),
          ],
        ],
        mobile: ["", [Validators.required]],
      }),
      address: this.address,
    });
    if (this.mobile && this.businessType) {
      this.findProfile(this.stepper);
    }
    if (this.id) {
      this.findBusiness(this.stepper);
    }
    this.isLoading = false;
    this.detectChange.detectChanges();
  }

  onSuccessfulBusinessCreate(stepper: MatStepper) {
    this.outputEmitter.emit(this.createOrUpdateBusiness);
    this.loadProfileForm = false;
    this.contact.reset();
    this.selectedBusiness = null;
    this.businessForm.reset();
    stepper.reset();
  }

  async onSubmitBusinessForm(stepper: MatStepper) {
    console.log(this.businessForm);
    this.validateAllFormFields(this.businessForm);
    if (this.businessForm.valid) {
      try {
        if (!this.id) {
          this.createOrUpdateBusiness = await this.businessService
            .createBusinessDesign(this.businessForm.value)
            .toPromise();
          this.toaster.showToastr(
            "Success",
            "Business Created Successfully",
            ToastMessageType.SUCCESS
          );
        } else {
          this.setBusinessDetails();
          this.createOrUpdateBusiness = await this.businessService
            .updateBusinessDesign(this.createOrUpdateBusiness)
            .toPromise();
          this.toaster.showToastr(
            "Success",
            "Business Updated Successfully",
            ToastMessageType.SUCCESS
          );
        }
        stepper.next();
      } catch (error) {
        this.toaster.showToastr(
          "Opps",
          "Something wents wrong. Please try later",
          ToastMessageType.ERROR
        );
      }
    }
  }

  addBusinessTypes() {
    this.businessTypes.set(BusinessTypeEnum.CLIENT, "Client");
    this.businessTypes.set(BusinessTypeEnum.TAP_GENERAL, "TAP");
  }

  setBusinessDetails() {
    if (!this.createOrUpdateBusiness) {
      this.createOrUpdateBusiness = new BusinessDesign();
    }
    this.createOrUpdateBusiness.businessName = this.businessForm.get(
      "businessName"
    ).value;
    this.createOrUpdateBusiness.contact.mobile = this.businessForm
      .get("contact")
      .get("mobile").value;
    this.createOrUpdateBusiness.contact.email = this.businessForm
      .get("contact")
      .get("email").value;
    this.createOrUpdateBusiness.gst = this.businessForm.get("gst").value;
    if(!this.createOrUpdateBusiness.address){
      this.createOrUpdateBusiness.address = new DetailedAddress();
    }
    this.createOrUpdateBusiness.address.state = this.businessForm
      .get("address")
      .get("state").value;
    this.createOrUpdateBusiness.address.city = this.businessForm
      .get("address")
      .get("city").value;
    this.createOrUpdateBusiness.address.localArea = this.businessForm
      .get("address")
      .get("localArea").value;

    if (this.businessType) {
      this.createOrUpdateBusiness.businessType = this.businessType;
    }
  }

  onBusinessTypeChange(business: BusinessTypeEnum) {
    this.selectedBusiness = business;
    this.businessForm.patchValue({
      businessType: business,
    });
  }

  async afterProfileCreation(profile: Profile, stepper: MatStepper) {
    this.profile = profile;
    var searchBusiness = this.checkOrCreateBusiness(profile, stepper);
  }

  async checkOrCreateBusiness(profile: Profile, stepper: MatStepper) {
    let businessSReq = new BusinessDesignSRequest();
    businessSReq.businessOwnership = new BusinessOwnership();
    businessSReq.businessOwnership.profileRef = new DataRef();
    businessSReq.businessOwnership.profileRef.id = profile.id;
    businessSReq.businessOwnership.profileRef.name = profile.fullName;
    businessSReq.businessType = this.selectedBusiness;
    try {
      const business = ((await this.businessService
        .customSearchBusiness(businessSReq)
        .toPromise()) as BusinessDesign[]).reverse();
      if (business && business.length > 0) {
        this.businessOwnerships.patchValue(business[0].businessOwnerships);
        this.contact.patchValue(business[0].contact);
        this.businessForm.patchValue(business[0]);
        this.selectedState(business[0].address.state);
        if (stepper) {
          stepper.next();
        }
      } else {
        this.setBusinessOwner(profile);
        if (stepper) {
          stepper.next();
        }
      }
    } catch (error) {
      this.setBusinessOwner(profile);
      if (stepper) {
        stepper.next();
      }
    }
  }

  async findBusiness(stepper: MatStepper) {
    try {
      const business = (await this.businessService
        .getBusiness(this.id)
        .toPromise()) as BusinessDesign;
      if (business) {
        this.createOrUpdateBusiness = business;
        this.businessOwnerships.patchValue(business.businessOwnerships);
        this.contact.patchValue(business.contact);
        if (business.address){
          business.address = new DetailedAddress();
        }
        this.businessForm.patchValue(business);
         this.selectedState(business.address.state);
        if (stepper) {
          stepper.next();
        }
      } else {
        this.toaster.showToastr(
          "Opps!!!",
          "Something went wrong. Please try later.",
          ToastMessageType.ERROR
        );
      }
    } catch (error) {
      this.toaster.showToastr(
        "Opps!!!",
        "Something went wrong. Please try later.",
        ToastMessageType.ERROR
      );
    }
  }

  async selectedState(state: string) {
    for (let [key, value] of this.states.entries()) {
      if (value === state) {
        this.selectedStateId = key;
        this.detectChange.detectChanges();
        return key;
      }
    }
  }

  setBusinessOwner(profile: Profile) {
    if (!profile) {
      return;
    }
    let owner = new BusinessOwnership();
    owner.designation = profile.type.toLocaleString();
    owner.profileRef = new DataRef();
    owner.profileRef.id = profile.id;
    owner.profileRef.name = profile.fullName;
    this.businessOwnerships.patchValue([owner]);
  }

  async findProfile(stepper: MatStepper) {
    if (this.selectedBusiness != null) {
      this.validateAllFormFields(this.contact);
      if (!this.contact.get("mobile").valid) {
        return;
      }
    } else {
      this.toaster.showToastr(
        "Opps!!!",
        "Select a Business Type",
        ToastMessageType.ERROR
      );
      return;
    }
    this.profileSearchReq = new ProfileSearchReq();
    this.profileSearchReq.mobile = this.contact.get("mobile").value;
    switch (this.selectedBusiness) {
      case BusinessTypeEnum.TAP_GENERAL: {
        this.profileSearchReq.profileType = ProfileTypeEnum.TAP_OWNER;
        break;
      }
      case BusinessTypeEnum.CLIENT: {
        this.profileSearchReq.profileType = ProfileTypeEnum.CLIENT_MANAGER;
        break;
      }
      default: {
        this.toaster.showToastr(
          "Opps!!!",
          "Select a Business Type",
          ToastMessageType.ERROR
        );
        break;
      }
    }

    var searchProfile = await this.profileService
      .customSearchProfile(this.profileSearchReq)
      .subscribe(
        async (profiles: Profile[]) => {
          if (profiles.length > 0) {
            const checkBusiness = await this.afterProfileCreation(
              profiles[0],
              null
            );
          } else {
            this.businessForm.get("contact").patchValue({
              mobile: this.contact.get("mobile").value,
            });
            this.loadProfileForm = true;
          }
          stepper.next();
        },
        (error) => {
          this.toaster.showToastr(
            "Opps!!!",
            "Something wents wrong. Please try later.",
            ToastMessageType.ERROR
          );
        }
      );
  }

  isFieldValid(
    form: FormGroup | AbstractControl,
    field: string,
    validationName: string
  ) {
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
}
