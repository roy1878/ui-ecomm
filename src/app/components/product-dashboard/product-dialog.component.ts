import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.scss']
})
export class ProductDialogComponent {
  @Input() visible = false;
  @Input() product?: Product;
  @Output() save = new EventEmitter<Product>();
  @Output() close = new EventEmitter<void>();

  onSave(): void {
    if (!this.product) { return; }
    this.save.emit(this.product);
  }
}
