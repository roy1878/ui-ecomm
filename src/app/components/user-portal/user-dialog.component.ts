import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../models/user';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent {
  @Input() visible = false;
  @Input() user?: User;
  @Output() save = new EventEmitter<User>();
  @Output() close = new EventEmitter<void>();

  onSave(): void {
    if (!this.user) { return; }
    this.save.emit(this.user);
  }
}
