import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { RestService } from "../core/rest-service/rest.service";
import { DocumentSearchReq } from "../models/document/document-archieve-search-request.class";
import { DocumentArchive } from "../models/document/document-archieve.class";

@Injectable({
  providedIn: "root",
})
export class DocumentArchieveService {
  path: string = "documentArchive";
  constructor(private restService: RestService) {}

  getDocumentArchive(id: string): Observable<DocumentArchive> {
    return this.restService.get<DocumentArchive>(this.path, id);
  }

  customSearchDocumentArchive(
    documentSearchReq: DocumentSearchReq
  ): Observable<DocumentArchive[]> {
    return this.restService.post<DocumentArchive[]>(
      this.path + "/search",
      documentSearchReq
    );
  }

  createDocumentArchive(
    documentArchive: DocumentArchive
  ): Observable<DocumentArchive> {
    return this.restService.post<DocumentArchive>(this.path, documentArchive);
  }

  verifyDocumentArchive(
    documentArchive: DocumentArchive
  ): Observable<DocumentArchive> {
    return this.restService.post<DocumentArchive>(
      this.path + "/verifyDocument/" + documentArchive.id,
      documentArchive
    );
  }

  updateDocumentArchive(
    documentArchive: DocumentArchive
  ): Observable<DocumentArchive> {
    if (documentArchive != null && documentArchive.id != null) {
      return this.restService.put<DocumentArchive>(
        this.path,
        documentArchive.id,
        documentArchive
      );
    }
    throw "Invalid data. ID not found " + JSON.stringify(documentArchive);
  }

  deleteDocumentArchive(id: string): Observable<DocumentArchive> {
    return this.restService.delete<DocumentArchive>(this.path, id);
  }
}
