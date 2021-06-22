import { TimeRange } from '../order-invoice/order-invoice.class';


export class DriverAuthReq {
    driverId: string;
    vehicleId: string;
    createdAtRange: TimeRange;
}