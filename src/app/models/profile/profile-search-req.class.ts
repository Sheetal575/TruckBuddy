import { GenericSReq } from "../../core/models/generic-search-req.class";
import { ContactDetails } from "../contact-details.class";
import { ProfileTypeEnum } from "./profile-type.enum";
import { VerificationStateEnum } from "./verification-status.enum";
export class ProfileSearchReq extends GenericSReq {
  name?: string;
  email?: string;
  mobile?: string;
  profileType?: ProfileTypeEnum;
  profileState?: VerificationStateEnum;
  profileTypeList?: ProfileTypeEnum[];
  city?: string;
}
