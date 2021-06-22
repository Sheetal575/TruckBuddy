import { Component, OnInit } from "@angular/core";
import { MatBottomSheet, MatDialog } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { EditBusinessComponent } from "../../Business/edit-business/edit-business.component";
import { BusinessDesign } from "./../../../models/business/business-design.class";
import { BusinessService as BusinessService } from "./../../../services/business.service";
import { DetailedAddress } from "../../../models/detailed-address.class";
import { AddProfileSheetComponent } from '../../bottom-sheet-pages/add-profile-sheet/add-profile-sheet.component';
import { ProfileTypeEnum } from "../../../models/profile/profile-type.enum";
import {
  ToastMessageType,
  ToastMessage,
} from "../../../core/utils/toastr-message.helper";
import { BusinessOwnership } from "../../../models/business/business-ownership.class";
import { Profile } from "../../../models/profile/profile.class";
import { DataRef } from "../../../core/models/dataRef.class";
import { AddAddressSheetComponent } from "../../bottom-sheet-pages/add-address-sheet/add-address-sheet.component";

@Component({
  selector: "app-view-tap",
  templateUrl: "./view-tap.component.html",
  styleUrls: ["./view-tap.component.sass"],
})
export class ViewTapComponent implements OnInit {
  business: BusinessDesign;
  isLoading: boolean = false;

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private _bottomSheet: MatBottomSheet,
    private businessService: BusinessService,
    private ngxService: NgxUiLoaderService,
    private toastr: ToastMessage,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.activeRoute.fragment.subscribe((id) => {
      if (id) {
        this.ngxService.start();
        this.getBusiness(id);
      } else {
        this.routeToBusinessList();
      }
    });
  }

  editTap() {
    const bottomSheetRef = this._bottomSheet.open(EditBusinessComponent, {
      data: {
        id: this.business.id,
      },
    });
    bottomSheetRef.afterDismissed().subscribe((business: BusinessDesign) => {
      if (business) {
        this.business = business;
      }
    });
  }

  getAddress(address: DetailedAddress) {
    let data = "";
    if (!address) {
      return data;
    }
    if (address.localArea) {
      data = data + address.localArea + ", ";
    }
    if (address.city) {
      data = data + address.city + ", ";
    }
    if (address.state) {
      data = data + address.state;
    }
    return data;
  }

  getMobileNumber(id: string) {
    if (!id) {
      return "";
    } else {
      return id.substring(id.indexOf("@") + 1);
    }
  }

  addManager() {
    const dialogRef = this.dialog.open(AddProfileSheetComponent, {
      data: {
        profileTypes: [ProfileTypeEnum.TAP_OWNER],
        title: "Add Tap Manager Profile",
      },
      width: "600px",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.profile) {
        this.addBusinessOwner(result.profile);
      }
    });
  }

  async addBusinessOwner(profile: Profile) {
    if (!profile) {
      return;
    }
    let owner = new BusinessOwnership();
    owner.designation = profile.type.toLocaleString();
    owner.profileRef = new DataRef();
    owner.profileRef.id = profile.id;
    owner.profileRef.name = profile.fullName;
    this.business.businessOwnerships.push(owner);
    try {
      this.isLoading = true;
      this.ngxService.start();
      this.business = await this.businessService
        .updateBusinessDesign(this.business)
        .toPromise();
      this.toastr.showToastr(
        "Success",
        "Manager Added successfully",
        ToastMessageType.SUCCESS
      );
      this.isLoading = false;
      this.ngxService.stop();
    } catch (error) {
      this.toastr.showToastr(
        "Oops!!!",
        "Something went wrong. Please try later.",
        ToastMessageType.ERROR
      );
      this.isLoading = false;
      this.ngxService.stop();
    }
  }

  getDesignation(designation: string) {
    return designation.replace("_", " ");
  }

  async getBusiness(id: string) {
    await this.businessService.getBusiness(id).subscribe(
      (business: BusinessDesign) => {
        if (business) {
          this.business = business;
        } else {
          this.routeToBusinessList();
        }
      },
      (error) => {
        this.routeToBusinessList();
      },
      () => {
        this.isLoading = false;
        this.ngxService.stop();
      }
    );
  }

  routeToBusinessList() {
    this.router.navigate(["../list-tap"], { relativeTo: this.activeRoute });
  }
}
