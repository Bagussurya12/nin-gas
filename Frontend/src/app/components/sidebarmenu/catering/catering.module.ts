import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Catering } from './catering';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, RouterModule, Catering],
  exports: [Catering],
})
export class CateringModule {}
