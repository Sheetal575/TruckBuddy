import { GenericSReq } from "../../core/models/generic-search-req.class";
import { DocumentPurposeEnum } from "./document-purpose-type.enum";
import { DataRef } from "src/app/core/models/dataRef.class";
import { DocumentStatusEnum } from "./document-status.enum";
export class DocumentSearchReq extends GenericSReq {
  purpose?: DocumentPurposeEnum;
  fileId?: string;
  profileRef?: DataRef;
  status?: DocumentStatusEnum;
}
