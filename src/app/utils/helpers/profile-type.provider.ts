import { ProfileTypeEnum } from './../../models/profile/profile-type.enum';
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ProfileTypeProvider {
    public getAllProfileType(profileType: any): ProfileTypeEnum[] {
        let profileTypes: ProfileTypeEnum[] = [];
        switch (profileType) {
            case 'SUPER_ADMIN': {
                profileTypes.push(ProfileTypeEnum.CLIENT_MANAGER);
                // profileTypes.push(ProfileTypeEnum.CLIENT_WAREHOUSE_KEEPER);
                profileTypes.push(ProfileTypeEnum.TAP_OWNER);
                profileTypes.push(ProfileTypeEnum.TAP_DRIVER);
                // profileTypes.push(ProfileTypeEnum.TAP_HELPER);
                profileTypes.push(ProfileTypeEnum.TRUCKBUDDY_SUPPORT);
                profileTypes.push(ProfileTypeEnum.TRUCKBUDDY_ADMIN);
                profileTypes.push(ProfileTypeEnum.SUPER_ADMIN);
                return profileTypes;
            }
            case 'TRUCKBUDDY_ADMIN': {
                profileTypes.push(ProfileTypeEnum.CLIENT_MANAGER);
                // profileTypes.push(ProfileTypeEnum.CLIENT_WAREHOUSE_KEEPER);
                profileTypes.push(ProfileTypeEnum.TAP_OWNER);
                profileTypes.push(ProfileTypeEnum.TAP_DRIVER);
                // profileTypes.push(ProfileTypeEnum.TAP_HELPER);
                profileTypes.push(ProfileTypeEnum.TRUCKBUDDY_SUPPORT);
                profileTypes.push(ProfileTypeEnum.TRUCKBUDDY_ADMIN);
                return profileTypes;
            }
            case 'TRUCKBUDDY_SUPPORT': {
                profileTypes.push(ProfileTypeEnum.CLIENT_MANAGER);
                // profileTypes.push(ProfileTypeEnum.CLIENT_WAREHOUSE_KEEPER);
                profileTypes.push(ProfileTypeEnum.TAP_OWNER);
                profileTypes.push(ProfileTypeEnum.TAP_DRIVER);
                // profileTypes.push(ProfileTypeEnum.TAP_HELPER);
                profileTypes.push(ProfileTypeEnum.TRUCKBUDDY_SUPPORT);
                return profileTypes;
            }
            case 'CLIENT_MANAGER': {
                profileTypes.push(ProfileTypeEnum.CLIENT_MANAGER);
                // profileTypes.push(ProfileTypeEnum.CLIENT_WAREHOUSE_KEEPER);
                return profileTypes;
            }
            case 'TAP_OWNER': {
             profileTypes.push(ProfileTypeEnum.TAP_DRIVER);
                // profileTypes.push(ProfileTypeEnum.TAP_HELPER);
                return profileTypes;
            }
            default: {
                throw 'UNKNOWN Profile type';
            }
        }
    }
}