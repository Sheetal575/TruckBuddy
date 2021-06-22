import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { MatSort, MatPaginator, MatTableDataSource } from "@angular/material";
import { OrderInvoiceSearchRequest } from "src/app/models/order-invoice/order-invoice-search-req.class";
import { OrderInvoice } from "../../../models/order-invoice/order-invoice.class";
import { OrderInvoiceService } from "../../../services/order-invoice.service";

@Component({
  selector: "app-list-order-invoice",
  templateUrl: "./list-order-invoice.component.html",
  styleUrls: ["./list-order-invoice.component.sass"],
})
export class ListOrderInvoiceComponent implements OnInit, AfterViewInit {
  public displayedColumns = [
    "orderId",
    "customerName",
    "vehicleReqNumber",
    "driverName",
    "requestedTime",
    "state",
    "action",
  ];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public dataSource = new MatTableDataSource<OrderInvoice>();
  orderInvoices: OrderInvoice[] = [];

  constructor(private orderInvoiceService: OrderInvoiceService) {}

  ngAfterViewInit(): void {
    this.dataSource.filterPredicate = (data: any, filter) => {
      const dataStr = JSON.stringify(data).toLowerCase();
      return dataStr.indexOf(filter) != -1;
    };
    this.dataSource.sortingDataAccessor = (item, property) => {
      // Split '.' to allow accessing property of nested object
      switch (property) {
        case "orderId":
          return item.orderId;
        case "customerName":
          return item.customer.name;
        case "vehicleReqNumber":
          return item.vehicleDetails.vehicleRegNo;
        case "driverName":
          return item.vehicleDetails.driver.name;
        case "requestedTime":
          return item.requestedTime;
        case "state":
          return item.state;
      }
    };
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  };

  getDate(requestedTime: number): Date {
    return new Date(requestedTime);
  }

  async ngOnInit() {
    var orderInvoiceReq = new OrderInvoiceSearchRequest();
    orderInvoiceReq.isDelete = false;
    this.orderInvoices = await this.orderInvoiceService
      .customSearchOrderInvoice(orderInvoiceReq)
      .toPromise();
    this.dataSource.data = this.orderInvoices.reverse();
  }
}
