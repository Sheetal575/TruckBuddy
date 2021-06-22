import { ToastMessage } from "src/app/core/utils/toastr-message.helper";
import { ToastMessageType } from "./../../../core/utils/toastr-message.helper";
import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import {
  MatPaginator,
  MatSort,
  MatTableDataSource,
  MatDialog,
} from "@angular/material";
import { BusinessTypeEnum } from "src/app/models/enums/business-type.enum";
import { BusinessDesign } from "./../../../models/business/business-design.class";
import { BusinessDesignSRequest } from "./../../../models/business/business-search-req.class";
import { BusinessService } from "./../../../services/business.service";
import { ConfirmationPromptSheetComponent } from "../../bottom-sheet-pages/confirmation-prompt-sheet/confirmation-prompt-sheet.component";
import { VerificationStateEnum } from "../../../models/profile/verification-status.enum";
import { Router } from "@angular/router";

@Component({
  selector: "app-list-tap",
  templateUrl: "./list-tap.component.html",
  styleUrls: ["./list-tap.component.sass"],
})
export class ListTapComponent implements OnInit, AfterViewInit {
  heading = "TAP List";
  subheading = "All TAP Partner List";
  icon = "pe-7s-fa-handshake-o icon-gradient bg-sunny-morning";

  public displayedColumns = [
    "businessName",
    "gst",
    "contact",
    "email",
    "status",
    "verifyBusiness",
  ];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public dataSource = new MatTableDataSource<BusinessDesign>();

  constructor(
    private businessDesignService: BusinessService,
    private toaster: ToastMessage,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAllTaps();
  }

  ngAfterViewInit(): void {
    this.dataSource.sortingDataAccessor = (item, property) => {
      // Split '.' to allow accessing property of nested object
      switch (property) {
        case "businessName":
          return item.businessName;
        case "gst":
          return item.gst ? item.gst : "";
        case "contact":
          return item.contact ? item.contact.mobile : "";
        case "email":
          return item.contact ? item.contact.email : "";
        case "status":
          return item.verificationState
            ? item.verificationState.toString()
            : "";
      }
    };
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  };

  public getAllTaps() {
    let businessSearchRequest = new BusinessDesignSRequest();
    businessSearchRequest.businessType = BusinessTypeEnum.TAP_GENERAL;
    this.businessDesignService
      .customSearchBusiness(businessSearchRequest)
      .subscribe(
        (response: BusinessDesign[]) => {
          this.dataSource.data = response.reverse();
        },
        (error) => {
          this.toaster.showToastr(
            "Oops !!!",
            "Something wents wrong. Please try later.",
            ToastMessageType.ERROR
          );
        }
      );
  }

  public async verifyAndUpdateBusiness(
    business: BusinessDesign,
    isRejectedOrBlocked: boolean
  ) {
    if (isRejectedOrBlocked) {
      const dialogRef = this.dialog.open(ConfirmationPromptSheetComponent, {
        width: "250px",
      });

      dialogRef.afterClosed().subscribe(async (result) => {
        if (result.isConfirmed) {
          business.verificationState = VerificationStateEnum.VERIFIED;
          var tapUpdate = await this.updateBusinessDesign(business);
          this.getAllTaps();
        }
      });
    } else {
      this.router.navigate(["../../document/verify-business-document"], {
        fragment: business.id + "@" + business.businessName,
      });
    }
  }

  async updateBusinessDesign(businessDesign: BusinessDesign) {
    try {
      let updateTap = (await this.businessDesignService
        .updateBusinessDesign(businessDesign)
        .toPromise()) as BusinessDesign;
      this.toaster.showToastr(
        "Success",
        "Business updated successfully.",
        ToastMessageType.ERROR
      );
    } catch (err) {
      this.toaster.showToastr(
        "Oops !!!",
        "Something wents wrong. Please try later.",
        ToastMessageType.ERROR
      );
    }
  }
}
