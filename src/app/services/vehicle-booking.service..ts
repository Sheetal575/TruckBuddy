import { VehicleCategorySearchRequest } from "./../models/vehicle-category/vehicle-category-search-req.class";
import { Observable } from "rxjs";
import { RestService } from "./../core/rest-service/rest.service";
import { Injectable } from "@angular/core";
import { VehicleCategory } from "../models/vehicle-category/vehicle-category.class";
import { VehicleBooking } from "../models/vehicle-booking/vehicle-booking.class";
import { VehicleBookingSearchReq } from "../models/vehicle-booking/vehicle-booking-search-req.class";

@Injectable({
  providedIn: "root",
})
export class VehicleBookingService {
  path: string = "vehicleBooking";
  constructor(private restService: RestService) {}

  getVehicleBooking(id: string): Observable<VehicleBooking> {
    return this.restService.get<VehicleBooking>(this.path, id);
  }

  searchVehicleBooking(
    vehicleBookingSearchReq: VehicleBookingSearchReq
  ): Observable<VehicleBooking[]> {
    return this.restService.search<VehicleBooking[]>(
      this.path,
      vehicleBookingSearchReq
    );
  }

  customSearchVehicleBooking(
    vehicleBookingSearchReq: VehicleBookingSearchReq
  ): Observable<VehicleBooking[]> {
    return this.restService.post<VehicleBooking[]>(
      this.path + "/search",
      vehicleBookingSearchReq
    );
  }

  createVehicleBooking(
    vehicleBooking: VehicleBooking
  ): Observable<VehicleBooking> {
    return this.restService.post<VehicleBooking>(this.path, vehicleBooking);
  }

  createAndAcceptVehicleBooking(
    vehicleBooking: VehicleBooking
  ): Observable<VehicleBooking> {
    return this.restService.post<VehicleBooking>(this.path+"/createExt", vehicleBooking);
  }

  updateVehicleBooking(
    vehicleBooking: VehicleBooking
  ): Observable<VehicleBooking> {
    if (vehicleBooking != null && vehicleBooking.id != null) {
      return this.restService.put<VehicleBooking>(
        this.path,
        vehicleBooking.id,
        vehicleBooking
      );
    }
    throw "Invalid data. ID not found " + JSON.stringify(vehicleBooking);
  }

  deleteVehicleBooking(id: string): Observable<VehicleBooking> {
    return this.restService.delete<VehicleBooking>(this.path, id);
  }
}
