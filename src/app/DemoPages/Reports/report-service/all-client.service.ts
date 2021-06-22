import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client } from './client.model';

@Injectable({
  providedIn: 'root'
})
export class AllClientService {

  constructor(private http:HttpClient) { }
  //url to get all client
  clientUrl = " https://tbapi.truckbuddy.co.in/business/search"
  //body agrument o get all client
  body = {
    "businessType": 2
  }

  //http request to get all the clients
  getAllClients(){
    return this.http.post<Client[]>("https://tbapi.truckbuddy.co.in/business/search",{"businessType": 2})
  }
}
