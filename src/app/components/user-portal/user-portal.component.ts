import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-portal',
  templateUrl: './user-portal.component.html',
  styleUrls: ['./user-portal.component.scss']
})
export class UserPortalComponent implements OnInit {
  users: User[] = [];
  selectedUser?: User;
  userDialogVisible = false;
  userIdToLoad = 1;
  loading = false;
  actionLoading = false;
  error = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = '';
    this.userService.getAllUsers().subscribe({
      next: users => {
        this.users = users;
        this.loading = false;
      },
      error: err => {
        this.error = 'Unable to load users';
        this.loading = false;
      }
    });
  }

  loadUserById(): void {
    this.error = '';
    this.actionLoading = true;
    this.userService.getUserById(this.userIdToLoad).subscribe({
      next: user => {
        this.openUserDialog(user);
        this.actionLoading = false;
      },
      error: () => {
        this.error = 'User not found';
        this.actionLoading = false;
      }
    });
  }

  openUserDialog(user?: User): void {
    this.selectedUser = user ? { ...user } : {
      FirstName: '',
      LastName: '',
      email: '',
      userAddress: {
        city: '',
        state: '',
        pincode: '',
        country: ''
      }
    };
    this.userDialogVisible = true;
  }

  closeUserDialog(): void {
    this.userDialogVisible = false;
    this.selectedUser = undefined;
  }

  onDialogSave(user: User): void {
    this.error = '';
    this.actionLoading = true;
    if (user.id) {
      this.userService.updateUser(user.id, user).subscribe({
        next: updated => {
          this.loadUsers();
          this.closeUserDialog();
          this.actionLoading = false;
        },
        error: () => {
          this.error = 'Unable to update user details';
          this.actionLoading = false;
        }
      });
    } else {
      this.userService.addUser(user).subscribe({
        next: added => {
          this.loadUsers();
          this.closeUserDialog();
          this.actionLoading = false;
        },
        error: () => {
          this.error = 'Unable to add user';
          this.actionLoading = false;
        }
      });
    }
  }
}
