import { DetailedAddress } from "../detailed-address.class";
import { DataRef } from "../../core/models/dataRef.class";
import { GenericModel } from "../../core/models/generic-model.class";
import { ContactDetails } from "../contact-details.class";
import { EntityRef } from "../../core/models/entityRef.class";
export class OrderInvoice extends GenericModel {
  customer: DataRef = new DataRef();
  vehicleDetails: VehicleDetails = new VehicleDetails();
  orderId: string;
  remarks: string;
  serviceProvider: ServiceProvider = new ServiceProvider();
  consignorSignatureId: string;
  consignorName: string;
  consignorNumber: string;
  paymentDetail: PaymentDetail = new PaymentDetail();
  orderPickupSources: OrderPickupSource[] = [];
  orderDeliveryLocations: OrderDeliveryLocation[] = [];
  state: OrderStateEnum;
  requestedTime: number;
  changeType: OrderChangeTypeEnum;
}

export enum OrderChangeTypeEnum {
  DEFAULT,
  NEW_DROP_LOCATION_ADDED,
  NEW_SOURCE_LOCATION_ADDED,
  DRIVER_CHANGED,
  VEHICLE_CHANGED,
  VEHICLE_DRIVER_CHANGED,
  FREIGHT_UPDATED,
  VEHICLE_ASSIGNED_FOR_HCV,
  UPDATE_REQUESTED_BOOKING_TIME,
}

export class PaymentDetail {
  freightCharge: number = 0;
  gstTax: number = 0;
  haltTimeCharge: number = 0;
  labourCharge: number = 0;
  tollAmount: number = 0;
  fine: number = 0;
  discount: number = 0;
  remark: string;
  invoice: DataRef = new DataRef();
  driverFare: number = 0;
  dieselFare: number =0;
  advance: number = 0;
  remainingAmount: number = 0;
  totalAmount: number = 0;
  tdsAmount: number = 0;
}

export class OrderDeliveryLocation {
  lrId: string;
  packages: OrderPackage[] = [];
  address: DetailedAddress = new DetailedAddress();
  podFileId: string;
  consigneeName: string;
  consigneeSignatureId: string;
  confirmationOtp: string;
  timeStats: DeliveryOperationTimeStats = new DeliveryOperationTimeStats();
  charges: FreightChargeDetail = new FreightChargeDetail();
  consigneeNotification: ConsigneeNotificaton = new ConsigneeNotificaton();
  labourCount: number;
  consigneeFeedbackId: string;
  physicalPod: PhysicalPod = new PhysicalPod();
}

export class PhysicalPod {
  location: DetailedAddress = new DetailedAddress();
  podAvailable: boolean = false;
  submittedBy: DataRef = new DataRef();
  receivedBy: DataRef = new DataRef();
}

export class ConsigneeNotificaton {
  consigneeContact: ContactDetails = new ContactDetails();
  notificationDeliveries: NotificationDelivery[] = [];
  isNotificationSent: boolean;
}

export class NotificationDelivery {
  time: string;
  status: NotificationDeliveryEnum;
  serviceId: string;
  error: string;
}

export enum NotificationDeliveryEnum {
  NO_STATUS,
  DELIVERED,
  NOT_DELIVERED,
  ERROR,
}

export class FreightChargeDetail {
  amount: number;
  extra: number;
  haltCharge: HaltChargeDetail = new HaltChargeDetail();
}

export class HaltChargeDetail {
  charge: number;
  reason: string;
  duration: TimeRange = new TimeRange();
}

export class TimeRange {
  startTimeInMillis: number;
  endTimeInMillis: number;
}

export class OrderPickupSource {
  packages: OrderPackage[] = [];
  address: DetailedAddress = new DetailedAddress();
  loadNo: string;
  labourCount: number;
  timeStats: DeliveryOperationTimeStats = new DeliveryOperationTimeStats();
  consignorFeedbackId: string;
}

export class OrderPackage {
  description: string;
  billNumber: string;
  amount: number;
  freightPayment: number;
}

export class DeliveryOperationTimeStats {
  type: DeliveryOperationTypeEnum;
  arrivalTime: number;
  workStart: number;
  workEnd: number;
}

export enum DeliveryOperationTypeEnum {
  PICKUP,
  DELIVERY,
}

export class ServiceProvider {
  vehicleLoadType: string;
  provider: DataRef;
  bookingRequestId: string;
}

export class VehicleDetails {
  vehicle: DataRef = new DataRef();
  vehicleRegNo: string;
  driver: DataRef = new DataRef();
}

export enum OrderStateEnum {
  CREATED, // when order created first time, available for update by Admin or TAP or Customer
  READY_FOR_PICKUP, // when 1 hour before alarm buzzed then it will show to driver with this state
  READY_FOR_SHIPPING, // when first pickup point timeStats.workEnd is non-zero miliseconds then update this state
  SHIPPING_COMPLETE, // when last delivery point timeState.reached is non-zero miliseconds then update this state
  DELIVERY_DONE, // when last delivery point timeState.workEnd is non-zero miliseconds then update this state
  ORDER_COMPLETED,
  CANCELLED, // when admin cancelled the order
  REJECTED, // when admin rejected the order
}
