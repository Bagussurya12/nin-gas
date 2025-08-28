import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import {
  Router,
  ActivatedRoute,
  NavigationEnd,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { filter, map, mergeMap } from 'rxjs';
import { AuthService } from './services/auth/auth.service';
import { environment } from '../environments/environment';
import { MasterDataComponent } from './components/sidebarmenu/master-data/master-data.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { PermissionService } from './services/permission/permission.service.js';
import { SettingsLinkComponent } from './components/sidebarmenu/settings-link/settings-link.component.js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NgClass,
    NgIf,
    RouterModule,
    RouterOutlet,
    MasterDataComponent,
    SettingsLinkComponent,
  ],
  providers: [AuthService],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class AppComponent implements OnInit {
  layout = 'login';
  activeRoute = '';
  isSidebarOpen = false;
  currentYear: number = new Date().getFullYear();
  title = 'frontend';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public permissionService: PermissionService,
    private authService: AuthService
  ) {}

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  ngOnInit() {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        ),
        map(() => this.route),
        map((route) => {
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        mergeMap((route) => route.data)
      )
      .subscribe((data) => {
        this.layout = data['layout'] || 'login';
        this.activeRoute = this.router.url;
        this.permissionService.getPermissions();
      });
  }
}
