import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EachReportComponent } from './each-report.component';

describe('EachReportComponent', () => {
  let component: EachReportComponent;
  let fixture: ComponentFixture<EachReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EachReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EachReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
