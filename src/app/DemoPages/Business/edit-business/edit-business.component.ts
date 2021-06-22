import { Component, OnInit, Inject } from '@angular/core';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material';
import { BusinessDesign } from '../../../models/business/business-design.class';

@Component({
  selector: 'app-edit-business',
  templateUrl: './edit-business.component.html',
  styleUrls: ['./edit-business.component.sass'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class EditBusinessComponent implements OnInit {

  id: string;
  isBusinessUpdated: boolean = false;


  constructor( @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
  private _bottomSheetRef: MatBottomSheetRef<EditBusinessComponent>) { }

  ngOnInit() {
    this.id = this.data.id;
    this.isBusinessUpdated = true;
  }

  afterBusinessUpdation(business: BusinessDesign): void {
    this.isBusinessUpdated = false;
    this._bottomSheetRef.dismiss(business);
  }

  closeBottomSheet(event: MouseEvent): void {
    this.isBusinessUpdated = false;
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

}
