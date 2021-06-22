import { Component, Inject } from "@angular/core";
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from "@angular/material";

@Component({
  selector: "app-no-internet-prompt",
  templateUrl: "./no-internet-prompt.component.html",
  styleUrls: ["./no-internet-prompt.component.sass"],
})
export class NoInternetPromptComponent {
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private _bottomSheetRef: MatBottomSheetRef<NoInternetPromptComponent>
  ) {
    if (data.isOnline) {
      this._bottomSheetRef.dismiss();
    }
  }
}
