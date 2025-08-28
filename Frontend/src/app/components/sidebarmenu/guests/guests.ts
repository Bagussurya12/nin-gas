import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../services/auth/auth.service';
import { PermissionService } from '../../../services/permission/permission.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-guests',
  templateUrl: './guests.html',
  styleUrls: ['./guests.css'],
  imports: [CommonModule, RouterModule],
})
export class Guests implements OnInit {
  alert = alert;
  showSettingsSubmenu = false;
  showMasterDataSubMenu = false;
  showSystemSubmenu = false;
  showCartrackSubMenu = false;
  activeRoute = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public permissionService: PermissionService,
    private authService: AuthService
  ) {}

  handleSettingsSubmenu() {
    this.showSettingsSubmenu = !this.showSettingsSubmenu;
  }
  showMasterDataSubmenus() {
    if (
      this.activeRoute.startsWith('/guests/') ||
      this.activeRoute.startsWith('/guests')
    ) {
      this.showSettingsSubmenu = true;
      this.showMasterDataSubMenu = true;

      if (this.activeRoute.startsWith('/guests/')) {
        this.showSystemSubmenu = true;
      }
    }
  }

  incommingModuleClicked() {
    alert('Please install this module to continue');
  }

  ngOnInit() {
    this.activeRoute = this.router.url;
    this.showMasterDataSubmenus();

    if (this.activeRoute.startsWith('/guests')) {
      this.showSettingsSubmenu = true;
    }

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.route),
        map((route) => {
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        mergeMap((route) => route.data)
      )
      .subscribe(() => {
        this.activeRoute = this.router.url;
      });
  }
}
