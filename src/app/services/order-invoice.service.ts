import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { OrderInvoiceSearchRequest } from '../models/order-invoice/order-invoice-search-req.class';
import { OrderInvoice } from '../models/order-invoice/order-invoice.class';
import { RestService } from "./../core/rest-service/rest.service";

@Injectable({
  providedIn: "root",
})
export class OrderInvoiceService {
  path: string = "orderInvoice";
  constructor(private restService: RestService) {}

  getOrderInvoice(id: string): Observable<OrderInvoice> {
    return this.restService.get<OrderInvoice>(this.path, id);
  }

  
  getOrderInvoiceByOrderId(orderId: string): Observable<OrderInvoice> { 
    return this.restService.get<OrderInvoice>(this.path+"/orderId", orderId);
  }

  searchOrderInvoice(
    orderInvoiceSearchRequest: OrderInvoiceSearchRequest
  ): Observable<OrderInvoice[]> {
    return this.restService.search<OrderInvoice[]>(
      this.path,
      orderInvoiceSearchRequest
    );
  }

  customSearchOrderInvoice(
    orderInvoiceSearchRequest: OrderInvoiceSearchRequest
  ): Observable<OrderInvoice[]> {
    return this.restService.post<OrderInvoice[]>(
      this.path + "/search",
      orderInvoiceSearchRequest
    );
  }

  createOrderInvoice(orderInvoice: OrderInvoice): Observable<any> {
    return this.restService.post<any>(this.path , orderInvoice);
  }

  updateOrderInvoice(
    orderInvoice: OrderInvoice
  ): Observable<OrderInvoice> {
    if (orderInvoice != null && orderInvoice.id != null) {
      return this.restService.put<OrderInvoice>(
        this.path,
        orderInvoice.id,
        orderInvoice
      );
    }
    throw "Invalid data. ID not found " + JSON.stringify(orderInvoice);
  }

  deleteOrderInvoice(id: string): Observable<OrderInvoice> {
    return this.restService.delete<OrderInvoice>(this.path, id);
  }
}
