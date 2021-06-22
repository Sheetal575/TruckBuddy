import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ToastrService } from "ngx-toastr";
import {
  ToastMessage,
  ToastMessageType,
} from "../../../core/utils/toastr-message.helper";

@Component({
  selector: "app-reject-booking-bottom-sheet",
  templateUrl: "./reject-booking-bottom-sheet.component.html",
  styleUrls: ["./reject-booking-bottom-sheet.component.sass"],
})
export class RejectBookingBottomSheetComponent implements OnInit {
  remark: string = "";
  remarkLabel: string;
  headerLabel: string;

  constructor(
    public dialogRef: MatDialogRef<RejectBookingBottomSheetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toaster: ToastMessage
  ) {}

  onClick(isConfirmed: boolean): void {
    if (this.data && this.data.isRemarkRequired && isConfirmed) {
      if (!this.remark || this.remark === "") {
        var msg = "";
        if (this.remarkLabel) {
          msg = "Enter " + this.remarkLabel;
        } else {
          msg = "Please enter some remark";
        }
        this.toaster.showToastr("Opps!!!", msg, ToastMessageType.WARNING);
      } else {
        this.dialogRef.close({ status: isConfirmed, remark: this.remark });
      }
    } else {
      this.dialogRef.close({ status: isConfirmed, remark: this.remark });
    }
  }
  ngOnInit() {
    this.headerLabel = this.data.headerLabel;
    this.remarkLabel = this.data.remarkLabel;
  }
}
