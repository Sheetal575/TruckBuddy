import { GenericModel } from '../../core/models/generic-model.class';
import { DetailedAddress } from '../detailed-address.class';
import { DataRef } from 'src/app/core/models/dataRef.class';
import { TapInfo } from '../tap-info.class';
export class VehicleLocationLog extends GenericModel {

    lastLocation?: DetailedAddress;
    extraData?: string;
    distanceCovered?: number;
    driverRef?: DataRef;
    tripRef?: DataRef;
    tapInfo?: TapInfo;
    vehicleRef?: DataRef;
    vehicleCategoryId?: string;
    haltTimeInSec?: number;
    isForLogging: boolean;

    public static toVehicleLocationLog(json: string): VehicleLocationLog {
        return JSON.parse(json);
    }

    public static vehicleLocationLogToJson(value: VehicleLocationLog): string {
        return JSON.stringify(value);
    }

}