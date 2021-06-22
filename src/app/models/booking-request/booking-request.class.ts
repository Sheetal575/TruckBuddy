// To parse this data:
//
//   import { Convert, BookingRequest } from "./file";
import { DataRef } from "../../core/models/dataRef.class";
import { GenericModel } from "../../core/models/generic-model.class";
import { DetailedAddress } from "../detailed-address.class";
import { BookingRequestStatusEnum } from "./booking-request-status.enum";
import { OrderStateEnum } from "../order-invoice/order-invoice.class";
//
//   const bookingRequest = Convert.toBookingRequest(json);

export class BookingRequest extends GenericModel {
  deviceId: string;
  requestedByRef: DataRef;
  vehicleCategoryId: string;
  requestedTime: number;
  source: DetailedAddress;
  destinations: DetailedAddress[];
  clientRef: DataRef;
  warehouseRef: DataRef;
  orderId: string;
  orderStatus: OrderStateEnum;
  vehicleSearchTypeEnum: VehicleSearchTypeEnum;
  requestStatus: BookingRequestStatusEnum;
  vehicleInfo: DataRef;
  proposalMoney : number;
  approvedMoney : number;
}

export enum VehicleSearchTypeEnum {
  DESTINATION_TAP_EXCLUSIVE,
  DESTINATION_TAP_GENERAL,
  SOURCE_TAP_EXCLUSIVE,
  SOURCE_TAP_GENERAL,
  ADMIN,
}
