import { GenericSReq } from '../../core/models/generic-search-req.class';
export class VehicleCategorySearchRequest extends GenericSReq {
    maxLoadWeight?: number;
    minLoadWeight?: number;
    wheel?: number;
    referenceTexts?: string[];
    sizeFeet?: number;
}