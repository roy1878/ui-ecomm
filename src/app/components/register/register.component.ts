import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  firstName = '';
  lastName = '';
  email = '';
  city = '';
  state = '';
  pincode = '';
  country = '';
  username = '';
  password = '';
  error = '';
  success = '';

  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  register(): void {
    this.error = '';
    this.success = '';

    const firstName = this.firstName.trim();
    const lastName = this.lastName.trim();
    const email = this.email.trim();
    const city = this.city.trim();
    const state = this.state.trim();
    const pincode = this.pincode.trim();
    const country = this.country.trim();
    const username = this.username.trim();
    const password = this.password;

    if (!firstName || !lastName || !email || !city || !state || !pincode || !country || !username || !password) {
      this.error = 'Please fill in all required fields.';
      return;
    }

    const payload = {
      FirstName: firstName,
      LastName: lastName,
      email: email,
      userAddress: {
        city: city,
        state: state,
        pincode: pincode,
        country: country
      },
      username: username,
      password: password
    };

    this.authService.registerUser(payload).subscribe({
      next: () => {
        this.success = 'Registration successful. You can now log in.';
        this.router.navigate(['/login']);
      },
      error: () => {
        this.error = 'Registration failed. Please try again.';
      }
    });
  }
}
