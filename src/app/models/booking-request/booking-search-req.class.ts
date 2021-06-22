import { Area } from "../area.class";
import { GenericSReq } from "../../core/models/generic-search-req.class";
import { TimeRange } from '../../core/models/time-range.class';
import { BookingRequestStatusEnum } from './booking-request-status.enum';
import { DataRef } from '../../core/models/dataRef.class';
export class BookingSearchReq extends GenericSReq {
  requestedById?: string;
  requestedTime?: TimeRange;
  requestCreatedTime?: TimeRange;
  requestStatus: BookingRequestStatusEnum;
  destination?: Area;
  source?: Area;
  clientId?: string;
  warehouseId?: string;
  vehicleInfo:DataRef;
  
}
