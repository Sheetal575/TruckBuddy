import { Component, OnInit, Output } from '@angular/core';
import {  NgForm } from '@angular/forms';
import { ReportServiceService } from '../report-service/report-service.service';
import { ToastrService } from 'ngx-toastr';
import { DateTimeFormatEnum, DateTimeProvider } from 'src/app/core/utils/date-time.provider';
import { AllClientService } from '../report-service/all-client.service';
import { Client } from '../report-service/client.model';
import { ConnectionServiceModule } from 'ng-connection-service';
@Component({
  selector: 'app-report-page',
  templateUrl: './report-page.component.html',
  styleUrls: ['./report-page.component.sass']
})
export class ReportPageComponent implements OnInit {
  heading = "Reports";
  selectedLevel;
  subheading = "Here you can download all the required reports";
  icon = "pe-7s-menu icon-gradient bg-tempting-azure";
  allClient:Client[]=[];
  constructor(private reportsevice :ReportServiceService,
              private toastr : ToastrService,
              private dateUtil:DateTimeProvider,
              private allclientsService:AllClientService) { }
  
  ngOnInit() {
    this.getClients();  
  }

  showError(){
    this.toastr.error('Invalid Time Data')
  }
  showSuccessOnData(){
    this.toastr.success('Date and Time Set Successfully.')
  }
  //sending date-time data to to reports api
  sendTime(dateForm:NgForm){
    //conversion of date and time in millis--
    const startTimeInMillis = this.dateUtil.getMillis( dateForm.value.startDate,DateTimeFormatEnum.FULL_DATE_TIME);
    const endTimeInMillis =this.dateUtil.getMillis( dateForm.value.endDate,DateTimeFormatEnum.FULL_DATE_TIME);
    const time ={startTimeInMillis,endTimeInMillis};
    this.reportsevice.time = time;

    //to display name on reports when download--
    const date = dateForm.value.startDate+"_"+dateForm.value.endDate;
    this.reportsevice.dateToShow = date;

    //get id of each client--
    const id :string = dateForm.value.clientId;
    this.reportsevice.clientid = id;
    const data = {time:{startTimeInMillis,endTimeInMillis},id};
    console.log(data);
    //check that the data is valid or not
    if(data){
      this.showSuccessOnData();

    }else{
       this.showError();
    }   
  }
  //get all the clients
  getClients(){
    this.allclientsService.getAllClients().subscribe(
      (response)=>{
        this.allClient = response;
      },
      (error)=>{
        alert(error);
      }
    )
  }

}
