import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { NbMediaBreakpointsService, NbMenuItem, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';
import { ApiService } from './api.service';
import {  SIDE_MENU_ITEMS } from './menu';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-aws-cognito-auth-demo';
  items: NbMenuItem[] =SIDE_MENU_ITEMS;
  constructor(private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private breakpointService: NbMediaBreakpointsService,
    private router: Router,
    public api: ApiService,
    public auth: AuthenticatorService,
  ) { }
  toggleSidebar(): boolean {
    this.sidebarService.toggle();
    return false;
  }
}
