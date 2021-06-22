import { GenericSReq } from "../../core/models/generic-search-req.class";
import { GeoAddress } from "../geolocation.class";
export class VehicleLocationLogSRequest extends GenericSReq {
  vehicleID?: string;
  driverId?: string;
  tripId?: string;
  locationCoOrdinates?: GeoAddress;
  distance?: number;
  vehicleNumber: string;
  isForLogging: boolean;
}
