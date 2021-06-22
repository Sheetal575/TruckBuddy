import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ChangeDetectorRef,
} from "@angular/core";
import { SWITCH_CHANGE_DETECTOR_REF_FACTORY__POST_R3__ } from "@angular/core/src/change_detection/change_detector_ref";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatStepper } from "@angular/material";
import { Router } from "@angular/router";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import { DataRef } from "src/app/core/models/dataRef.class";
import { OptionConfig } from "src/app/core/models/option-config.class";
import {
  CityStateProvider,
  LocaleTypeEnum,
} from "src/app/core/utils/city-state.helper";
import { ContactDetails } from "src/app/models/contact-details.class";
import { PhysicalAddress } from "src/app/models/physical-address.class";
import { ProfileTypeEnum } from "src/app/models/profile/profile-type.enum";
import { StorageService } from "./../../../core/storage-service/storage.service";
import {
  ToastMessage,
  ToastMessageType,
} from "./../../../core/utils/toastr-message.helper";
import { Login } from "./../../../models/login/login.class";
import { ProfileTypeEnumFormatter } from "./../../../models/profile/profile-type.enum";
import { Profile } from "./../../../models/profile/profile.class";
import { LoginService } from "./../../../services/login.service";
import { ProfileService } from "./../../../services/profile.service";
import { ProfileTypeProvider } from "./../../../utils/helpers/profile-type.provider";
import { StorageServiceTypeEnum } from "../../../core/storage-service/storage-service-type.enum";

@Component({
  selector: "app-add-profile",
  templateUrl: "./add-profile.component.html",
  styleUrls: ["./add-profile.component.sass"],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class AddProfileComponent implements OnInit {
  @Input() mobile: string;
  @Input() type: ProfileTypeEnum;
  @Output() outputEmitter = new EventEmitter<Profile>();
  profileSearchForm: FormGroup;
  profileForm: FormGroup;
  address: FormGroup;
  contact: FormGroup;
  createOrUpdateLoginForm: FormGroup;
  loadProfileForm: boolean = false;
  createdOrUpdatedProfile: Profile;
  createOrUpdateLogin: Login;
  loggedInProfile: Profile;
  profileTypeList: Map<ProfileTypeEnum, string> = new Map();
  cities: Map<string, string> = new Map();
  states: Map<string, string> = new Map();
  isLoading: boolean = false;
  isStateChanged: boolean = false;
  selectedStateId: string;

  uploadProfilePicForm: FormGroup;

  heading = "Add/Update Profile";
  subheading = "To Add/Update Profile";
  icon = "pe-7s-add-user icon-gradient bg-sunny-morning";

  constructor(
    private _formBuilder: FormBuilder,
    private profileService: ProfileService,
    private loginService: LoginService,
    private storageService: StorageService,
    private profileTypeProvider: ProfileTypeProvider,
    private profileTypeEnumFormatter: ProfileTypeEnumFormatter,
    private router: Router,
    private _changeDetect: ChangeDetectorRef,
    private toaster: ToastMessage,
    private cityStateProvider: CityStateProvider
  ) {}

  async ngOnInit() {
    this.isLoading = true;
    await this.getStates();
    this.getLoginUserProfileAndAllProfileTypes();
    this.profileSearchForm = this._formBuilder.group({
      profileType: ["", Validators.required],
      mobile: [""],
    });
    this.contact = this._formBuilder.group({
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
      addressLine1: ["", Validators.required],
      addressLine2: [""],
      landmark: [""],
      city: ["", Validators.required],
      state: ["", Validators.required],
      zipCode: [
        "",
        [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
      ],
    });
    this.createOrUpdateLoginForm = this._formBuilder.group({
      password: [""],
    });
    this.profileForm = this._formBuilder.group({
      fullName: ["", Validators.required],
      contact: this.contact,
      address: this.address,
      profilePic: [""],
    });

    this.profileForm.reset();
    this.uploadProfilePicForm = this._formBuilder.group({
      file: [""],
    });
    if (this.mobile) {
      this.contact.patchValue({
        mobile: this.mobile,
      });
      this.checkOrCreateProfile();
      this.loadProfileForm = true;
    }
    this.isLoading = false;
    // this._changeDetect.detectChanges();
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

  async selectedState() {
    if (!this.createdOrUpdatedProfile) {
      return;
    } else {
      for (let [key, value] of this.states.entries()) {
        if (value === this.createdOrUpdatedProfile.address.state) {
          this.selectedStateId = key;
          this._changeDetect.detectChanges();
          return key;
        }
      }
    }
  }

  async onStateChange(stateId: string) {
    this.isStateChanged = true;
    this.profileForm.get("address").patchValue({
      state: this.states.get(stateId),
    });
    var fetchState = await this.cityStateProvider
      .fetchCity(stateId, LocaleTypeEnum.ENGLISH)
      .then((optionConfigs: OptionConfig[]) => {
        this.cities = this.cityStateProvider.fetchDataBasedOnLocale(
          optionConfigs,
          LocaleTypeEnum.ENGLISH
        );
        this._changeDetect.detectChanges();
      });
  }

  enableCityChange() {
    this.isStateChanged = true;
  }

  async onCityChange(city: string) {
    this.profileForm.get("address").patchValue({
      city: city,
    });
  }

  getLoginUserProfileAndAllProfileTypes() {
    this.loggedInProfile = this.storageService.get(
      StorageServiceTypeEnum.PROFILE
    ) as Profile;
    if (!this.loggedInProfile) {
      this.router.navigate(["/pages/login-boxed"]);
      return;
    }
    this.profileTypeProvider
      .getAllProfileType(this.loggedInProfile.type)
      .forEach((profileType) => {
        this.profileTypeList.set(
          profileType,
          this.profileTypeEnumFormatter.format(profileType)
        );
      });
  }

  async checkOrCreateProfile() {
    if (
      this.contact.get("mobile").valid &&
      this.contact.get("mobile").touched
    ) {
      this.profileSearchForm.patchValue({
        mobile: this.contact.get("mobile").value,
      });
    } else if (this.mobile && this.type) {
      this.profileSearchForm.patchValue({
        mobile: this.mobile,
        profileType: this.type,
      });
    } else if (this.type != null && this.type.toString() != "") {
      this.toaster.showToastr(
        "Opps !!!",
        "Please select profile type",
        ToastMessageType.ERROR
      );
      return;
    } else if (this.mobile != null && this.mobile != "") {
      this.toaster.showToastr(
        "Opps !!!",
        "Please enter mobile number",
        ToastMessageType.ERROR
      );
      return;
    } else {
      this.toaster.showToastr(
        "Opps !!!",
        "Something wents wrong. Please try later",
        ToastMessageType.ERROR
      );
      return;
    }
    var getProfile = await this.profileService
      .customSearchProfile(this.profileSearchForm.value)
      .subscribe(
        (profiles: Profile[]) => {
          if (profiles.length > 0) {
            this.createdOrUpdatedProfile = profiles[0];
            this.profileForm.patchValue(this.createdOrUpdatedProfile);
            this.selectedState();
          } else {
            this.profileForm.patchValue(this.profileSearchForm.value);
          }
          this.loadProfileForm = true;
          this.isLoading = false;
        },
        (error) => {
          this.toaster.showToastr(
            "Opps !!!",
            "Something wents wrong. Please try later",
            ToastMessageType.ERROR
          );
        }
      );
  }

  isFieldValid(form: FormGroup, field: string, validationName: string) {
    return form.get(field).touched && form.get(field).hasError(validationName);
  }

  selectFile(event) {
    if (event.target.files.length > 0) {
      const file = (event.target as HTMLInputElement).files[0];
      this.uploadProfilePicForm.patchValue({
        file: file,
      });
    }
  }

  setProfilePic(imageId: string) {
    this.createdOrUpdatedProfile.profilePic = imageId;
  }

  setProfile() {
    if (!this.createdOrUpdatedProfile) {
      this.createdOrUpdatedProfile = new Profile();
    }
    this.createdOrUpdatedProfile.fullName = this.profileForm.get(
      "fullName"
    ).value;
    if (!this.createdOrUpdatedProfile.address) {
      this.createdOrUpdatedProfile.address = new PhysicalAddress();
    }
    this.createdOrUpdatedProfile.address = this.profileForm.get(
      "address"
    ).value;
    if (!this.createdOrUpdatedProfile.contact) {
      this.createdOrUpdatedProfile.contact = new ContactDetails();
    }
    if (!this.createdOrUpdatedProfile.type) {
      if (this.type) {
        this.createdOrUpdatedProfile.type = this.type;
      } else {
        this.createdOrUpdatedProfile.type = this.profileSearchForm.get(
          "profileType"
        ).value;
      }
    }
    this.createdOrUpdatedProfile.contact = this.profileForm.get(
      "contact"
    ).value;
  }
  onSubmitProfile(stepper: MatStepper) {
    this.setProfile();
    if (this.createdOrUpdatedProfile.id) {
      this.profileService.updateProfile(this.createdOrUpdatedProfile).subscribe(
        (profile: Profile) => {
          this.createdOrUpdatedProfile = profile;
          this.checkOrCreateLogin(profile);
          stepper.next();
        },
        (error) => {
          this.toaster.showToastr(
            "Opps !!!",
            "Something wents wrong. Please try later",
            ToastMessageType.ERROR
          );
        }
      );
    } else {
      this.profileService.createProfile(this.createdOrUpdatedProfile).subscribe(
        (profile: Profile) => {
          this.createdOrUpdatedProfile = profile;
          this.checkOrCreateLogin(profile);
          stepper.next();
        },
        (error) => {
          this.toaster.showToastr(
            "Opps !!!",
            "Something wents wrong. Please try later",
            ToastMessageType.ERROR
          );
        }
      );
    }
  }

  checkOrCreateLogin(profile: Profile) {
    this.loginService.getLogin(profile.id).subscribe(
      (login: Login) => {
        if (login) {
          this.createOrUpdateLogin = login;
          this.createOrUpdateLoginForm.patchValue(this.createOrUpdateLogin);
        } else {
          this.createOrUpdateLoginForm.get("password").reset();
          this.createOrUpdateLogin = new Login();
          this.createOrUpdateLogin.profileRef = new DataRef();
          this.createOrUpdateLogin.profileRef.id = this.createdOrUpdatedProfile.id;
          this.createOrUpdateLogin.profileRef.name = this.createdOrUpdatedProfile.fullName;
        }
      },
      (error) => {
        this.createOrUpdateLoginForm.get("password").reset();
        this.createOrUpdateLogin = new Login();
        this.createOrUpdateLogin.profileRef = new DataRef();
        this.createOrUpdateLogin.profileRef.id = this.createdOrUpdatedProfile.id;
        this.createOrUpdateLogin.profileRef.name = this.createdOrUpdatedProfile.fullName;
        // this.toaster.showToastr(
        //   "Opps !!!",
        //   "Something wents wrong. Please try later",
        //   ToastMessageType.ERROR
        // );
      }
    );
  }

  onSubmitProfilePic(stepper: MatStepper) {
    this.profileService.updateProfile(this.createdOrUpdatedProfile).subscribe(
      (profile: Profile) => {
        this.createdOrUpdatedProfile = profile;
        this.checkOrCreateLogin(profile);
        this.profileForm.patchValue(this.createdOrUpdatedProfile);
        this.toaster.showToastr(
          "Success",
          "Profile Pic updated successfully",
          ToastMessageType.SUCCESS
        );
        stepper.next();
      },
      (error) => {
        this.toaster.showToastr(
          "Failure",
          "Something went wrong. Please try later.",
          ToastMessageType.ERROR
        );
      }
    );
  }

  onCreateOrUpdateLoginPassword(stepper: MatStepper) {
    this.validateAllFormFields(this.createOrUpdateLoginForm);
    if (!this.createOrUpdateLoginForm.valid) {
      this.toaster.showToastr(
        "Opps !!!",
        "Something wents wrong. Please try later",
        ToastMessageType.ERROR
      );
      return;
    }
    this.createOrUpdateLogin.password = this.createOrUpdateLoginForm.get(
      "password"
    ).value;
    if (this.createOrUpdateLogin.id) {
      this.loginService.updateLogin(this.createOrUpdateLogin).subscribe(
        (login: Login) => {
          this.createOrUpdateLogin = login;
          this.toaster.showToastr(
            "Success",
            "Login Password updated successfully",
            ToastMessageType.SUCCESS
          );
          stepper.next();
        },
        (error) => {
          this.toaster.showToastr(
            "Opps !!!",
            "Something wents wrong. Please try later",
            ToastMessageType.ERROR
          );
        }
      );
    } else {
      this.loginService.createLogin(this.createOrUpdateLogin).subscribe(
        (login: Login) => {
          this.createOrUpdateLogin = login;
          this.toaster.showToastr(
            "Success",
            "Login Password created successfully",
            ToastMessageType.SUCCESS
          );
          stepper.next();
        },
        (error) => {
          this.toaster.showToastr(
            "Opps !!!",
            "Something wents wrong. Please try later",
            ToastMessageType.ERROR
          );
        }
      );
    }
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
  onStepperCompletion(stepper: MatStepper) {
    this.outputEmitter.emit(this.createdOrUpdatedProfile);
    this.profileForm.reset();
    this.uploadProfilePicForm.reset();
    this.createOrUpdateLoginForm.reset();
    this.profileSearchForm.reset();
    this.loadProfileForm = false;
    this.createdOrUpdatedProfile = undefined;
    this.createOrUpdateLogin = undefined;
    stepper.reset();
  }
}
