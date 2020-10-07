import { Dispatch } from 'react';
import { ACTION } from './context.actions';

export namespace App {
  export interface State {
    isCartOpen: boolean;
    cart: Product[];
  }

  export type Product = {
    productId: number;
    qty: number;
    name: string;
    description: string;
    price: number;
    image: string;
    size: 'xs' | 's' | 'm' | 'l' | 'xl';
  };

  export interface Action {
    type: ACTION;
    payload: {
      isCartOpen?: boolean;
      product?: Product;
    };
  }

  export interface Context {
    state: State;
    dispatch: Dispatch<Action>;
  }
}
