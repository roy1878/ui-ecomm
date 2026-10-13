import { Component, OnInit } from '@angular/core';
import { Product, ProductPageResponse } from '../../models/product';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { ImageAssetService } from '../../services/image-asset.service';

@Component({
  selector: 'app-product-dashboard',
  templateUrl: './product-dashboard.component.html',
  styleUrls: ['./product-dashboard.component.scss']
})
export class ProductDashboardComponent implements OnInit {
  products: Product[] = [];
  selectedProduct?: Product;
  productDialogVisible = false;
  searchKeyword = '';
  loading = false;
  actionLoading = false;
  addToCartLoading: Record<number, boolean> = {};
  quantityToAdd: Record<number, number> = {};
  error = '';
  successMessage = '';
  currentPage = 0;
  pageSize = 4;
  totalPages = 0;
  totalElements = 0;
  userId:any;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private imageAssetService: ImageAssetService
  ) {}

  ngOnInit(): void {
    this.userId = sessionStorage.getItem('userId') || 0;
    this.loadProducts(this.currentPage);
  }

  loadProducts(page: number = this.currentPage): void {
    this.loading = true;
    this.error = '';
    this.successMessage = '';

    this.productService.getAllProducts(page, this.pageSize).subscribe({
      next: (response: ProductPageResponse) => {
        const pageProducts = response.content || [];
        this.products = pageProducts.map(product => this.normalizeProduct(product));
        this.currentPage = response.number ?? page;
        this.totalPages = response.totalPages ?? 0;
        this.totalElements = response.totalElements ?? this.products.length;
        this.initializeQuantities(this.products);
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load products';
        this.loading = false;
      }
    });
  }

  changePage(page: number): void {
    if (page < 0 || page >= this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.loadProducts(page);
  }

  changePageSize(): void {
    this.currentPage = 0;
    this.loadProducts(0);
  }

  loadProductById(productId: number): void {
    this.error = '';
    this.actionLoading = true;
    this.productService.getProductById(productId).subscribe({
      next: product => {
        this.selectedProduct = this.normalizeProduct(product);
        this.productDialogVisible = true;
        this.actionLoading = false;
      },
      error: () => {
        this.error = 'Product not found';
        this.actionLoading = false;
      }
    });
  }

  createProduct(): void {
    this.selectedProduct = {
      name: '',
      description: '',
      price: 0,
      stockQuantity: 0,
      category: '',
      imgUrl: ''
    };
    this.productDialogVisible = true;
  }

  saveProduct(): void {
    if (!this.selectedProduct) { return; }
    this.error = '';
    this.actionLoading = true;
    const productToSave = this.normalizeProduct(this.selectedProduct);

    if (productToSave.id) {
      this.productService.updateProduct(Number(productToSave.id), productToSave).subscribe({
        next: () => {
          this.loadProducts(this.currentPage);
          this.closeDialog();
          this.actionLoading = false;
        },
        error: () => {
          this.error = 'Unable to update product';
          this.actionLoading = false;
        }
      });
    } else {
      this.productService.createProduct(productToSave).subscribe({
        next: () => {
          this.loadProducts(0);
          this.closeDialog();
          this.actionLoading = false;
        },
        error: () => {
          this.error = 'Unable to create product';
          this.actionLoading = false;
        }
      });
    }
  }

  addToCart(product: Product): void {
    // if (this.userId) {
    //   this.error = 'Please login before adding items to cart.';
    //   return;
    // }

    const productId = this.getProductKey(product);
    const quantity = Math.max(1, this.quantityToAdd[productId] ?? 1);
    this.addToCartLoading[productId] = true;
    const cartItem = {
      productId,
      quantity,
      price: product.price,
      product: {
        ...product,
        id: productId,
        category: product.category || product.Category || 'Uncategorized'
      } as any
    };

    this.cartService.addToCart( this.userId, cartItem).subscribe({
      next: () => {
        this.successMessage = `${product.name} (x${quantity}) added to cart.`;
        this.addToCartLoading[productId] = false;
      },
      error: () => {
        this.error = 'Unable to add product to cart.';
        this.addToCartLoading[productId] = false;
      }
    });
  }

  openDialog(product?: Product): void {
    this.selectedProduct = product ? { ...product } : {
      name: '',
      description: '',
      price: 0,
      stockQuantity: 0,
      category: '',
      imgUrl: ''
    };
    this.productDialogVisible = true;
  }

  closeDialog(): void {
    this.productDialogVisible = false;
    this.selectedProduct = undefined;
  }

  onDialogSave(product: Product): void {
    this.selectedProduct = product;
    this.saveProduct();
  }

  searchProducts(): void {
    if (!this.searchKeyword.trim()) {
      this.loadProducts(this.currentPage);
      return;
    }

    this.actionLoading = true;
    this.productService.searchProducts(this.searchKeyword, this.currentPage, this.pageSize).subscribe({
      next: (response: ProductPageResponse) => {
        const pageProducts = response.content || [];
        this.products = pageProducts.map(product => this.normalizeProduct(product));
        this.currentPage = response.number ?? this.currentPage;
        this.totalPages = response.totalPages ?? 0;
        this.totalElements = response.totalElements ?? this.products.length;
        this.initializeQuantities(this.products);
        this.actionLoading = false;
      },
      error: () => {
        this.error = 'Search failed';
        this.actionLoading = false;
      }
    });
  }

  getProductKey(product: Product): number {
    return Number(product.id ?? 0);
  }

  private normalizeProduct(product: Product): Product {
    const normalized = { ...product } as Product;
    normalized.id = product.id !== undefined ? Number(product.id) : undefined;
    normalized.category = product.category || product.Category || 'Uncategorized';
    normalized.imgUrl = this.imageAssetService.getImageForProduct(this.getProductKey(product), product.imgUrl);
    return normalized;
  }

  private initializeQuantities(products: Product[]): void {
    products.forEach(product => {
      const productId = this.getProductKey(product);
      if (productId > 0 && this.quantityToAdd[productId] === undefined) {
        this.quantityToAdd[productId] = 1;
      }
    });
  }
}
