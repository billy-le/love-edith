export declare namespace App {
  export interface State {
    isCartOpen: boolean;
    cart: Product[];
  }

  export type Product = {
    productId: number;
    qty: number;
    name: string;
    price: number;
    image: any[];
    size: 'xs' | 's' | 'm' | 'l' | 'xl';
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
      };
}
