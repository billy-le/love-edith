import { App } from './context.interfaces';

export function reducer(state: App.State, action: App.Action): App.State {
  switch (action.type) {
    case 'ADD_PRODUCT': {
      const product = action.payload;
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
    case 'REMOVE_PRODUCT': {
      const product = action.payload;
      const cart = [...state.cart];

      const indexOfItem = cart.findIndex((item) => item.name === product.name && item.size === product.size);
      if (indexOfItem !== -1) {
        cart[indexOfItem].qty -= 1;
      }
      return {
        ...state,
        cart,
      };
    }
    case 'TOGGLE_CART': {
      return {
        ...state,
        isCartOpen: !state.isCartOpen,
      };
    }
    default:
      return state;
  }
}
