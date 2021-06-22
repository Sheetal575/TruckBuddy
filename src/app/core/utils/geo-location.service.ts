import { ReverseGeoCodingResponse } from "./../models/reverse-geo-coding.class";
import { GeoCodingResponse } from "./../models/geo-coding-response.class";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Area } from "src/app/models/area.class";
import { RestService } from "../rest-service/rest.service";
import { GeoAddress } from "src/app/models/geolocation.class";

@Injectable({
  providedIn: "root",
})
export class GeoLocationService {
  coordinates: any;
  GEOLOCATION_URL = "https://maps.googleapis.com/maps/api/geocode/json";
  REVERSE_GEOLOCATION_URL = "https://maps.googleapis.com/maps/api/geocode/json";
  GOOGLE_MAP_KEY = "AIzaSyCRXmdTqWWh3_-c2EK2htmgghPokBWyyKM";

  constructor(private restService: RestService) {}

  // public getPosition(): Observable<Position> {
  //   return Observable.create((observer) => {
  //     navigator.geolocation.watchPosition((pos: Position) => {
  //       observer.next(pos);
  //     }),
  //       () => {
  //         console.log("Position is not available");
  //       },
  //       {
  //         enableHighAccuracy: true,
  //       };
  //   });
  // }

  public async getReverseGeoLocation(geoAddress: GeoAddress): Promise<string> {
    let reverseGeoLocation = await this.restService
      .customGet(
        this.REVERSE_GEOLOCATION_URL +
          "?latlng=" +
          geoAddress.coordinates[1] +
          "," +
          geoAddress.coordinates[0] +
          "&key=" +
          this.GOOGLE_MAP_KEY
      )
      .toPromise();
    if (
      (reverseGeoLocation as ReverseGeoCodingResponse).results &&
      (reverseGeoLocation as ReverseGeoCodingResponse).results.length > 0
    ) {
      return (reverseGeoLocation as GeoCodingResponse).results[0]
        .formatted_address;
    } else {
      return null;
    }
  }
  public async getGeoLocation(area: Area): Promise<any> {
    var address = this.getAddress(area);
    let geoLocation = await this.restService
      .customGet(
        this.GEOLOCATION_URL +
          "?address=" +
          address +
          "&key=" +
          this.GOOGLE_MAP_KEY
      )
      .toPromise();
    if (
      (geoLocation as GeoCodingResponse).results &&
      (geoLocation as GeoCodingResponse).results.length > 0
    ) {
      return (geoLocation as GeoCodingResponse).results[0].geometry.location;
    } else {
      return null;
    }
  }

  getAddress(area: Area): string {
    let address: string = "";
    if (area.localArea) {
      address += area.localArea.replace(" ", "+");
    }
    if (area.city) {
      address += "+" + area.city.replace(" ", "+");
    }
    if (area.state) {
      address += "+" + area.state.replace(" ", "+");
    }
    return address;
  }
}
