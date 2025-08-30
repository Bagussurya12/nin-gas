import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./guest').then((m) => m.GuestComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class GuestModule {}
