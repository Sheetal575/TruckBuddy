import { VehicleCategorySearchRequest } from './../models/vehicle-category/vehicle-category-search-req.class';
import { Observable } from 'rxjs';
import { RestService } from './../core/rest-service/rest.service';
import { Injectable } from '@angular/core';
import { VehicleCategory } from '../models/vehicle-category/vehicle-category.class';

@Injectable({
    providedIn:'root'
})
export class VehicleCategoryService{

    path: string ="vehicleCategory"
    constructor(private restService: RestService){}

    getVehicleCategory(id: string): Observable<VehicleCategory>{
       return this.restService.get<VehicleCategory>(this.path,id);
    }

    searchVehicleCategory(vehicleSearchReq: VehicleCategorySearchRequest): Observable<VehicleCategory[]>{
        return this.restService.search<VehicleCategory[]>(this.path,vehicleSearchReq);
     }

     customSearchVehicleCategory(vehicleSearchReq: VehicleCategorySearchRequest): Observable<VehicleCategory[]>{
        return this.restService.post<VehicleCategory[]>(this.path+"/search",vehicleSearchReq);
     }

    createVehicleCategory(vehicleCategory:VehicleCategory): Observable<VehicleCategory>{
        return this.restService.post<VehicleCategory>(this.path,vehicleCategory);
     }

     updateVehicleCategory(vehicleCategory:VehicleCategory): Observable<VehicleCategory>{
         if(vehicleCategory != null && vehicleCategory.id != null){
             return this.restService.put<VehicleCategory>(this.path,vehicleCategory.id,vehicleCategory);
         }
        throw 'Invalid data. ID not found '+JSON.stringify(vehicleCategory);
     }

    deleteVehicleCategory(id:string): Observable<VehicleCategory>{
        return this.restService.delete<VehicleCategory>(this.path,id);
    }
}