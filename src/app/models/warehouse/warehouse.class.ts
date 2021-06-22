import { GenericModel } from '../../core/models/generic-model.class';
import { NatureOfConsignmentEnum } from '../enums/consignment-nature-type.enum';
import { DataRef } from 'src/app/core/models/dataRef.class';
import { PhysicalAddress } from '../physical-address.class';
export class WareHouse extends GenericModel {

    name?: string;
    natureOfConsignments?: NatureOfConsignmentEnum[];
    businessDataRef?: DataRef;
    address?: PhysicalAddress;
    warehouseKeeperRef?: DataRef;

    public static toWareHouse(json: string): WareHouse {
        return JSON.parse(json);
    }

    public static WareHouseToJson(value: WareHouse): string {
        return JSON.stringify(value);
    }
}