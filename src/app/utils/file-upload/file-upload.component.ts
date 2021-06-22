import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { RestService } from "src/app/core/rest-service/rest.service";
import {
  ToastMessage,
  ToastMessageType,
} from "src/app/core/utils/toastr-message.helper";

@Component({
  selector: "app-file-upload",
  templateUrl: "./file-upload.component.html",
  styleUrls: ["./file-upload.component.sass"],
})
export class FileUploadComponent implements OnInit {
  uploadFileForm: FormGroup;
  isUploadError: boolean;
  isFileSizeError: boolean;
  isFileUploaded: boolean;
  @Input() label: string;
  @Input() isBackButtonRequired: boolean = false;
  @Output() emitImageId = new EventEmitter<string>();
  @Output() emitBackButton = new EventEmitter<boolean>();

  constructor(
    private _formBuilder: FormBuilder,
    private restService: RestService,
    private toaster: ToastMessage
  ) {}

  ngOnInit() {
    this.uploadFileForm = this._formBuilder.group({
      file: [""],
    });
  }

  selectFile(event) {
    if (event.target.files.length > 0) {
      const file = (event.target as HTMLInputElement).files[0];
      if (file.size > 204800) {

        this.isFileUploaded = true;
        this.isFileSizeError = true;
        this.imageFileSizeError();
        event.target.value = "";
      } else {
        this.uploadFileForm.patchValue({
          file: file,
        });
      }
    } else {
      this.isUploadError = true;
      this.imageUploadError();
    }
  }

  onBack() {
    this.emitBackButton.emit(true);
  }

  uploadFile() {
    if (this.uploadFileForm.get("file").value) {
      const formdata: FormData = new FormData();
      formdata.append("file", this.uploadFileForm.get("file").value);
      this.restService.uploadImage(formdata).subscribe(
        (response: any) => {
          let body = JSON.parse(JSON.stringify(response))["body"];
          if (body === undefined) {
            //nothing
          } else {
            body = JSON.parse(body);
            this.emitImageId.emit(body.id);
            this.toaster.showToastr(
              "Success",
              "File uploaded successfully.",
              ToastMessageType.SUCCESS
            );
          }
        },
        (error) => {
          this.isUploadError = true;
          this.imageUploadError();
        }
      );
    } else {
      this.isUploadError = true;
      this.imageUploadError();
    }
  }

  imageUploadError() {
    if(!this.isFileUploaded){
      this.toaster.showToastr(
        "Error",
        "Please select file to upload.",
        ToastMessageType.ERROR
      );
    }else{
      this.toaster.showToastr(
        "Failure",
        "Something went wrong. Please try later.",
        ToastMessageType.ERROR
      );
    }
   
  }
  imageFileSizeError() {
    this.toaster.showToastr(
      "Opps!!!",
      "File size exceeds limit 200kb.",
      ToastMessageType.ERROR
    );
  }
}
