import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-form-field-error-display',
  templateUrl: './form-field-error-display.component.html',
  styleUrls: ['./form-field-error-display.component.css']
})
export class FormFieldErrorDisplayComponent {

  @Input() errorMsg: string;
  @Input() displayError: boolean;

}
