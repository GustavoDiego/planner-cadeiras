import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-type-badge',
  standalone: true,
  templateUrl: './type-badge.component.html',
  styleUrls: ['./type-badge.component.scss'],
})
export class TypeBadgeComponent {
  @Input() label = '';
  @Input() color = '#7c3aed';
}
