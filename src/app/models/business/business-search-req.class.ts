import { GenericSReq } from '../../core/models/generic-search-req.class';
import { BusinessTypeEnum } from '../enums/business-type.enum';
import { ContactDetails } from '../contact-details.class';
import { AgreementDetails } from '../agreement-detail.class';
import { BusinessOwnership } from './business-ownership.class';
export class BusinessDesignSRequest extends GenericSReq {

    businessName?: string;
    businessType?: BusinessTypeEnum;
    contact?: ContactDetails;
    agreementDetails?: AgreementDetails;
    businessOwnership?: BusinessOwnership;
    city:string;
}