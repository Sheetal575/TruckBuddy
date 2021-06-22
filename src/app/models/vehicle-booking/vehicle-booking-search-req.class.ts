import { BookingRequestDetail, Penalty } from "./vehicle-booking.class";
import { DataRef } from "../../core/models/dataRef.class";
import { VehicleBookingStatusEnum } from "./vehicle-booking-request-status.enum";
import { GenericModel } from '../../core/models/generic-model.class';
export class VehicleBookingSearchReq extends GenericModel{
  modifiedAt: number;
  tapId: string;
  bookingRequest: BookingRequestDetail;
  status: VehicleBookingStatusEnum;
  penalty: Penalty;
  assigneeRef: DataRef;
}
