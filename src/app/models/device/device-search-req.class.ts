import { GenericSReq } from '../../core/models/generic-search-req.class';
import { DeviceAccessConfig } from './device-access-config.class';
import { DataRef } from 'src/app/core/models/dataRef.class';
export class DeviceSearchRequest extends GenericSReq {

    deviceId?: string;
    accessConfig?: DeviceAccessConfig;
    warehouseRef?: DataRef;
}