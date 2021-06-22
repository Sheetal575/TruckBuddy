import { GenericSReq } from '../../core/models/generic-search-req.class';
import { DataRef } from 'src/app/core/models/dataRef.class';
export class FeatureMapSRequest extends GenericSReq {

    value?: DataRef;
    mappedTo?: DataRef;

}
