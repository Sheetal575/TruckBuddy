import { GenericModel } from "../../core/models/generic-model.class";
import { DetailedAddress } from "../detailed-address.class";
import { OrderStateEnum } from "../order-invoice/order-invoice.class";
import { DataRef } from "../../core/models/dataRef.class";
export class VehicleRide extends GenericModel {
  routes: Route[] = [];
  driverInfo: DataRef = new DataRef();
  tapInfo: DataRef = new DataRef();
  vehicleInfo: DataRef = new DataRef();
  rideStats: RideStats = new RideStats();
}

export class Route {
  orderDelivery: DeliveryInfo = new DeliveryInfo();
  location: DetailedAddress = new DetailedAddress();
}

export class DeliveryInfo {
  id: string;
  delivery: DeliveryRef = new DeliveryRef();
}

export class DeliveryRef {
  time: number;
  status: OrderStateEnum;
}

export class RideStats {
  startTimeInMillis: number;
  stopTimeInMillis: number;
  totalHaltTimeInMillis: number;
  totalDistanceCovered: number;
  expenses: Expense[] = [];
}

export class Expense {
  amount: number;
  purpose: string;
}
