import { DataRef } from "src/app/core/models/dataRef.class";
import { DetailedAddress } from "../detailed-address.class";
import { VehicleBookingStatusEnum } from "./vehicle-booking-request-status.enum";
import { GenericModel } from "../../core/models/generic-model.class";

export enum VehicleLoadTypeEnum {
  HCV,
  LCV,
}

export class VehicleBooking extends GenericModel {
  assigneeRef?: DataRef;
  bookingRequest?: BookingRequestDetail;
  status?: VehicleBookingStatusEnum;
  reasonOfRejection?: string;
  penalty?: Penalty;
  createdForVehLoadType?: VehicleLoadTypeEnum;
  freightBookingCharge?: FreightBookingCharge;
  freigtBookingProposal?: FreightBookingProposal;
  deleted?: boolean;
}

export class BookingRequestDetail {
  bookingReqRef?: DataRef;
  destinations?: DetailedAddress[];
  requestedTime?: number;
  source?: DetailedAddress;
  vehicleCategoryId?: string;
}

export class FreightBookingCharge {
  charge?: number;
  extraCharge?: number;
}

export class FreightBookingProposal {
  requestMoney?: number;
  proposeMoney?: number;
  approvedProposal?: ApprovedProposal;
}

export class ApprovedProposal {
  money: number;
  approvedBy: DataRef;
}

export class Penalty {
  status?: string;
  amount?: number;
  refId?: string;
}
