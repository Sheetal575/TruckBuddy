import { AgmCoreModule } from "@agm/core";
import {
  NgxMatDateFormats,
  NGX_MAT_DATE_FORMATS,
} from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from "@angular-material-components/moment-adapter";
import {
  DevToolsExtension,
  NgRedux,
  NgReduxModule,
} from "@angular-redux/store";
import { AsyncPipe, CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { AngularFireModule } from "@angular/fire";
import { AngularFireMessagingModule } from "@angular/fire/messaging";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  MatBottomSheetModule,
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatPaginatorModule,
  MatSelectModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MAT_BOTTOM_SHEET_DEFAULT_OPTIONS,
  
} from "@angular/material";
import { MatNativeDateModule } from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';

import { MatSliderModule } from "@angular/material/slider";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { LoadingBarRouterModule } from "@ngx-loading-bar/router";
// BOOTSTRAP COMPONENTS
import { AngularFontAwesomeModule } from "angular-font-awesome";
import { ConnectionServiceModule } from "ng-connection-service";
import { SnotifyModule, SnotifyService, ToastDefaults } from "ng-snotify";
import { ChartsModule } from "ng2-charts";
import { NgxDaterangepickerMd } from "ngx-daterangepicker-material";
import {
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG,
} from "ngx-perfect-scrollbar";
import { ToastrModule } from "ngx-toastr";
import {
  NgxUiLoaderConfig,
  NgxUiLoaderHttpModule,
  NgxUiLoaderModule,
  NgxUiLoaderRouterModule,
  PB_DIRECTION,
  POSITION,
  SPINNER,
} from "ngx-ui-loader";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CreateBookingComponent } from "./DemoPages/Booking/create-booking/create-booking.component";
import { ListBookingComponent } from "./DemoPages/Booking/list-booking/list-booking.component";
import { ViewBookingComponent } from "./DemoPages/Booking/view-booking/view-booking.component";
import { AddAddressSheetComponent } from "./DemoPages/bottom-sheet-pages/add-address-sheet/add-address-sheet.component";
import { AddProfileSheetComponent } from "./DemoPages/bottom-sheet-pages/add-profile-sheet/add-profile-sheet.component";
import { ConfirmationPromptSheetComponent } from "./DemoPages/bottom-sheet-pages/confirmation-prompt-sheet/confirmation-prompt-sheet.component";
import { RejectBookingBottomSheetComponent } from "./DemoPages/bottom-sheet-pages/reject-booking-bottom-sheet/reject-booking-bottom-sheet.component";
import { VehicleDetailBottomSheetComponent } from "./DemoPages/bottom-sheet-pages/vehicle-detail-bottom-sheet/vehicle-detail-bottom-sheet.component";
import { AddBusinessComponent } from "./DemoPages/Business/add-business/add-business.component";
import { EditBusinessComponent } from "./DemoPages/Business/edit-business/edit-business.component";
import { ListBusinessComponent } from "./DemoPages/Business/list-business/list-business.component";
import { ViewBusinessComponent } from "./DemoPages/Business/view-business/view-business.component";
// Charts
import { ChartjsComponent } from "./DemoPages/Charts/chartjs/chartjs.component";
import { BarChartComponent } from "./DemoPages/Charts/chartjs/examples/bar-chart/bar-chart.component";
import { BubbleChartComponent } from "./DemoPages/Charts/chartjs/examples/bubble-chart/bubble-chart.component";
import { DoughnutChartComponent } from "./DemoPages/Charts/chartjs/examples/doughnut-chart/doughnut-chart.component";
import { DynamicChartComponent } from "./DemoPages/Charts/chartjs/examples/dynamic-chart/dynamic-chart.component";
// Chart.js Examples
import { LineChartComponent } from "./DemoPages/Charts/chartjs/examples/line-chart/line-chart.component";
import { PieChartComponent } from "./DemoPages/Charts/chartjs/examples/pie-chart/pie-chart.component";
import { PolarAreaChartComponent } from "./DemoPages/Charts/chartjs/examples/polar-area-chart/polar-area-chart.component";
import { RadarChartComponent } from "./DemoPages/Charts/chartjs/examples/radar-chart/radar-chart.component";
import { ScatterChartComponent } from "./DemoPages/Charts/chartjs/examples/scatter-chart/scatter-chart.component";
// Components
import { AccordionsComponent } from "./DemoPages/Components/accordions/accordions.component";
import { CarouselComponent } from "./DemoPages/Components/carousel/carousel.component";
import { ModalsComponent } from "./DemoPages/Components/modals/modals.component";
import { PaginationComponent } from "./DemoPages/Components/pagination/pagination.component";
import { ProgressBarComponent } from "./DemoPages/Components/progress-bar/progress-bar.component";
import { TabsComponent } from "./DemoPages/Components/tabs/tabs.component";
import { TooltipsPopoversComponent } from "./DemoPages/Components/tooltips-popovers/tooltips-popovers.component";
// DEMO PAGES
// Dashboards
import { AnalyticsComponent } from "./DemoPages/Dashboards/analytics/analytics.component";
import { DriverAuthTileComponent } from "./DemoPages/Driver-Auth/driver-auth-tile/driver-auth-tile.component";
import { DriverAuthComponent } from "./DemoPages/driver-auth/driver-auth.component";
// Elements
import { StandardComponent } from "./DemoPages/Elements/Buttons/standard/standard.component";
import { CardsComponent } from "./DemoPages/Elements/cards/cards.component";
import { DropdownsComponent } from "./DemoPages/Elements/dropdowns/dropdowns.component";
import { IconsComponent } from "./DemoPages/Elements/icons/icons.component";
import { ListGroupsComponent } from "./DemoPages/Elements/list-groups/list-groups.component";
import { TimelineComponent } from "./DemoPages/Elements/timeline/timeline.component";
// Forms Elements
import { ControlsComponent } from "./DemoPages/Forms/Elements/controls/controls.component";
import { LayoutComponent } from "./DemoPages/Forms/Elements/layout/layout.component";
import { ImageViewerComponent } from "./DemoPages/image-viewer/image-viewer.component";
import { NoInternetPromptComponent } from "./DemoPages/no-internet-prompt/no-internet-prompt.component";
import { EditOrderInvoiceComponent } from "./DemoPages/OrderInvoice/edit-order-invoice/edit-order-invoice.component";
import { ListOrderInvoiceComponent } from "./DemoPages/OrderInvoice/list-order-invoice/list-order-invoice.component";
import { ViewOrderInvoiceComponent } from "./DemoPages/OrderInvoice/view-order-invoice/view-order-invoice.component";
import { AddProfileComponent } from "./DemoPages/Profile/add-profile/add-profile.component";
import { EditProfileComponent } from "./DemoPages/Profile/edit-profile/edit-profile.component";
import { ListProfileComponent } from "./DemoPages/Profile/list-profile/list-profile.component";
import { VerifyProfileComponent } from "./DemoPages/Profile/verify-profile/verify-profile.component";
import { ViewProfileComponent } from "./DemoPages/Profile/view-profile/view-profile.component";
import { WarRoomComponent } from "./DemoPages/Profile/war-room/war-room.component";
import { ReportPageComponent } from "./DemoPages/Reports/report-page/report-page.component";
import { ViewReportsComponent } from "./DemoPages/Reports/report-page/view-reports/view-reports.component";
// Tables
import { RegularComponent } from "./DemoPages/Tables/regular/regular.component";
import { TablesMainComponent } from "./DemoPages/Tables/tables-main/tables-main.component";
import { ListTapComponent } from "./DemoPages/Tap/list-tap/list-tap.component";
import { ViewTapComponent } from "./DemoPages/Tap/view-tap/view-tap.component";
// Pages
import { ForgotPasswordBoxedComponent } from "./DemoPages/UserPages/forgot-password-boxed/forgot-password-boxed.component";
import { LoginBoxedComponent } from "./DemoPages/UserPages/login-boxed/login-boxed.component";
import { RegisterBoxedComponent } from "./DemoPages/UserPages/register-boxed/register-boxed.component";
import { AddVehicleComponent } from "./DemoPages/Vehicle/add-vehicle/add-vehicle.component";
import { ListUnverifiedVehicleComponent } from "./DemoPages/Vehicle/list-unverified-vehicle/list-unverified-vehicle.component";
import { ListVehicleComponent } from "./DemoPages/Vehicle/list-vehicle/list-vehicle.component";
import { ViewVehicleComponent } from "./DemoPages/Vehicle/view-vehicle/view-vehicle.component";
import { AddVehicleBookingComponent } from "./DemoPages/VehicleBooking/add-vehicle-booking/add-vehicle-booking.component";
import { ListVehicleBookingComponent } from "./DemoPages/VehicleBooking/list-vehicle-booking/list-vehicle-booking.component";
import { ViewVehicleBookingComponent } from "./DemoPages/VehicleBooking/view-vehicle-booking/view-vehicle-booking.component";
// Widgets
import { ChartBoxes3Component } from "./DemoPages/Widgets/chart-boxes3/chart-boxes3.component";
import { DocumentVerificationComponent } from "./DemoPages/Widgets/document-verification/document-verification.component";
import { ListUnverifiedBusinessDocumentComponent } from "./DemoPages/Widgets/list-unverified-business-document/list-unverified-business-document.component";
import { ListUnverifiedDocumentComponent } from "./DemoPages/Widgets/list-unverified-document/list-unverified-document.component";
import { ListUnverifiedProfileDocumentComponent } from "./DemoPages/Widgets/list-unverified-profile-document/list-unverified-profile-document.component";
import { MessagingService } from "./firebase-cloud-messaging.service";
// LAYOUT
import { BaseLayoutComponent } from "./Layout/base-layout/base-layout.component";
// FOOTER
import { FooterComponent } from "./Layout/Components/footer/footer.component";
import { SearchBoxComponent } from "./Layout/Components/header/elements/search-box/search-box.component";
import { UserBoxComponent } from "./Layout/Components/header/elements/user-box/user-box.component";
// HEADER
import { HeaderComponent } from "./Layout/Components/header/header.component";
import { PageTitleComponent } from "./Layout/Components/page-title/page-title.component";
import { LogoComponent } from "./Layout/Components/sidebar/elements/logo/logo.component";
// SIDEBAR
import { SidebarComponent } from "./Layout/Components/sidebar/sidebar.component";
import { PagesLayoutComponent } from "./Layout/pages-layout/pages-layout.component";
import { ArchitectUIState, rootReducer } from "./ThemeOptions/store";
import { ConfigActions } from "./ThemeOptions/store/config.actions";
import { AlphabetOnlyDirective } from "./utils/directives/alphabet-only.directive";
import { NumberOnlyDirective } from "./utils/directives/number-only.directive";
import { FileUploadComponent } from "./utils/file-upload/file-upload.component";
import { FormFieldErrorDisplayComponent } from "./utils/form-field-error-display/form-field-error-display.component";
import { EachReportComponent } from './DemoPages/Reports/report-page/each-report/each-report/each-report.component';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = { 
  suppressScrollX: true,
};

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: "red",
  bgsPosition: POSITION.centerCenter,
  bgsSize: 40,
  bgsType: SPINNER.threeStrings, // background spinner type
  fgsType: SPINNER.threeStrings, // foreground spinner type
  pbDirection: PB_DIRECTION.leftToRight, // progress bar direction
  pbThickness: 5, // progress bar thickness
};

const CUSTOM_DATE_FORMATS: NgxMatDateFormats = {
  parse: {
    dateInput: "l, LTS",
  },
  display: {
    dateInput: "DD-MMM-YYYY hh:mm A",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
  },
};

@NgModule({
  declarations: [
    // LAYOUT

    AppComponent,
    BaseLayoutComponent,
    PagesLayoutComponent,
    PageTitleComponent,

    // HEADER

    HeaderComponent,
    SearchBoxComponent,
    UserBoxComponent,

    // SIDEBAR

    SidebarComponent,
    LogoComponent,

    // FOOTER

    FooterComponent,

    // DEMO PAGES

    // Dashboards

    AnalyticsComponent,

    // User Pages

    ForgotPasswordBoxedComponent,
    LoginBoxedComponent,
    RegisterBoxedComponent,

    // Elements

    StandardComponent,
    IconsComponent,
    DropdownsComponent,
    CardsComponent,
    ListGroupsComponent,
    TimelineComponent,

    // Components

    AccordionsComponent,
    TabsComponent,
    CarouselComponent,
    ModalsComponent,
    ProgressBarComponent,
    PaginationComponent,
    TooltipsPopoversComponent,

    // Tables

    RegularComponent,
    TablesMainComponent,

    // Dashboard Boxes

    ChartBoxes3Component,

    // Form Elements

    ControlsComponent,
    LayoutComponent,

    // CHARTS

    ChartjsComponent,

    // Chart.js Examples

    LineChartComponent,
    BarChartComponent,
    DoughnutChartComponent,
    RadarChartComponent,
    PieChartComponent,
    PolarAreaChartComponent,
    DynamicChartComponent,
    BubbleChartComponent,
    ScatterChartComponent,

    //Component for displaying error

    FormFieldErrorDisplayComponent,

    //Custom Compponents

    AddProfileComponent,
    WarRoomComponent,

    //Custom Directives

    AlphabetOnlyDirective,
    NumberOnlyDirective,
    AddBusinessComponent,
    ListTapComponent,
    ViewTapComponent,
    ListVehicleComponent,
    ViewVehicleComponent,
    AddVehicleComponent,
    ViewProfileComponent,
    ListBusinessComponent,
    ListProfileComponent,
    EditProfileComponent,
    FileUploadComponent,
    ViewBusinessComponent,
    CreateBookingComponent,
    ListBookingComponent,
    ViewBookingComponent,
    VehicleDetailBottomSheetComponent,
    RejectBookingBottomSheetComponent,
    ViewOrderInvoiceComponent,
    ListOrderInvoiceComponent,
    EditOrderInvoiceComponent,
    ListVehicleBookingComponent,
    ViewVehicleBookingComponent,
    AddVehicleBookingComponent,
    EditBusinessComponent,
    ConfirmationPromptSheetComponent,
    VerifyProfileComponent,
    ListUnverifiedDocumentComponent,
    DocumentVerificationComponent,
    ListUnverifiedVehicleComponent,
    DriverAuthComponent,
    DriverAuthTileComponent,
    ImageViewerComponent,
    ListUnverifiedProfileDocumentComponent,
    ListUnverifiedBusinessDocumentComponent,
    AddProfileSheetComponent,
    AddAddressSheetComponent,
    NoInternetPromptComponent,
    ReportPageComponent,
    ViewReportsComponent,
    EachReportComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgReduxModule,
    CommonModule,
    LoadingBarRouterModule,

    //MatTable Module
    MatTableModule,
    MatIconModule,
    MatSortModule,
    MatPaginatorModule,
    MatBottomSheetModule,
    MatSelectModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    // Angular Bootstrap Components
    
    PerfectScrollbarModule,
    NgbModule,
    AngularFontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    //Loader
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderRouterModule,
    NgxUiLoaderHttpModule,
    NgxMatMomentModule,

    //Dialog
    MatDialogModule,

    //DateTime Picker
    MatDatepickerModule,
    NgxMatTimepickerModule,
    NgxMatDatetimePickerModule,

    // Charts

    ChartsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatNativeDateModule,

    MatSliderModule,
    SnotifyModule,
    MatDatepickerModule,

    //offline service module
    ConnectionServiceModule,

    //date range picker
    NgxDaterangepickerMd.forRoot(),

    //firebase modules
    AngularFireMessagingModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyBs51W_gUG4kyKNIU71nXQoSI0vjmeq2mo",
      authDomain: "truckbuddy-in.firebaseapp.com",
      databaseURL: "https://truckbuddy-in.firebaseio.com",
      projectId: "truckbuddy-in",
      storageBucket: "truckbuddy-in.appspot.com",
      messagingSenderId: "835258143479",
      appId: "1:835258143479:web:25014d81159beed32db9f2",
      measurementId: "G-EX67FL17P4",
    }),

    //ngx-toastr module
    ToastrModule.forRoot({
      enableHtml: true,
      timeOut: 3000,
      positionClass: "toast-bottom-right",
      preventDuplicates: true,
      progressBar: true,
      closeButton: true,
      autoDismiss: true,
    }),
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyCRXmdTqWWh3_-c2EK2htmgghPokBWyyKM",
    }),
  ],
  providers: [
    { provide: "SnotifyToastConfig", useValue: ToastDefaults },
    SnotifyService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      // DROPZONE_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
      // DEFAULT_DROPZONE_CONFIG,
    },
    ConfigActions,
    {
      provide: MAT_BOTTOM_SHEET_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: true,
        closeOnNavigation: true,
        disableClose: true,
        backdropClass: "backdropBackground",
      },
    },
    MessagingService,
    AsyncPipe,
    { provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [
    EditProfileComponent,
    ImageViewerComponent,
    VehicleDetailBottomSheetComponent,
    RejectBookingBottomSheetComponent,
    AddVehicleBookingComponent,
    EditBusinessComponent,
    ConfirmationPromptSheetComponent,
    AddProfileSheetComponent,
    AddAddressSheetComponent,
    NoInternetPromptComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(
    private ngRedux: NgRedux<ArchitectUIState>,
    private devTool: DevToolsExtension
  ) {
    this.ngRedux.configureStore(
      rootReducer,
      {} as ArchitectUIState,
      [],
      [devTool.isEnabled() ? devTool.enhancer() : (f) => f]
    );
  }
}
