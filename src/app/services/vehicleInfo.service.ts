import { VehicleSearchReq } from "./../models/vehicle-info/vehicle-search-req.class";
import { VehicleInfo } from "./../models/vehicle-info/vehicle-info.class";
import { RestService } from "./../core/rest-service/rest.service";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class VehicleInfoService {
  path: string = "vehicleInfo";
  constructor(private restService: RestService) {}

  getVehicle(id: string): Observable<VehicleInfo> {
    return this.restService.get<VehicleInfo>(this.path, id);
  }

  searchVehicle(vehicleSearchReq: VehicleSearchReq): Observable<VehicleInfo[]> {
    return this.restService.search<VehicleInfo[]>(this.path, vehicleSearchReq);
  }

  customSearchVehicle(
    vehicleSearchReq: VehicleSearchReq
  ): Observable<VehicleInfo[]> {
    return this.restService.post<VehicleInfo[]>(
      this.path + "/search",
      vehicleSearchReq
    );
  }

  createVehicle(vehicleInfo: VehicleInfo): Observable<VehicleInfo> {
    return this.restService.post<VehicleInfo>(this.path, vehicleInfo);
  }

  updateVehicle(vehicleInfo: VehicleInfo): Observable<VehicleInfo> {
    if (vehicleInfo != null && vehicleInfo.id != null) {
      return this.restService.put<VehicleInfo>(
        this.path,
        vehicleInfo.id,
        vehicleInfo
      );
    }
    throw "Invalid data. ID not found " + JSON.stringify(vehicleInfo);
  }

  checkDriverAvailability(id: string) {
      if(id){
         return  this.restService.get(this.path+"/checkDriverAvailablility",id) 
      }
      throw "Invalid data " + id;
  }

  deleteVehicle(id: string): Observable<VehicleInfo> {
    return this.restService.delete<VehicleInfo>(this.path, id);
  }
}
