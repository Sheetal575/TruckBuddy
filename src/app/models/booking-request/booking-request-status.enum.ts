export enum BookingRequestStatusEnum {
  AWAITED,
  ACCEPTED,
  DECLINED,
}

export class BookingRequestStatusFormatter{
    public format(status: BookingRequestStatusEnum){
        switch(status){
            case BookingRequestStatusEnum.ACCEPTED:
                return "Accepted";
            case BookingRequestStatusEnum.AWAITED:
                return "Awaited"
            case BookingRequestStatusEnum.DECLINED:
                return "Declined";
            default:
                return "Unknown";
        }
    }
}