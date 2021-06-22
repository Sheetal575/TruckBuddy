import { Component, Input, OnInit } from '@angular/core';
import { DriverAuth } from 'src/app/models/driver-auth/driver-auth.class';
import { DateTimeFormatEnum, DateTimeProvider } from '../../../core/utils/date-time.provider';
import { MatDialog } from '@angular/material';
import { ImageViewerComponent } from '../../image-viewer/image-viewer.component';

@Component({
  selector: 'app-driver-auth-tile',
  templateUrl: './driver-auth-tile.component.html',
  styleUrls: ['./driver-auth-tile.component.sass']
})
export class DriverAuthTileComponent implements OnInit {
  @Input() driverAuth: DriverAuth;
  constructor(private dateTimeProvider: DateTimeProvider, public dialog: MatDialog) { }

  ngOnInit() {
    console.log(this.driverAuth.id);
  }

  openImage(id: string) {
    const dialogRef = this.dialog.open(ImageViewerComponent, {
      data: { image: id }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  getUrl() {
    if (this.driverAuth.fromLocation && this.driverAuth.fromLocation.coordinates && this.driverAuth.fromLocation.coordinates.length == 2)
      return `http://maps.google.com/maps?q=loc:${this.driverAuth.fromLocation.coordinates[1]},${this.driverAuth.fromLocation.coordinates[0]}`;

    return '';
  }

  getTime() {
    return this.dateTimeProvider.getDateTime(this.driverAuth.createdAt, DateTimeFormatEnum.FORMAT_HOUR_MINUTE_MERIDIEM);
  }
  getDate() {
    return this.dateTimeProvider.getDateTime(this.driverAuth.createdAt, DateTimeFormatEnum.FOMAT_DAY_MONTH_YEAR);
  }

}
