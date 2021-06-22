import { GenericModel } from 'src/app/core/models/generic-model.class';
import { VehicleDetail } from './vehicle-detail.class';
import { DataRef } from 'src/app/core/models/dataRef.class';
import { VehicleStatusEnum } from './vehicle-status.enum';
import { ServiceTypeEnum } from './vehicle-service-type.enum';
import { TapInfo } from '../tap-info.class';
import { VerificationStateEnum } from '../profile/verification-status.enum';
export class VehicleInfo extends GenericModel{

    detail?: VehicleDetail;
    vehCategoryRef?: DataRef;
    driverRef?: DataRef;
    status?: VehicleStatusEnum;
    serviceType?: ServiceTypeEnum;
    tapInfo?: TapInfo;
    state?:VerificationStateEnum;

}
