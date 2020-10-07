import { App } from './context.interfaces';
import { ACTION } from './context.actions';

export function reducer(state: App.State, action: App.Action): App.State {
  const { ADD_TO_CART, TOGGLE_CART, REMOVE_FROM_CART } = ACTION;

  switch (action.type) {
    case ADD_TO_CART: {
      const { product } = action.payload;
      if (!product) {
        return state;
      }

      const cart = [...state.cart];

      const indexOfItem = cart.findIndex((item) => item.name === product.name && item.size === product.size);
      if (indexOfItem !== -1) {
        cart[indexOfItem].qty += 1;
      } else {
        cart.push(product);
      }

      return {
        ...state,
        cart,
      };
    }
    case REMOVE_FROM_CART: {
      const { product } = action.payload;
      const cart = [...state.cart];

      if (!product) {
        return state;
      }

      const indexOfItem = cart.findIndex((item) => item.name === product.name && item.size === product.size);
      if (indexOfItem !== -1) {
        cart[indexOfItem].qty -= 1;
      }
      return {
        ...state,
        cart,
      };
    }
    case TOGGLE_CART: {
      const { isCartOpen } = action.payload;
      if (isCartOpen == undefined) {
        return state;
      }
      return {
        ...state,
        isCartOpen,
      };
    }
    default:
      return state;
  }
}
