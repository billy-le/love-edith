export declare namespace App {
  export interface State {
    isCartOpen: boolean;
    cart: Product[];
    promo: null | {
      id: number;
      name: string;
      percent_discount: number;
      free_shipping: boolean;
      free_shipping_threshold: number;
      expire: string;
      details: string;
    };
    shipping: null | '0' | '79' | '150';
  }

  export type Product = {
    productId: number;
    qty: number;
    name: string;
    price: number;
    image: any[];
    size: 'xs' | 's' | 'm' | 'l' | 'xl';
    color: string;
    variantId: number;
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
        type: 'SET_SHIPPING';
        payload: State['shipping'];
      };
}
