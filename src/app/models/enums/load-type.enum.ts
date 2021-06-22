import { Injectable } from "@angular/core";

export enum LoadTypeEnum {
  FMCG,
  BEVERAGES,
  FURNITURE,
  GLASS,
}

@Injectable({
  providedIn: "root",
})
export class LoadTypeFormatter {
  format(loadType: LoadTypeEnum): string {
    switch (loadType) {
      case LoadTypeEnum.FMCG:
        return "FMCG";
      case LoadTypeEnum.BEVERAGES:
        return "Beverages";
      case LoadTypeEnum.FURNITURE:
        return "Furniture";
      case LoadTypeEnum.GLASS:
        return "Glass";
      default:
        return "Unknown"; // UNKNOWN Load type 
    }
  }
}
