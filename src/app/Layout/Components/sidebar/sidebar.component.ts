import { Component, HostListener, OnInit, ChangeDetectorRef } from '@angular/core';
import { ThemeOptions } from "../../../theme-options";
import { select } from "@angular-redux/store";
import { Observable } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { AccessManageService } from "../../../core/utils/access-manage.service";
import { Profile } from "../../../models/profile/profile.class";
import { BusinessDesign } from "../../../models/business/business-design.class";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
})
export class SidebarComponent implements OnInit {
  public extraParameter: any;
  loginProfile: Profile;
  businessProfile: BusinessDesign;
  accessManageService: AccessManageService;

  constructor(
    public globals: ThemeOptions,
    private activatedRoute: ActivatedRoute,
    private accessManage: AccessManageService,
    private changeDetector:ChangeDetectorRef
  ) {
    this.accessManageService = this.accessManage;
    this.loginProfile = this.accessManageService.profile;
    this.businessProfile = this.accessManageService.businessProfile;
  }

  @select("config") public config$: Observable<any>;

  private newInnerWidth: number;
  private innerWidth: number;
  activeId = "dashboardsMenu";

  toggleSidebar() {
    this.globals.toggleSidebar = !this.globals.toggleSidebar;
  }

  sidebarHover() {
    this.globals.sidebarHover = !this.globals.sidebarHover;
  }

  ngOnInit() {
    setTimeout(() => {
      this.innerWidth = window.innerWidth;
      if (this.innerWidth < 1200) {
        this.globals.toggleSidebar = true;
      }
    });

    this.extraParameter = this.activatedRoute.snapshot.firstChild.data.extraParameter;
    this.changeDetector.detectChanges();
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.newInnerWidth = event.target.innerWidth;

    if (this.newInnerWidth < 1200) {
      this.globals.toggleSidebar = true;
    } else {
      this.globals.toggleSidebar = false;
    }
  }
}
