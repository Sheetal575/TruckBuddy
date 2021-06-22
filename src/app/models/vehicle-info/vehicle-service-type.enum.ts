import { Injectable } from '@angular/core';

export enum ServiceTypeEnum {
    RELAY="RELAY",
    EXPRESS="EXPRESS"
}

@Injectable({
    providedIn:'root'
})
export class ServiceTypeEnumFormatter{

    public format(serviceType: ServiceTypeEnum):string{
        switch(serviceType){
            case ServiceTypeEnum.EXPRESS:
                return "Express";
            case ServiceTypeEnum.RELAY:
                return "Relay";
            default:
                throw 'Invalid Vehicle Service Type';
        }
    }
}