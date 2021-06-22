import { DataRef } from 'src/app/core/models/dataRef.class';
import { GenericModel } from 'src/app/core/models/generic-model.class';
export class Login extends GenericModel{

    profileRef?: DataRef;
    password?: string;

    public static toLogin(json: string): Login {
        return JSON.parse(json);
    }

    public static LoginToJson(value: Login): string {
        return JSON.stringify(value);
    }
}