import { VehicleStatusEnum } from '../../models/vehicle-info/vehicle-status.enum';
import { ServiceTypeEnum } from '../../models/vehicle-info/vehicle-service-type.enum';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class VehicleStatusEnumProvider {

    public getAllVehicleStatusTypes(): VehicleStatusEnum[] {
        let status: VehicleStatusEnum[] = [];
        status.push(VehicleStatusEnum.AVAILABLE);
        status.push(VehicleStatusEnum.NOT_USED);
        status.push(VehicleStatusEnum.RUNNING);
        status.push(VehicleStatusEnum.HALT);
        return status;

    }

    public getVehicleStatus(status: VehicleStatusEnum): string {
        switch (status) {
            case VehicleStatusEnum.AVAILABLE:
                return "Available";
            case VehicleStatusEnum.HALT:
                return "Halt";
            case VehicleStatusEnum.NOT_USED:
                return "Not In Used";
            case VehicleStatusEnum.RUNNING:
                return "Running";
            default:
                return "";
        }
    }
}