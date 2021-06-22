import { GenericSReq } from '../../core/models/generic-search-req.class';
import { NatureOfConsignmentEnum } from '../enums/consignment-nature-type.enum';
export class WareHouseSearchReq extends GenericSReq {
    name?: string;
    natureOfConsignments?: NatureOfConsignmentEnum;
    businessId?: string;
    warehouseKeeperId?: string;
}