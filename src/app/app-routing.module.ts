import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CreateBookingComponent } from "./DemoPages/Booking/create-booking/create-booking.component";
import { ListBookingComponent } from "./DemoPages/Booking/list-booking/list-booking.component";
import { ViewBookingComponent } from "./DemoPages/Booking/view-booking/view-booking.component";
import { AddBusinessComponent } from "./DemoPages/Business/add-business/add-business.component";
import { ListBusinessComponent } from "./DemoPages/Business/list-business/list-business.component";
import { ViewBusinessComponent } from "./DemoPages/Business/view-business/view-business.component";
// Charts
import { ChartjsComponent } from "./DemoPages/Charts/chartjs/chartjs.component";
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
import { EditOrderInvoiceComponent } from "./DemoPages/OrderInvoice/edit-order-invoice/edit-order-invoice.component";
import { ListOrderInvoiceComponent } from "./DemoPages/OrderInvoice/list-order-invoice/list-order-invoice.component";
import { ViewOrderInvoiceComponent } from "./DemoPages/OrderInvoice/view-order-invoice/view-order-invoice.component";
import { AddProfileComponent } from "./DemoPages/Profile/add-profile/add-profile.component";
import { ListProfileComponent } from "./DemoPages/Profile/list-profile/list-profile.component";
import { VerifyProfileComponent } from "./DemoPages/Profile/verify-profile/verify-profile.component";
import { ViewProfileComponent } from "./DemoPages/Profile/view-profile/view-profile.component";
import { WarRoomComponent } from "./DemoPages/Profile/war-room/war-room.component";
import { ReportPageComponent } from './DemoPages/Reports/report-page/report-page.component';
import { ViewReportsComponent } from './DemoPages/Reports/report-page/view-reports/view-reports.component';
// Tables
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
import { ListUnverifiedBusinessDocumentComponent } from "./DemoPages/Widgets/list-unverified-business-document/list-unverified-business-document.component";
import { ListUnverifiedDocumentComponent } from "./DemoPages/Widgets/list-unverified-document/list-unverified-document.component";
import { ListUnverifiedProfileDocumentComponent } from "./DemoPages/Widgets/list-unverified-profile-document/list-unverified-profile-document.component";
import { BaseLayoutComponent } from "./Layout/base-layout/base-layout.component";
import { PagesLayoutComponent } from "./Layout/pages-layout/pages-layout.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "pages/login-boxed",
    pathMatch: "full",
  },
  {
    path: "",
    component: BaseLayoutComponent,
    children: [
      // Dashboads

      {
        path: "",
        component: AnalyticsComponent,
        data: { extraParameter: "dashboardsMenu" },
      },

      // Bookinglist
      {
        path: "booking/create-booking",
        component: CreateBookingComponent,
        data: { extraParameter: "" },
      },
      {
        path: "booking/list-booking",
        component: ListBookingComponent,
        data: { extraParameter: "" },
      },
      {
        path: "driverTrack/loginLogs",
        component: DriverAuthComponent,
        data: { extraParameter: "" },
      },
      {
        path: "booking/view-booking",
        component: ViewBookingComponent,
        data: { extraParameter: "" },
      },

      //Order Invoice
      {
        path: "orderInvoice/view-order-invoice",
        component: ViewOrderInvoiceComponent,
        data: { extraParameter: "" },
      },
      {
        path: "orderInvoice/edit-order-invoice",
        component: EditOrderInvoiceComponent,
        data: { extraParameter: "" },
      },
      {
        path: "orderInvoice/list-order-invoice",
        component: ListOrderInvoiceComponent,
        data: { extraParameter: "" },
      },

      //Vehicle Bookings
      {
        path: "vehicleBooking/view-vehicle-booking",
        component: ViewVehicleBookingComponent,
        data: { extraParameter: "" },
      },
      {
        path: "vehicleBooking/list-vehicle-booking",
        component: ListVehicleBookingComponent,
        data: { extraParameter: "" },
      },
      {
        path: "vehicleBooking/add-vehicle-booking",
        component: AddVehicleBookingComponent,
        data: { extraParameter: "" },
      },

      //Profile
      {
        path: "profile/add-profile",
        component: AddProfileComponent,
        data: { extraParameter: "" },
      },
      {
        path: "profile/view-profile",
        component: ViewProfileComponent,
        data: { extraParameter: "" },
      },
      {
        path: "profile/list-profile",
        component: ListProfileComponent,
        data: { extraParameter: "" },
      },
      {
        path: "profile/verify-profile",
        component: VerifyProfileComponent,
        data: { extraParameter: "" },
      },

      //war-room
      {
        path: "war-room/war-room",
        component: WarRoomComponent,
        data: { extraParameter: "" },
      },

      //Business
      {
        path: "business/add-business",
        component: AddBusinessComponent,
        data: { extraParameter: "" },
      },
      {
        path: "business/list-business",
        component: ListBusinessComponent,
        data: { extraParameter: "" },
      },
      {
        path: "business/view-business",
        component: ViewBusinessComponent,
        data: { extraParameter: "" },
      },

      //Tap
      {
        path: "tap/list-tap",
        component: ListTapComponent,
        data: { extraParameter: "" },
      },
      {
        path: "tap/view-tap",
        component: ViewTapComponent,
        data: { extraParameter: "" },
      },
      {
        path: "tap/add-tap",
        component: AddBusinessComponent,
        data: { extraParameter: "" },
      },

      //Vehicle
      {
        path: "vehicle/list-vehicle",
        component: ListVehicleComponent,
        data: { extraParameter: "" },
      },
      {
        path: "vehicle/view-vehicle",
        component: ViewVehicleComponent,
        data: { extraParameter: "" },
      },
      {
        path: "vehicle/add-vehicle",
        component: AddVehicleComponent,
        data: { extraParameter: "" },
      },
      {
        path: "vehicle/list-unverified-vehicle",
        component: ListUnverifiedVehicleComponent,
        data: { extraParameter: "" },
      },

      {
        path: "document/verify-document",
        component: ListUnverifiedDocumentComponent,
        data: { extraParameter: "" },
      },
      {
        path: "document/verify-profile-document",
        component: ListUnverifiedProfileDocumentComponent,
        data: { extraParameter: "" },
      },
      {
        path: "document/verify-business-document",
        component: ListUnverifiedBusinessDocumentComponent,
        data: { extraParameter: "" },
      },

      //reports
      {
        path: "reports/home",
        component: ReportPageComponent,
        data: { extraParameter: " " },
      },
      {
        path: "reports/view-reports/:id",
        component: ViewReportsComponent,
        data: { extraParameter: " " },
      },

      // Elements

      {
        path: "elements/buttons-standard",
        component: StandardComponent,
        data: { extraParameter: "elementsMenu" },
      },
      {
        path: "elements/dropdowns",
        component: DropdownsComponent,
        data: { extraParameter: "elementsMenu" },
      },
      {
        path: "elements/icons",
        component: IconsComponent,
        data: { extraParameter: "elementsMenu" },
      },
      {
        path: "elements/cards",
        component: CardsComponent,
        data: { extraParameter: "elementsMenu" },
      },
      {
        path: "elements/list-group",
        component: ListGroupsComponent,
        data: { extraParameter: "elementsMenu" },
      },
      {
        path: "elements/timeline",
        component: TimelineComponent,
        data: { extraParameter: "elementsMenu" },
      },

      // Components

      {
        path: "components/tabs",
        component: TabsComponent,
        data: { extraParameter: "componentsMenu" },
      },
      {
        path: "components/accordions",
        component: AccordionsComponent,
        data: { extraParameter: "componentsMenu" },
      },
      {
        path: "components/modals",
        component: ModalsComponent,
        data: { extraParameter: "componentsMenu" },
      },
      {
        path: "components/progress-bar",
        component: ProgressBarComponent,
        data: { extraParameter: "componentsMenu" },
      },
      {
        path: "components/tooltips-popovers",
        component: TooltipsPopoversComponent,
        data: { extraParameter: "componentsMenu" },
      },
      {
        path: "components/carousel",
        component: CarouselComponent,
        data: { extraParameter: "componentsMenu" },
      },
      {
        path: "components/pagination",
        component: PaginationComponent,
        data: { extraParameter: "componentsMenu" },
      },

      // Tables

      {
        path: "tables/bootstrap",
        component: TablesMainComponent,
        data: { extraParameter: "tablesMenu" },
      },

      // Widgets

      {
        path: "widgets/chart-boxes-3",
        component: ChartBoxes3Component,
        data: { extraParameter: "pagesMenu3" },
      },

      // Forms Elements

      {
        path: "forms/controls",
        component: ControlsComponent,
        data: { extraParameter: "formElementsMenu" },
      },
      {
        path: "forms/layouts",
        component: LayoutComponent,
        data: { extraParameter: "formElementsMenu" },
      },

      // Charts

      {
        path: "charts/chartjs",
        component: ChartjsComponent,
        data: { extraParameter: "" },
      },
    ],
  },
  {
    path: "",
    component: PagesLayoutComponent,
    children: [
      // User Pages

      {
        path: "pages/login-boxed",
        component: LoginBoxedComponent,
        data: { extraParameter: "" },
      },
      {
        path: "pages/register-boxed",
        component: RegisterBoxedComponent,
        data: { extraParameter: "" },
      },
      {
        path: "pages/forgot-password-boxed",
        component: ForgotPasswordBoxedComponent,
        data: { extraParameter: "" },
      },
    ],
  },
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: "enabled",
      anchorScrolling: "enabled",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
