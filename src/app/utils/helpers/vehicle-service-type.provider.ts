import { ServiceTypeEnum } from './../../models/vehicle-info/vehicle-service-type.enum';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn:'root'
})
export class VehicleServiceTypeProvider{

    public getAllVehicleServiceTypes(): ServiceTypeEnum[]{
        let serviceTypes: ServiceTypeEnum[] = [];
        serviceTypes.push(ServiceTypeEnum.EXPRESS);
        serviceTypes.push(ServiceTypeEnum.RELAY);
        return serviceTypes;

    }
}