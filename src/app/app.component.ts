import { Component, OnInit } from "@angular/core";
import { ConnectionService } from "ng-connection-service";
import { MatBottomSheet } from "@angular/material";
import { NoInternetPromptComponent } from "./DemoPages/no-internet-prompt/no-internet-prompt.component";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit {
  title = "TruckBuddy FTL Loadfinder Pvt Ltd";
  bottomSheetRef;

  constructor(
    private connectionService: ConnectionService,
    private _bottomSheet: MatBottomSheet
  ) {}

  async ngOnInit() {
    this.connectionService.monitor().subscribe((isOnline) => {
        this.bottomSheetRef = this._bottomSheet.open(
          NoInternetPromptComponent,
          {
            data: {
              isOnline: isOnline
            },
            // panelClass:"transparent_bottom_sheet"
          }
        );
    });
  }
}
