import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { URLProvider, EnvironmentType } from "../config/url-provider";

@Injectable({
  providedIn: "root",
})
export class RestService {
  private actionUrl: string;
  private imageUrl: string;
  private orderTrackingUrl: string;
  private headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json; charset=utf-8",
  });

  constructor(private urlProvider: URLProvider, private http: HttpClient) { 
    this.actionUrl = urlProvider.getURL(EnvironmentType.PROD);
    this.imageUrl = urlProvider.getImageURL();
    this.orderTrackingUrl = urlProvider.getOrderTrackingURL();
  }
  search<T>(path: string, query: any): Observable<T> {
    return this.http.get<T>(
      this.actionUrl + `${path}?query=` + JSON.stringify(query),
      {
        headers: this.headers,
      }
    );
  }

  get<T>(path: string, id: string): Observable<T> {
    return this.http.get<T>(this.actionUrl + `${path}/${id}`, {
      headers: this.headers,
    });
  }

  customGet<T>(path: string): Observable<T> {
    return this.http.get<T>(`${path}`);
  }

  getImageUrl(): string {
    return this.imageUrl;
  }

  getOrderTrackingUrl(): string {
    return this.orderTrackingUrl;
  }

  post<T>(path: string, payload: any): Observable<T> {
    return this.http.post<T>(
      this.actionUrl + `${path}`,
      JSON.stringify(payload),
      {
        headers: this.headers,
      }
    );
  }

  uploadImage<T>(formData: FormData): Observable<any> {
    const req = new HttpRequest(
      "POST",
      this.actionUrl + "fileStorage",
      formData,
      {
        reportProgress: false,
        responseType: "text",
      }
    );
    return this.http.request(req);
  }

  put<T>(path: string, id: string, payload: any): Observable<T> {
    return this.http.put<T>(this.actionUrl + `${path}/${id}`, payload, {
      headers: this.headers,
    });
  }

  delete<T>(path: string, id: string): Observable<T> {
    return this.http.delete<T>(this.actionUrl + `${path}/${id}`, {
      headers: this.headers,
    });
  }

}
