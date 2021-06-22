import { GenericSReq } from "../../core/models/generic-search-req.class";
import { VehicleTypeEnum } from "../enums/vehicle-type.enum";
import { VerificationStateEnum } from "../profile/verification-status.enum";
import { VehicleDetail } from "./vehicle-detail.class";
import { ServiceTypeEnum } from "./vehicle-service-type.enum";
import { VehicleStatusEnum } from "./vehicle-status.enum";
export class VehicleSearchReq extends GenericSReq {
  vehicleDetail?: VehicleDetail;
  vehcileType?: VehicleTypeEnum;
  vehCategoryId?: string;
  driverId?: string;
  status?: VehicleStatusEnum;
  serviceType?: ServiceTypeEnum;
  tapId?: string;
  state?: VerificationStateEnum;
}
