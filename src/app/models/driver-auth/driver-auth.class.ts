// To parse this data:
//
//   import { Convert, DriverAuth } from "./file";
import { GenericModel } from '../../core/models/generic-model.class';
import { DataRef } from '../../core/models/dataRef.class';
//
//   const driverAuth = Convert.toDriverAuth(json);

export class DriverAuth  extends GenericModel{
    driver:                DataRef;
    authEvent:             string;
    fromLocation:          FromLocation;
    proofDocId:            string;
    extraDetails:          ExtraDetail[];
    vehicle:               DataRef;
    distanceFromLastEvent: number;
}


export class ExtraDetail {
    type:                string;
    refDocId:            string;
    manualReadingEntrty: string;
}

export class FromLocation {
    type:        string;
    coordinates: number[];
}


