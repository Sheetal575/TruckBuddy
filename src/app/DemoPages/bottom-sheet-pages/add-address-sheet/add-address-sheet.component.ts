import {
  Component,
  OnInit
} from "@angular/core";
import { MatDialogRef } from "@angular/material";
import { OptionConfig } from "../../../core/models/option-config.class";
import {
  CityStateProvider, LocaleTypeEnum
} from "../../../core/utils/city-state.helper";
import {
  ToastMessage,
  ToastMessageType
} from "../../../core/utils/toastr-message.helper";
import { DetailedAddress } from "../../../models/detailed-address.class";

@Component({
  selector: "app-add-address-sheet",
  templateUrl: "./add-address-sheet.component.html",
  styleUrls: ["./add-address-sheet.component.sass"],
})
export class AddAddressSheetComponent implements OnInit {
  address: DetailedAddress = new DetailedAddress();
  cities: Map<string, string> = new Map();
  states: Map<string, string> = new Map();
  isLoading: boolean = false;

  constructor(
    private cityStateProvider: CityStateProvider,
    private toastr: ToastMessage,
    public dialogRef: MatDialogRef<AddAddressSheetComponent>
  ) {
    this.getStates();
  }

  ngOnInit() {}

  async onSubmitAddress() {
    if (!this.address || !this.address.localArea) {
      this.toastr.showToastr("Opps!!", "Enter Address", ToastMessageType.ERROR);
    } else if (!this.address.state) {
      this.toastr.showToastr("Opps!!", "Enter State", ToastMessageType.ERROR);
    } else if (!this.address.city) {
      this.toastr.showToastr("Opps!!", "Enter City", ToastMessageType.ERROR);
    } else {
      this.dialogRef.close({ address: this.address });
    }
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
    this.address.state = this.states.get(stateId);
    var fetchState = await this.cityStateProvider
      .fetchCity(stateId, LocaleTypeEnum.ENGLISH)
      .then((optionConfigs: OptionConfig[]) => {
        this.cities = this.cityStateProvider.fetchDataBasedOnLocale(
          optionConfigs,
          LocaleTypeEnum.ENGLISH
        );
      });
  }

  async onCityChange(city: string) {
    this.address.city = city;
  }
}
