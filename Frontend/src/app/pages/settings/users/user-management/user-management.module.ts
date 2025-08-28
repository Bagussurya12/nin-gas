// user-management.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./user-management').then((m) => m.UserManagementComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)], // HANYA import RouterModule
})
export class UserManagementModule {}
