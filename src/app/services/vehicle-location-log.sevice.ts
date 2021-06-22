import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RestService } from '../core/rest-service/rest.service';
import { VehicleLocationLogSRequest } from '../models/vehicle-location-log/vehicle-location-log-search-req.class';
import { VehicleLocationLog } from '../models/vehicle-location-log/vehicle-location-log.class';

@Injectable({
  providedIn: "root",
})
export class VehicleLocationLogService {
  private path: string = "vehicleLocationLog";
  constructor(private restService: RestService) {}

  searchVehicles(
    query: VehicleLocationLogSRequest
  ): Observable<VehicleLocationLog[]> {
    return this.restService.search<VehicleLocationLog[]>(this.path, query);
  }
  customSearchVehicles(
    query: VehicleLocationLogSRequest
  ): Observable<VehicleLocationLog[]> {
    return this.restService.post<VehicleLocationLog[]>(
      this.path + "/search",
      query
    );
  }

  getVehicleLog(id: string): Observable<VehicleLocationLog> {
    return this.restService.get<VehicleLocationLog>(this.path, id);
  }

  getAllVehiclesLastLog(data: string): Observable<VehicleLocationLog[]> {
    return this.restService.get<VehicleLocationLog[]>(this.path, data);
  }
}