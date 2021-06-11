import { ImageFormat, Discount } from 'types/models';

export declare namespace App {
  export interface State {
    isCartOpen: boolean;
    cart: Product[];
    promo: null | Discount;
    shippingCost: null | '0' | '79' | '150';
  }

  export type Product = {
    productId: number;
    qty: number;
    name: string;
    price: number;
    image: ImageFormat[];
    size: string;
    color: string;
    variantId: number;
    hasFreeShipping: boolean;
    isPreorder: boolean;
  };

  export type Action =
    | {
        type: 'INCREMENT_ITEM' | 'DECREMENT_ITEM' | 'DELETE_ITEM';
        payload: Product;
      }
    | {
        type: 'SET_CART';
        payload: Product[];
      }
    | { type: 'SET_PROMO'; payload: State['promo'] }
    | {
        type: 'SET_SHIPPING_COST';
        payload: State['shippingCost'];
      };
}
