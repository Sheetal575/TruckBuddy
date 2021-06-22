import { GenericModel } from "src/app/core/models/generic-model.class";
import { ContactDetails } from "../contact-details.class";
import { PhysicalAddress } from "../physical-address.class";
import { ProfileTypeEnum } from "./profile-type.enum";
import { VerificationStateEnum } from "./verification-status.enum";
export class Profile extends GenericModel {
  fullName?: string;
  contact?: ContactDetails;
  address?: PhysicalAddress;
  profilePic?: string;
  type?: ProfileTypeEnum;
  state?: VerificationStateEnum;
  notificationToken: string;

  public static toProfile(json: string): Profile {
    return JSON.parse(json);
  }

  public static ProfileToJson(value: Profile): string {
    return JSON.stringify(value);
  }
}
