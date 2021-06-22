import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.sass']
})
export class ImageViewerComponent implements OnInit {
  image;
  constructor(public dialogRef: MatDialogRef<ImageViewerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(data.image);
    this.image = data.image;
  }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }

}
