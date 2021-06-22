import { GenericModel } from '../../core/models/generic-model.class';
import { DeviceAccessConfig } from './device-access-config.class';
import { DataRef } from 'src/app/core/models/dataRef.class';
export class Device extends GenericModel {

    deviceId?: string;
    accessConfig?: DeviceAccessConfig;
    pushNotificationTokenId?: string;
    warehouseRef?: DataRef;

    public static toDevice(json: string): Device {
        return JSON.parse(json);
    }

    public static DeviceToJson(value: Device): string {
        return JSON.stringify(value);
    }
}