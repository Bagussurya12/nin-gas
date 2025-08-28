import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Guests } from './guests';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, RouterModule, Guests],
  exports: [Guests],
})
export class CateringModule {}
