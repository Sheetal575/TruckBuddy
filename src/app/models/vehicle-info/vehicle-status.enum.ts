import { Injectable } from '@angular/core';

export enum VehicleStatusEnum{
    RUNNING="RUNNING",
    HALT="HALT",
    AVAILABLE="AVAILABLE",
    NOT_USED="NOT_USED"
}

@Injectable({
    providedIn:'root'
})
export class VehicleStatusEnumFormatter{

    public format(status: VehicleStatusEnum):string{
        switch(status){
            case VehicleStatusEnum.AVAILABLE:
                return "Available";
            case VehicleStatusEnum.HALT:
                return "Halt";
            case VehicleStatusEnum.NOT_USED:
                return "Not Used";
            case VehicleStatusEnum.RUNNING:
                return "Running";
            default:
                throw 'Invalid Vehicle Status Type';
        }
    }
}