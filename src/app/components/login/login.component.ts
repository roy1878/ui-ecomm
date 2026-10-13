import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router, private userService : UserService) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  login(): void {
    this.error = '';

    if (!this.username.trim() || !this.password.trim()) {
      this.error = 'Please enter your username and password.';
      return;
    }

    const payload = {
      username: this.username.trim(),
      password: this.password
    };

    this.authService.loginUser(payload).subscribe({
      next: (response: any) => {
        const token = response?.token || response?.jwt || response?.accessToken;
        if (token) {
          sessionStorage.setItem('authToken', token);
        }
        this.userService.getAllUsers().subscribe({
          next:(response:any)=>{
            if(response){
              const userLoginObj = response.find((ele:any)=> ele.username == this.username.trim());
              sessionStorage.setItem('userId',userLoginObj?.Id);
              sessionStorage.setItem('userName',userLoginObj?.FirstName);
              

            }
          }
        })
        
        this.router.navigate(['/products']);
      },
      error: () => {
        this.error = 'Login failed. Please try again.';
      }
    });
  }
}
