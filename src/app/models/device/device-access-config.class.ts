import { DataRef } from 'src/app/core/models/dataRef.class';
import { NatureOfConsignmentEnum } from '../enums/consignment-nature-type.enum';

export class DeviceAccessConfig {
    managerProfileRef?: DataRef;
    authenticationId?: string;
    natureOfConsignment?: NatureOfConsignmentEnum;
}