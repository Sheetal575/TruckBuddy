import { GenericModel } from "../../core/models/generic-model.class";
import { BusinessOwnership } from "./business-ownership.class";
import { UIData } from "../ui-data.class";
import { BusinessTypeEnum } from "../enums/business-type.enum";
import { ContactDetails } from "../contact-details.class";
import { AgreementDetails } from "../agreement-detail.class";
import { DocumentArchive } from "../document/document-archieve.class";
import { DetailedAddress } from "../detailed-address.class";
import { VerificationStateEnum } from "../profile/verification-status.enum";

export class BusinessDesign extends GenericModel {
  businessName?: string;
  businessOwnerships?: BusinessOwnership[] = [];
  businessType?: BusinessTypeEnum;
  contact?: ContactDetails;
  uiData?: UIData;
  verificationDocs?: DocumentArchive = new DocumentArchive();
  agreementDetails?: AgreementDetails = new AgreementDetails();
  address?: DetailedAddress = new DetailedAddress();
  gst?: string;
  taxDetails?: TaxDetails = new TaxDetails();
  verificationState?: VerificationStateEnum;
}

export class TaxDetails {
  gst?: string;
  tds?: string;
}
