import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportServiceService {
  //all reports
  reports: any[] = [
    {
       id:0,
       heading:"Driver Vehicle Assignment Report",
       subheading:"(All Bookings Driver-Vehicle Assignment Report)",
    },
    {
       id:1,
       heading:"Invoice Generation Report",
       subheading:"(All Bookings Order Invoice Generation Report)",
    },
    {
      id:2,
      heading:"Vehicle Distance Covered Report",
      subheading:"(Vehicle Covered Distance for booking)",
    },
    {
        id:3,
        heading:"Vehicle Expense Report",
        subheading:"(Vehicle Expence Report for booking(s))",
    },
    {
      id:4,
      heading:"TAP Ledger Report",
      subheading:"(TAP Ledger for booking(s))",
    },
    {
      id:5,
      heading:"Order Report",
      subheading:"(All accepted Booking Request(s) Order Invoice Report)",
    },
    {
      id:6,
      heading:"TAP Request Assignment Report",
      subheading:"(All Booking Request approved by TAP)",
    },
    {
      id:7,
      heading:"Raised Request Assignment Report",
      subheading:"(All Raised Booking Request Report)",
    }
  ]
  constructor(private http : HttpClient) { }
  time:{};//get the date time in milliseconds
  clientid:string; //id of every client
  dateToShow: any; //get date and time to show on report name when downloaded


  downloadReport(path: string,argument: {}): Observable<any>{
    return this.http.post(path,argument,{
      responseType: "blob",
    })
    
  }
  
}
