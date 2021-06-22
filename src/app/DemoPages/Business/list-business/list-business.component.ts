import { BusinessTypeEnum } from "src/app/models/enums/business-type.enum";
import { BusinessDesignSRequest } from "./../../../models/business/business-search-req.class";
import {
  ToastMessage,
  ToastMessageType,
} from "./../../../core/utils/toastr-message.helper";
import { BusinessService } from "./../../../services/business.service";
import { BusinessDesign } from "./../../../models/business/business-design.class";
import {
  MatSort,
  MatPaginator,
  MatTableDataSource,
  MatDialog,
} from "@angular/material";
import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { Profile } from "../../../models/profile/profile.class";
import { StorageService } from "../../../core/storage-service/storage.service";
import { StorageServiceTypeEnum } from "../../../core/storage-service/storage-service-type.enum";
import { ConfirmationPromptSheetComponent } from "../../bottom-sheet-pages/confirmation-prompt-sheet/confirmation-prompt-sheet.component";
import { VerificationStateEnum } from "../../../models/profile/verification-status.enum";
import { Router } from "@angular/router";

@Component({
  selector: "app-list-business",
  templateUrl: "./list-business.component.html",
  styleUrls: ["./list-business.component.sass"],
})
export class ListBusinessComponent implements OnInit, AfterViewInit {
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
  loginProfile: Profile;

  constructor(
    private businessDesignService: BusinessService,
    private toaster: ToastMessage,
    private storage: StorageService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.loginProfile = this.storage.get(StorageServiceTypeEnum.PROFILE);
  }

  ngOnInit() {
    this.getAllBusiness();
  }

  ngAfterViewInit(): void {
    this.dataSource.sortingDataAccessor = (item, property) => {
      // Split '.' to allow accessing property of nested object
      switch (property) {
        case "businessName":
          return item.businessName;
        case "contact":
          return item.contact.mobile;
        case "email":
          return item.contact.email;
        case "gst":
          return item.gst;
      }
    };
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  };

  public getAllBusiness() {
    let businessSearchRequest = this.createSearchReq();
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

  public createSearchReq(): BusinessDesignSRequest {
    let businessSearchRequest = new BusinessDesignSRequest();
    businessSearchRequest.businessType = BusinessTypeEnum.CLIENT;
    switch (this.loginProfile.type.toString()) {
      case "SUPER_ADMIN": {
        break;
      }
      case "TRUCKBUDDY_ADMIN":
      case "TRUCKBUDDY_SUPPORT": {
        businessSearchRequest.city = this.loginProfile.address.city;
        break;
      }
      default: {
        businessSearchRequest.businessType = null;
        break;
      }
    }
    return businessSearchRequest;
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
          this.getAllBusiness();
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
      let updateBusiness = (await this.businessDesignService
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
