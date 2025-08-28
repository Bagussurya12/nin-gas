import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from './pagination.component';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    PaginationComponent
  ],
  exports: [
    PaginationComponent
  ]
})
export class PaginationModule { }