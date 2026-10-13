import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserPortalComponent } from './components/user-portal/user-portal.component';
import { ProductDashboardComponent } from './components/product-dashboard/product-dashboard.component';
import { ProductDialogComponent } from './components/product-dashboard/product-dialog.component';
import { UserDialogComponent } from './components/user-portal/user-dialog.component';
import { CartDashboardComponent } from './components/cart-dashboard/cart-dashboard.component';
import { LoadingInterceptor } from './services/loading.interceptor';
import { AuthInterceptor } from './services/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    UserPortalComponent,
    ProductDashboardComponent,
    ProductDialogComponent,
    UserDialogComponent,
    CartDashboardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
