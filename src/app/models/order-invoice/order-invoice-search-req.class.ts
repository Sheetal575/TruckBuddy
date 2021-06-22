import { GenericModel } from "../../core/models/generic-model.class";
import { OrderStateEnum } from "./order-invoice.class";
import { RideDetails } from "../ride.class";
export class OrderInvoiceSearchRequest extends GenericModel {
  customerId: string;
  vehicleId: string;
  orderId: string;
  serviceProviderId: string;
  rideDetails: RideDetails;
  orderStates: OrderStateEnum[] = [];
}
