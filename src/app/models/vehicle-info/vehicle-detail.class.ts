import { VehicleInsurance } from './vehicle-insurance.class';
import { OriginLocation } from '../origin-location.class';
import { VehiclePermit } from './vehicle-permit.class';
export class VehicleDetail {

    regNumber?: string;
    permitInfo?: VehiclePermit;
    insuranceInfo?: VehicleInsurance;
    originFrom?: OriginLocation;

}