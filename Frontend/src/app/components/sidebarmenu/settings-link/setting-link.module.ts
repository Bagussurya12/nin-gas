import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsLinkComponent } from './settings-link.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    RouterModule,
    SettingsLinkComponent
  ],
  exports: [
    SettingsLinkComponent
  ]
})
export class SettingsLinkModule { }