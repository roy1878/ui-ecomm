import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartItem } from '../../models/cart-item';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { ImageAssetService } from '../../services/image-asset.service';

@Component({
  selector: 'app-cart-dashboard',
  templateUrl: './cart-dashboard.component.html',
  styleUrls: ['./cart-dashboard.component.scss']
})
export class CartDashboardComponent implements OnInit {
  cartItems: CartItem[] = [];
  userId:any;
  userName = '';
  loading = false;
  actionLoading = false;
  placeOrderLoading = false;
  removeLoading: Record<number, boolean> = {};
  error = '';
  successMessage = '';

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private imageAssetService: ImageAssetService
  ) {}

  ngOnInit(): void {
    this.userId = sessionStorage.getItem('userId') || 0;
    this.loadCart();
  }

  loadCart(): void {
    this.loading = true;
    this.error = '';
    this.successMessage = '';
    this.cartService.getCartItemsByUserId(this.userId).subscribe({
      next: items => {
        this.cartItems = items.map(item => ({
          ...item,
          product: item.product ? {
            ...item.product,
            imgUrl: this.imageAssetService.getImageForProduct(item.product.id, item.product.imgUrl)
          } : item.product
        }));
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load cart items';
        this.loading = false;
      }
    });
  }

  placeOrder(): void {
    this.error = '';
    this.successMessage = '';
    this.placeOrderLoading = true;
    this.cartService.placeOrder(this.userId).subscribe({
      next: () => {
        this.successMessage = 'Order has been placed successfully.';
        this.loadCart();
        this.placeOrderLoading = false;
      },
      error: () => {
        this.error = 'Unable to place the order at this time.';
        this.placeOrderLoading = false;
      }
    });
  }

  get itemCount(): number {
    return this.cartItems.length;
  }

  get totalQuantity(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.quantity || item.Quantity || 0), 0);
  }

  removeItem(productId: number): void {
    this.error = '';
    this.removeLoading[productId] = true;
    this.cartService.removeFromCart(this.userId, productId).subscribe({
      next: () => {
        this.loadCart();
        this.removeLoading[productId] = false;
      },
      error: () => {
        this.error = 'Unable to remove item from cart';
        this.removeLoading[productId] = false;
      }
    });
  }
}
