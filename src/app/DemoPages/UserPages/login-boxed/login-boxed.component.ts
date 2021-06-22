import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { DataRef } from "../../../core/models/dataRef.class";
import { StorageServiceTypeEnum } from "../../../core/storage-service/storage-service-type.enum";
import { StorageService } from "../../../core/storage-service/storage.service";
import { BusinessDesign } from "../../../models/business/business-design.class";
import { BusinessOwnership } from "../../../models/business/business-ownership.class";
import { BusinessDesignSRequest } from "../../../models/business/business-search-req.class";
import {
  ProfileTypeEnum,
  ProfileTypeEnumFormatter,
} from "../../../models/profile/profile-type.enum";
import { BusinessService } from "../../../services/business.service";
import { LoginService } from "../../../services/login.service";
import {
  ToastMessage,
  ToastMessageType,
} from "./../../../core/utils/toastr-message.helper";
import { Login } from "./../../../models/login/login.class";
import { LoginSearchReq } from "./../../../models/login/loginReq.class";
import { ProfileSearchReq } from "./../../../models/profile/profile-search-req.class";
import { Profile } from "./../../../models/profile/profile.class";
import { ProfileService } from "./../../../services/profile.service";

@Component({
  selector: "app-login-boxed",
  templateUrl: "./login-boxed.component.html",
  styles: [],
})
export class LoginBoxedComponent implements OnInit {
  profileForm: FormGroup;
  loginForm: FormGroup;
  profile: Profile;
  isProfileFound: boolean = false;
  profileTypeList: Map<ProfileTypeEnum, string> = new Map();

  constructor(
    private router: Router,
    private storageService: StorageService,
    private formBuilder: FormBuilder,
    private toastrMessage: ToastMessage,
    private profileService: ProfileService,
    private loginService: LoginService,
    private businessService: BusinessService,
    private profileTypeEnumFormatter: ProfileTypeEnumFormatter
  ) {}

  ngOnInit() {
    if (this.storageService.get(StorageServiceTypeEnum.PROFILE)) {
      this.router.navigate(["dashboardsMenu"]);
    }
    this.setProfileTypeList();
    this.profileForm = this.formBuilder.group({
      mobile: [
        "",
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      profileType: ["", Validators.required],
    });
    this.loginForm = this.formBuilder.group({
      password: ["", Validators.required],
      rememberMe: [""],
    });
  }
  setProfileTypeList() {
    this.profileTypeList.set(
      ProfileTypeEnum.SUPER_ADMIN,
      this.profileTypeEnumFormatter.format(ProfileTypeEnum.SUPER_ADMIN)
    );
    this.profileTypeList.set(
      ProfileTypeEnum.TRUCKBUDDY_ADMIN,
      this.profileTypeEnumFormatter.format(ProfileTypeEnum.TRUCKBUDDY_ADMIN)
    );
    this.profileTypeList.set(
      ProfileTypeEnum.TRUCKBUDDY_SUPPORT,
      this.profileTypeEnumFormatter.format(ProfileTypeEnum.TRUCKBUDDY_SUPPORT)
    );
    this.profileTypeList.set(
      ProfileTypeEnum.CLIENT_MANAGER,
      this.profileTypeEnumFormatter.format(ProfileTypeEnum.CLIENT_MANAGER)
    );
    this.profileTypeList.set(
      ProfileTypeEnum.TAP_OWNER,
      this.profileTypeEnumFormatter.format(ProfileTypeEnum.TAP_OWNER)
    );
  }

  searchProfile(content) {
    if (
      this.profileForm.get("mobile") &&
      this.profileForm.get("mobile").value
    ) {
      let profileSearchReq = new ProfileSearchReq();
      profileSearchReq.mobile = this.profileForm.get("mobile").value;
      profileSearchReq.profileType = this.profileForm.get("profileType").value;
      console.log(JSON.stringify(profileSearchReq));
      this.profileService.customSearchProfile(profileSearchReq).subscribe(
        (profiles: Profile[]) => {
          if (profiles.length > 0) {
            this.profile = profiles[0];
            if (this.profile.state.toString() == "REJECT" || this.profile.state.toString() == "BLOCKED") {
              this.toastrMessage.showToastr(
                "Opps!!!",
                "User Profile Blocked / Rejected",
                ToastMessageType.ERROR
              );
            } else {
              this.isProfileFound = true;
              if (this.profile.type.toString() == "TAP_OWNER") {
                this.saveBusinessProfile();
              }
            }
          } else {
            this.toastrMessage.showToastr(
              "Invalid Username",
              "Mobile Number is not registered yet",
              ToastMessageType.ERROR
            );
          }
        },
        (error) => {
          this.toastrMessage.showToastr(
            "Opps!!!",
            "Something wents wrong. Try again later.",
            ToastMessageType.ERROR
          );
        }
      );
    } else {
      this.toastrMessage.showToastr(
        "Invalid Username",
        "Mobile Number is invalid",
        ToastMessageType.ERROR
      );
    }
  }

  async saveBusinessProfile() {
    var businessSearchReq = new BusinessDesignSRequest();
    businessSearchReq.businessOwnership = new BusinessOwnership();
    businessSearchReq.businessOwnership.profileRef = new DataRef();
    businessSearchReq.businessOwnership.profileRef.id = this.profile.id;
    businessSearchReq.businessOwnership.profileRef.name = this.profile.fullName;
    try {
      let businessProfile = (await this.businessService
        .customSearchBusiness(businessSearchReq)
        .toPromise()) as BusinessDesign[];
      if (businessProfile && businessProfile.length > 0) {
        this.storageService.store(
          StorageServiceTypeEnum.BUSINESS_PROFILE,
          businessProfile[0]
        );
      } else {
        this.toastrMessage.showToastr(
          "Opps!!!",
          "Business Profile not found. Please contact to TruckBuddy Admin.",
          ToastMessageType.ERROR
        );
      }
    } catch (error) {
      this.toastrMessage.showToastr(
        "Opps!!!",
        "Business Profile not found. Please contact to TruckBuddy Admin.",
        ToastMessageType.ERROR
      );
    }
  }

  isFieldValid(form: FormGroup, field: string, validationName: string) {
    return form.get(field).touched && form.get(field).hasError(validationName);
  }

  checkLogin(content) {
    if (this.profile) {
      let loginSearchReq = new LoginSearchReq();
      loginSearchReq.profileId = this.profile.id;
      loginSearchReq.password = this.loginForm.get("password").value;
      this.loginService.customSearchLogin(loginSearchReq).subscribe(
        (login: Login[]) => {
          if (login.length > 0) {
            this.storageService.store(
              StorageServiceTypeEnum.PROFILE,
              this.profile
            );
            this.loginForm.reset();
            this.router.navigate(["dashboardsMenu"]);
            window.location.reload();
          } else {
            this.toastrMessage.showToastr(
              "Invalid Credential",
              "Password is invalid",
              ToastMessageType.ERROR
            );
          }
        },
        (error) => {
          this.toastrMessage.showToastr(
            "Opps!!!",
            "Something wents wrong. Try again later.",
            ToastMessageType.ERROR
          );
        }
      );
    } else {
      this.toastrMessage.showToastr(
        "Opps!!!",
        "Something wents wrong. Try again later.",
        ToastMessageType.ERROR
      );
    }
  }

  onGoBack() {
    this.isProfileFound = false;
    this.profile = null;
    this.storageService.clear(StorageServiceTypeEnum.PROFILE);
    this.storageService.clear(StorageServiceTypeEnum.BUSINESS_PROFILE);
  }
}
