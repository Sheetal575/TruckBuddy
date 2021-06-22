import { Injectable } from "@angular/core";

export enum ProfileTypeEnum {
  SUPER_ADMIN,
  TRUCKBUDDY_ADMIN,
  TRUCKBUDDY_SUPPORT,
  TAP_DRIVER,
  TAP_OWNER,
  TAP_HELPER,
  CLIENT_MANAGER,
  CLIENT_WAREHOUSE_KEEPER,
}

@Injectable({
  providedIn: "root",
})
export class ProfileTypeEnumFormatter {
  public format(profileTypeEnum: ProfileTypeEnum): string {
    switch (profileTypeEnum as ProfileTypeEnum) {
      case ProfileTypeEnum.SUPER_ADMIN:
        return "Super Admin";
      case ProfileTypeEnum.TRUCKBUDDY_ADMIN:
        return "Admin";
      case ProfileTypeEnum.TRUCKBUDDY_SUPPORT:
        return "Support";
      case ProfileTypeEnum.TAP_OWNER:
        return "TAP Manager";
      case ProfileTypeEnum.TAP_DRIVER:
        return "Driver";
      case ProfileTypeEnum.TAP_HELPER:
        return "Helper";
      case ProfileTypeEnum.CLIENT_MANAGER:
        return "Client Manager";
      case ProfileTypeEnum.CLIENT_WAREHOUSE_KEEPER:
        return "Client Warehouse Keeper";
      default:
        return "UNKNOWN";
    }
  }

  public formatProfileType(profileTypeEnum: String): string {
    switch (profileTypeEnum) {
      case "SUPER_ADMIN":
        return "Super Admin";
      case "TRUCKBUDDY_ADMIN":
        return "Admin";
      case "TRUCKBUDDY_SUPPORT":
        return "Support";
      case "TAP_OWNER":
        return "TAP Manager";
      case "TAP_DRIVER":
        return "Driver";
      case "TAP_HELPER":
        return "Helper";
      case "CLIENT_MANAGER":
        return "Client Manager";
      case "CLIENT_WAREHOUSE_KEEPER":
        return "Client Warehouse Keeper";
      default:
        return "UNKNOWN";
    }
  }
}
