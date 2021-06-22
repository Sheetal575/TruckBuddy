import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RestService } from '../core/rest-service/rest.service';
import { DriverAuthReq } from '../models/driver-auth/driver-auth.req';
import { DriverAuth } from '../models/driver-auth/driver-auth.class';

@Injectable({
  providedIn: "root",
})
export class DriverAuthService {
  private path: string = "driverAuth";
  constructor(private restService: RestService) { }

  search(
    query: DriverAuthReq
  ): Observable<DriverAuth[]> {
    return this.restService.post<DriverAuth[]>(
      this.path + "/search",
      query
    );
  }



}