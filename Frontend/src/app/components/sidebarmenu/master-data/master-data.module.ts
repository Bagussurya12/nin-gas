import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterDataComponent } from './master-data.component';
import { RouterModule } from '@angular/router';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MasterDataComponent 
  ],
  exports: [
    MasterDataComponent
  ]
})
export class MasterDataModule { }
