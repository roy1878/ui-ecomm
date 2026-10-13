export interface CartProduct {
  id?: number;
  name: string;
  description: string;
  imgUrl: string;
  price: number;
  stockQuantity: number;
  Category?: string;
  category?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  id?: number;
  productId: number;
  Quantity?: number;
  quantity: number;
  price?: number;
  product?: CartProduct;
}
