import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material";

@Component({
  selector: "app-confirmation-prompt-sheet",
  templateUrl: "./confirmation-prompt-sheet.component.html",
  styleUrls: ["./confirmation-prompt-sheet.component.sass"],
})
export class ConfirmationPromptSheetComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationPromptSheetComponent>,
  ) {}

  ngOnInit() {}

  onClick(isConfirmed: boolean) {
    this.dialogRef.close({ isConfirmed: isConfirmed });
  }
}
