import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CartItem } from '../models/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = 'http://localhost:8080/cart';

  constructor(private http: HttpClient) {}

  getCartItemsByUserId(userId: number): Observable<CartItem[]> {
    const headers = new HttpHeaders().set('X-User-ID', userId.toString());
    return this.http.get<CartItem[]>(`${this.baseUrl}`, { headers });
  }

  addToCart(userId: number, cartItem: CartItem): Observable<CartItem> {
    const headers = new HttpHeaders().set('X-User-ID', userId.toString());
    return this.http.post<CartItem>(`${this.baseUrl}/add`, cartItem, { headers });
  }

  removeFromCart(userId: number, productId: number): Observable<void> {
    const headers = new HttpHeaders().set('X-User-ID', userId.toString());
    return this.http.delete<void>(`${this.baseUrl}/remove/${productId}`, { headers });
  }

  placeOrder(userId: number): Observable<any> {
    const headers = new HttpHeaders().set('X-User-ID', userId.toString());
    return this.http.post<any>('http://localhost:8080/order/create', {}, { headers });
  }
}
