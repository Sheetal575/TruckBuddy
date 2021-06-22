import { BusinessDesign } from './../models/business/business-design.class';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RestService } from '../core/rest-service/rest.service';
import { Profile } from '../models/profile/profile.class';
import { BusinessDesignSRequest } from './../models/business/business-search-req.class';

@Injectable({
    providedIn: 'root',
})
export class BusinessService {

    path: string = 'business';
    constructor(private restService: RestService) { }

    getBusiness(id: string): Observable<BusinessDesign> {
        return this.restService.get<BusinessDesign>(this.path, id);
    }

    customSearchBusiness(businessSearchReq: BusinessDesignSRequest): Observable<BusinessDesign[]> {
        return this.restService.post<BusinessDesign[]>(this.path + "/search", businessSearchReq);
    }

    createBusinessDesign(businessDesign: BusinessDesign): Observable<BusinessDesign> {
        return this.restService.post<BusinessDesign>(this.path, businessDesign);
    }

    updateBusinessDesign(businessDesign: BusinessDesign): Observable<BusinessDesign> {
        if (businessDesign != null && businessDesign.id != null) {
            return this.restService.put<BusinessDesign>(this.path, businessDesign.id, businessDesign);
        }
        throw 'Invalid data. ID not found ' + JSON.stringify(businessDesign);
    }

    deleteBusinessDesign(id: string): Observable<BusinessDesign> {
        return this.restService.delete<BusinessDesign>(this.path, id);
    }
}