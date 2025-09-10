import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./meal-ordering-system').then((m) => m.MealOrderingSystem),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class MealOrderingSystemModule {}
