import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportServiceService } from '../../report-service/report-service.service';


@Component({
  selector: 'app-view-reports',
  templateUrl: './view-reports.component.html',
  styleUrls: ['./view-reports.component.sass']
})
export class ViewReportsComponent implements OnInit {

  heading = "View Variours Reports";
  subheading = "Here you can download various reports";
  icon = "pe-7s-note2 icon-gradient bg-tempting-azure";

  constructor(private route: ActivatedRoute,private reportservice:ReportServiceService) { }
   sub;
   id: any;
   products = [];
   product= {}
  ngOnInit() {
      this.route.paramMap.subscribe(params => { 
          this.id = params.get('id');
          this.products=this.reportservice.reports;
          this.product=this.products.find(p => p.id==this.id); 
      });
  }

}
