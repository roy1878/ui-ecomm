import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'e_commerce';
  isLoading$: Observable<boolean>;

  constructor(
    public authService: AuthService,
    private router: Router,
    private loadingService: LoadingService
  ) {
    this.isLoading$ = this.loadingService.isLoading$;
  }

  get currentUserName(): any {
    return sessionStorage.getItem('userName') || null;
  }

  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
