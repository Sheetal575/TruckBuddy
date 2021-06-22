import { DataRef } from 'src/app/core/models/dataRef.class';
import { GenericModel } from 'src/app/core/models/generic-model.class';
export class LoginSearchReq extends GenericModel{

    profileId?: string;
    password?: string;

    public static toLoginSearchReq(json: string): LoginSearchReq {
        return JSON.parse(json);
    }

    public static LoginSearchReqToJson(value: LoginSearchReq): string {
        return JSON.stringify(value);
    }
}