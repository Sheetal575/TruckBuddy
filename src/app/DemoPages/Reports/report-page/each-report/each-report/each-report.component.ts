import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { saveAs } from "file-saver";
import { ReportServiceService } from '../../../report-service/report-service.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-each-report',
  templateUrl: './each-report.component.html',
  styleUrls: ['./each-report.component.sass']
})
export class EachReportComponent implements OnInit {
  

  constructor(private http:HttpClient,private reportservice : ReportServiceService,private toastr : ToastrService) { }

  ngOnInit() {
  }
  reports: any[] =  this.reportservice.reports;
  disable:boolean[] =[
    true,false,false,true,true,false,false,true
  ]
  // requestCreatedTime = {
  //   "startTimeInMillis": 1619807400000,
  //   "endTimeInMillis": 1630434600000
  // }

  httpurl:any[]=[
    {url :""},
    {url:"https://tbapi.truckbuddy.co.in/paymentInvoice/search/report"},
    {url:" http://tbapi.truckbuddy.co.in/driverAuth/search/report"},
    {url:""},
    {url:""},
    {url:"https://tbapi.truckbuddy.co.in/orderInvoice/search/report"},
    {url:"https://tbapi.truckbuddy.co.in/bookingRequest/search/report"},
    {url:""},

  ]
   show(error){
    this.toastr.error('There is some Problem While generating this file')  
   }
   showFileStatus(){
     this.toastr.success('File Generated.')
     this.toastr.info ('File is Downloading...')
   }
   showErrorForInvoice(){
    this.toastr.error('Please Choose specific Client')
   }
    argument:any;

    //function will run after click on reports---
  getFile(index: number){
    console.log(index)
    let getUrl = this.httpurl[index];
    let url = getUrl.url;
    if(!url){
      alert("Cant get this file");
      console.log(url);
    }else{
      this.checkReport(index);
      return this.reportservice.downloadReport(url,this.argument)
      .subscribe(
        data=>{
           this.showFileStatus()
            saveAs(data,this.reportservice.reports[index].heading+this.reportservice.dateToShow+ '.csv');
        },
        error=>{
          this.show(error)
          if(index == 1){
            this.showErrorForInvoice();
          }
          console.log(error);
        }
      )
    }
    
  }

  //set body of http request according to the report---
  checkReport(index:number){
    const requestCreatedTime=this.reportservice.time;
    
    if(index == 1){
      const businessId = this.reportservice.clientid;
      const body = {requestCreatedTime,businessId};
      this.argument = body;
    }else if(index == 5){
      const customerId = this.reportservice.clientid;
      const body = {requestCreatedTime,customerId};
      this.argument = body;
    }else if(index == 6){
      const clientId = this.reportservice.clientid;
      
      const body = {requestCreatedTime,clientId};
      this.argument = body;
    }else if(index == 2){
      const createdAtRange = requestCreatedTime;
      const body = {createdAtRange};
      this.argument = body;
    }
  }
}


