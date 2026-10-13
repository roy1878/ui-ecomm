import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { UserPortalComponent } from './components/user-portal/user-portal.component';
import { ProductDashboardComponent } from './components/product-dashboard/product-dashboard.component';
import { CartDashboardComponent } from './components/cart-dashboard/cart-dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'users', component: UserPortalComponent },
  { path: 'products', component: ProductDashboardComponent },
  { path: 'cart', component: CartDashboardComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
