import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./edit').then((m) => m.Edit),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class EditModule {}
