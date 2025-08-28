import { Component } from '@angular/core';
import {
  trigger,
  style,
  animate,
  transition
} from '@angular/animations';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-not-found',
  standalone: true, 
  templateUrl: './not-found.html',
  styleUrls: ['./not-found.css'],
  imports: [CommonModule, RouterModule],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '500ms cubic-bezier(0.4, 0.0, 0.2, 1)',
          style({ opacity: 1, transform: 'translateY(0)' })
        )
      ])
    ])
  ]
})
export class NotFoundComponent {}
