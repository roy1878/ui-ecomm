import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageAssetService {
  private readonly assetImages = [
    'assets/car (1).jpg',
    'assets/laptop.jpg',
    'assets/model.jpg'
  ];

  private readonly storageKey = 'product-asset-image-map';
  private assignedImages: Record<number, string> = this.loadAssignedImages();

  getImageForProduct(productId: number | undefined, fallback?: string): string {
    const normalizedFallback = fallback?.trim();
    if (normalizedFallback && this.isLocalAssetPath(normalizedFallback)) {
      return this.normalizeImageUrl(normalizedFallback);
    }

    if (productId === undefined || productId === null) {
      return this.normalizeImageUrl(this.getRandomImage());
    }

    if (this.assignedImages[productId]) {
      return this.normalizeImageUrl(this.assignedImages[productId]);
    }

    const image = this.getRandomImage();
    this.assignedImages[productId] = image;
    this.saveAssignedImages();
    return this.normalizeImageUrl(image);
  }

  private getRandomImage(): string {
    const index = Math.floor(Math.random() * this.assetImages.length);
    return this.assetImages[index];
  }

  private normalizeImageUrl(url: string): string {
    return encodeURI(url);
  }

  private isLocalAssetPath(url: string): boolean {
    return url.startsWith('assets/') || url.startsWith('/assets/');
  }

  private loadAssignedImages(): Record<number, string> {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) {
      return {};
    }

    try {
      return JSON.parse(stored) as Record<number, string>;
    } catch {
      return {};
    }
  }

  private saveAssignedImages(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.assignedImages));
  }
}
