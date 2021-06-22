import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from "@angular/material";
import { Router } from "@angular/router";
import { DocumentStatusEnum } from "src/app/models/document/document-status.enum";
import { DataRef } from "../../../core/models/dataRef.class";
import { RestService } from "../../../core/rest-service/rest.service";
import {
  ToastMessage,
  ToastMessageType,
} from "../../../core/utils/toastr-message.helper";
import { DocumentSearchReq } from "../../../models/document/document-archieve-search-request.class";
import { DocumentArchive } from "../../../models/document/document-archieve.class";
import { DocumentPurposeEnum } from "../../../models/document/document-purpose-type.enum";
import { DocumentArchieveService } from "../../../services/document-archieve.service";
import { RejectBookingBottomSheetComponent } from "../../bottom-sheet-pages/reject-booking-bottom-sheet/reject-booking-bottom-sheet.component";
import { ImageViewerComponent } from "../../image-viewer/image-viewer.component";

@Component({
  selector: "app-document-verification",
  templateUrl: "./document-verification.component.html",
  styleUrls: ["./document-verification.component.sass"],
})
export class DocumentVerificationComponent implements OnInit {
  @Input() purpose: DocumentPurposeEnum;
  @Input() profileRefId: string;
  @Input() profileRefName: string;
  @Output() emitOutput = new EventEmitter<boolean>();
  documentArchieve: DocumentArchive;
  uploadDocument: boolean = false;
  IsUploadRequired: boolean = false;
  isDocumentUploaded: boolean = false;

  constructor(
    private documentArchieveService: DocumentArchieveService,
    private toastr: ToastMessage,
    private restService: RestService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  async ngOnInit() {
    var archieve = await this.getDocumentArchieve();
  }

  openImage(id: string) {
    const dialogRef = this.dialog.open(ImageViewerComponent, {
      data: { image: id },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  getTextColorCss() {
    switch (this.documentArchieve.status.toString()) {
      case "VERIFIED":
        return "text-success";
      case "PENDING":
        return "text-warning";
      case "REJECTED":
        return "text-danger";
    }
  }

  getDocumentPurposeText() {
    // if (!this.documentArchieve) {
    if (!this.purpose) {
      return "Driver Driving Licence";
    } else {
      switch (this.purpose.toString()) {
        case "0":
          return "Driver Driving Licence";
        case "1":
          return "Driver Adhaar Card";
        case "2":
          return "TAP GST Certificate";
        case "3":
          return "TAP Aggrement Copy";
        case "4":
          return "Client Aggrement Copy";
        case "5":
          return "Client GST Certificate";
        case "6":
          return "Registration Certificate";
        case "7":
          return "Pollution Certificate";
        case "8":
          return "Insurance Certificate";
        case "9":
          return "Permit Certificate";
        case "10":
          return "Adhaar Card";
        case "11":
          return "PAN Card";
      }
    }
    // }
    // switch (this.documentArchieve.purpose.toString()) {
    //   case "VEHICLE_VERIFICATION_REGISTRATION_CERTIFICATE":
    //     return "Registration Certificate";
    //   case "VEHICLE_VERIFICATION_POLLUTION_CERTIFICATE":
    //     return "Pollution Certificate";
    //   case "VEHICLE_VERIFICATION_INSURANCE_CERTIFICATE":
    //     return "Insurance Certificate";
    //   case "VEHICLE_VERIFICATION_PERMIT":
    //     return "Permit Certificate";
    //   case "DRIVER_VERIFICATION_DRIVING_LICENSE":
    //     return "Driver Verification Driving Licence";
    //   case "DRIVER_VERIFICATION_ADHAAR_CARD":
    //     return "Driver Verification Adhaar Card";
    //   case "TAP_VERIFICATION_GST":
    //     return "TAP Verification GST Certificate";
    //   case "TAP_VERIFICATION_AGREEMENT_COPY":
    //     return "TAP Verification Aggrement Copy";
    //   case "CLIENT_VERIFICATION_AGREEMENT_COPY":
    //     return "Client Verification Aggrement Copy";
    //   case "CLIENT_VERIFICATION_GST":
    //     return "Client Verification GST Certificate";
    // }
  }

  getImage(imageId: string) {
    if (imageId) {
      return this.restService.getImageUrl() + imageId;
    } else {
      return null;
    }
  }

  async getDocumentArchieve() {
    var searchReq = new DocumentSearchReq();
    searchReq.profileRef = new DataRef();
    searchReq.profileRef.id = this.profileRefId;
    searchReq.profileRef.name = this.profileRefName;
    searchReq.purpose = this.purpose;
    try {
      var documentArchieveList = (await this.documentArchieveService
        .customSearchDocumentArchive(searchReq)
        .toPromise()) as DocumentArchive[];
      if (documentArchieveList.length > 0) {
        this.documentArchieve = documentArchieveList.reverse()[0];
      } else {
        //no document found
      }
    } catch (error) {
      // this.toastr.showToastr(
      //   "Opps!!",
      //   "Something went wrong. Please try later.",
      //   ToastMessageType.ERROR
      // );
    }
  }

  setDocumentFileId(fileId: string) {
    this.isDocumentUploaded = true;
    if (!this.documentArchieve) {
      this.documentArchieve = new DocumentArchive();
      this.documentArchieve.purpose = this.purpose;
      this.documentArchieve.profileRef = new DataRef();
      this.documentArchieve.profileRef.id = this.profileRefId;
      this.documentArchieve.profileRef.name = this.profileRefName;
      this.documentArchieve.status = DocumentStatusEnum.PENDING;
    }
    this.documentArchieve.fileId = fileId;
  }

  onPressedBack(i: number) {
    if (i != 0) {
      this.uploadDocument = !this.uploadDocument;
    } else {
      this.reUploadRequested();
    }
  }

  reUploadRequested() {
    this.uploadDocument = !this.uploadDocument;
    this.IsUploadRequired = !this.IsUploadRequired;
  }

  async createOrUpdateDocumentArchive() {
    if (!this.isDocumentUploaded) {
      this.toastr.showToastr(
        "Error",
        "Upload document to submit.",
        ToastMessageType.ERROR
      );
      return;
    }
    try {
      if (this.documentArchieve && this.documentArchieve.id) {
        this.documentArchieve = await this.documentArchieveService
          .updateDocumentArchive(this.documentArchieve)
          .toPromise();
        this.toastr.showToastr(
          "Success",
          "Document updated successfully.",
          ToastMessageType.SUCCESS
        );
      } else {
        this.documentArchieve = await this.documentArchieveService
          .createDocumentArchive(this.documentArchieve)
          .toPromise();
        this.toastr.showToastr(
          "Success",
          "Document created successfully.",
          ToastMessageType.SUCCESS
        );
      }
      this.reUploadRequested();
    } catch (error) {
      this.toastr.showToastr(
        "Error",
        "Error while verifying document. Please try later.",
        ToastMessageType.ERROR
      );
    }
  }

  async verifyOrRejectDocument(isAccepted: boolean) {
    var dialogRef;
    if (isAccepted) {
      dialogRef = this.dialog.open(RejectBookingBottomSheetComponent, {
        data: {
          isRemarkRequired: true,
          remarkLabel: this.getDocumentPurposeText() + " Number",
          headerLabel: "Verify " + this.getDocumentPurposeText() + " ?",
        },
        width: "250px",
      });
    } else {
      dialogRef = this.dialog.open(RejectBookingBottomSheetComponent, {
        data: {
          isRemarkRequired: true,
          headerLabel: "Reject " + this.getDocumentPurposeText() + " ?",
        },
        width: "250px",
      });
    }
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result && result.status) {
        this.documentArchieve.extraData = result.remark;
        if (isAccepted) {
          this.documentArchieve.status = DocumentStatusEnum.VERIFIED;
          this.documentArchieve = await this.documentArchieveService
            .verifyDocumentArchive(this.documentArchieve)
            .toPromise();
        } else {
          this.documentArchieve.status = DocumentStatusEnum.REJECTED;
          this.documentArchieve = await this.documentArchieveService
            .updateDocumentArchive(this.documentArchieve)
            .toPromise();
        }
        this.emitOutput.emit(true);
      }
    });
  }

  getDocumentState(state: string) {
    switch (state) {
      case "0" || "VERIFIED":
        return "VERIFIED";
      case "1" || "REJECTED":
        return "REJECTED";
      case "2" || "PENDING":
        return "PENDING";
    }
  }
}
