import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { Component, Inject, OnInit } from "@angular/core";
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from "@angular/material";
import { Profile } from "./../../../models/profile/profile.class";

@Component({
  selector: "app-edit-profile",
  templateUrl: "./edit-profile.component.html",
  styleUrls: ["./edit-profile.component.sass"],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class EditProfileComponent implements OnInit {
  mobile: string;
  type: any;
  updateProfile: boolean = false;
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private _bottomSheetRef: MatBottomSheetRef<EditProfileComponent>
  ) {}

  afterProfileCreation(profile: Profile): void {
    this.updateProfile = false;
    this._bottomSheetRef.dismiss(profile);
  }

  closeBottomSheet(event: MouseEvent): void {
    this.updateProfile = false;
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

  ngOnInit() {
    this.mobile = this.data.mobile;
    this.type = this.data.type;
    this.updateProfile = true;
    console.log(this.data.mobile);
  }
}
