export declare namespace App {
  export interface State {
    isCartOpen: boolean;
    cart: Product[];
  }

  export type Product = {
    id: number;
    qty: number;
    name: string;
    description: string;
    price: number;
    image: any[];
    size: 'xs' | 's' | 'm' | 'l' | 'xl';
  };

  export type Action =
    | {
        type: 'TOGGLE_CART';
      }
    | {
        type: 'ADD_PRODUCT';
        payload: Product;
      }
    | {
        type: 'REMOVE_PRODUCT';
        payload: Product;
      };
}
