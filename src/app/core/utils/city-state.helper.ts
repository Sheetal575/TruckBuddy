import { DisplayName, OptionConfig } from "./../models/option-config.class";
import { Injectable } from "@angular/core";
import { RestService } from "../rest-service/rest.service";

@Injectable({
  providedIn: "root",
})
export class CityStateProvider {
  path: string = "optionConfig/search";
  constructor(private restService: RestService) {}

  async fetchState(locale: LocaleTypeEnum): Promise<any> {
    var data = await this.restService
      .post(this.path, { type: "state", refId: "in" })
      .toPromise();
    return data;
  }

  async fetchCity(stateId: string, locale: LocaleTypeEnum): Promise<any> {
    var data = await this.restService
      .post(this.path, { type: "city", refId: stateId })
      .toPromise();
    return data;
  }

  fetchDataBasedOnLocale(
    optionConfigs: OptionConfig[],
    locale: LocaleTypeEnum
  ): Map<string, string> {
    switch (locale) {
      case 0:
        return this.fetchData(optionConfigs, "hindi");
      case 1:
        return this.fetchData(optionConfigs, "english");
    }
  }

  fetchData(
    optionConfigs: OptionConfig[],
    locale: string
  ): Map<string, string> {
    let data: Map<string, string> = new Map();
    optionConfigs.forEach((config: OptionConfig) => {
      config.displayNames.forEach((displayName: DisplayName) => {
        if (displayName.locale.toLowerCase() === locale) {
          data.set(config.id, displayName.text);
        }
      });
    });
    return data;
  }
}

export enum LocaleTypeEnum {
  HINDI,
  ENGLISH,
}
