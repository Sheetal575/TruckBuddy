import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { VehicleRideSRequest } from "../models/vehicle-ride/vehicle-ride-search-req.class";
import { VehicleRide } from "../models/vehicle-ride/vehicle-ride.class";
import { RestService } from "./../core/rest-service/rest.service";

@Injectable({
  providedIn: "root",
})
export class VehicleRideService {
  path: string = "vehicleRide";
  constructor(private restService: RestService) {}

  getVehicleRide(id: string): Observable<VehicleRide> {
    return this.restService.get<VehicleRide>(this.path, id);
  }

  searchVehicleRide(
    vehicleRideSearchReq: VehicleRideSRequest
  ): Observable<VehicleRide[]> {
    return this.restService.search<VehicleRide[]>(
      this.path,
      vehicleRideSearchReq
    );
  }

  customSearchVehicleRide(
    vehicleRideSearchReq: VehicleRideSRequest
  ): Observable<VehicleRide[]> {
    return this.restService.post<VehicleRide[]>(
      this.path + "/search",
      vehicleRideSearchReq
    );
  }

  createVehicleRide(vehicleRide: VehicleRide): Observable<VehicleRide> {
    return this.restService.post<VehicleRide>(this.path, vehicleRide);
  }

  updateVehicleRide(vehicleRide: VehicleRide): Observable<VehicleRide> {
    if (vehicleRide != null && vehicleRide.id != null) {
      return this.restService.put<VehicleRide>(
        this.path,
        vehicleRide.id,
        vehicleRide
      );
    }
    throw "Invalid data. ID not found " + JSON.stringify(vehicleRide);
  }

  deleteVehicleRide(id: string): Observable<VehicleRide> {
    return this.restService.delete<VehicleRide>(this.path, id);
  }
}
