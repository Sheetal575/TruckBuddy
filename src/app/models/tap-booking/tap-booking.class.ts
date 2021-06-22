import { GenericModel } from '../../core/models/generic-model.class';
import { DataRef } from 'src/app/core/models/dataRef.class';
import { TapBookingStatusEnum } from './tap-booking-status.enum';
import { RejectionReasonsForTapEnum } from './tap-rejection-reason.enum';
import { Penality } from '../penality/penality.class';
export class TapBooking extends GenericModel {
    tapRef?: DataRef;
    bookingRequestRef?: DataRef;
    status?: TapBookingStatusEnum;
    reasonOfRejection?: RejectionReasonsForTapEnum;
    penalty?: Penality;

    public static toTapBooking(json: string): TapBooking {
        return JSON.parse(json);
    }

    public static TapBookingToJson(value: TapBooking): string {
        return JSON.stringify(value);
    }
}