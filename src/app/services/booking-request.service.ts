import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BookingRequest } from "../models/booking-request/booking-request.class";
import { BookingSearchReq } from "../models/booking-request/booking-search-req.class";
import { RestService } from "./../core/rest-service/rest.service";
import { VehicleBooking } from "../models/vehicle-booking/vehicle-booking.class";

@Injectable({
  providedIn: "root",
})
export class BookingRequestService {
  path: string = "bookingRequest";
  constructor(private restService: RestService) {}

  getBookingRequest(id: string): Observable<BookingRequest> {
    return this.restService.get<BookingRequest>(this.path, id);
  }

  searchBookingRequest(
    bookingSearchReq: BookingSearchReq
  ): Observable<BookingRequest[]> {
    return this.restService.search<BookingRequest[]>(
      this.path,
      bookingSearchReq
    );
  }

  customSearchBookingRequest(
    bookingSearchReq: BookingSearchReq
  ): Observable<BookingRequest[]> {
    return this.restService.post<BookingRequest[]>(
      this.path + "/search",
      bookingSearchReq
    );
  }

  createBookingRequest(bookingRequest: BookingRequest): Observable<any> {
    return this.restService.post<any>(this.path + "/handleBr", bookingRequest);
  }

  acceptVehicleBooking(
    vehicleBooking: VehicleBooking
  ): Observable<VehicleBooking> {
    return this.restService.post<VehicleBooking>(
      this.path + "/handleVb",
      vehicleBooking
    );
  }

  cancelBookingRequest(
    bookingRequest: BookingRequest
  ): Observable<BookingRequest> {
    return this.restService.post<BookingRequest>(
      this.path + "/cancelBr",
      bookingRequest
    );
  }

  updateBookingRequest(
    bookingRequest: BookingRequest
  ): Observable<BookingRequest> {
    if (bookingRequest != null && bookingRequest.id != null) {
      return this.restService.put<BookingRequest>(
        this.path,
        bookingRequest.id,
        bookingRequest
      );
    }
    throw "Invalid data. ID not found " + JSON.stringify(bookingRequest);
  }

  deleteBookingRequest(id: string): Observable<BookingRequest> {
    return this.restService.delete<BookingRequest>(this.path, id);
  }
}
