import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./create').then((m) => m.Create),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class CreateModule {}
