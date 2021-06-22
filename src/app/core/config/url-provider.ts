import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class URLProvider {
  private develURL = "http://localhost:80/";
  private prodURL = "https://tbapi.truckbuddy.co.in/";
  private trackingURL = "https://t.truckbuddy.co.in";
  private imageURL = "https://cdn.truckbuddy.co.in/";

  public getURL(type: EnvironmentType): string {
    switch (type) {
      case EnvironmentType.DEVEL:
        return this.develURL;
      case EnvironmentType.PROD:
        return this.prodURL;
    }
  }
  public getImageURL(): string {
    return this.imageURL;
  }

  public getOrderTrackingURL(): string {
    return this.trackingURL;
  }
}

export enum EnvironmentType {
  DEVEL = "DEVEL",
  PROD = "PROD",
}
