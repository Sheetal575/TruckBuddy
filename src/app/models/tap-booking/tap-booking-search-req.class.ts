import { GenericSReq } from '../../core/models/generic-search-req.class';
import { TapBookingStatusEnum } from './tap-booking-status.enum';
import { Penality } from '../penality/penality.class';
export class TapBookingSearchRequest extends GenericSReq {
    tapId?: string;
    bookingRequestId?: string;
    status?: TapBookingStatusEnum;
    penalty?: Penality;
}