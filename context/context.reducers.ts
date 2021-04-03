import { App } from './context.interfaces';

export const SHOPPING_CART = 'shopping_cart';

function storeCart(cart: App.State['cart']) {
  if ('localStorage' in window) {
    window.localStorage.setItem(SHOPPING_CART, JSON.stringify(cart));
  }
}

export function reducer(state: App.State, action: App.Action): App.State {
  switch (action.type) {
    case 'INCREMENT_ITEM': {
      const product = action.payload;
      const cart = state.cart;

      const indexOfItem = cart.findIndex((item: any) => item.name === product.name && item.size === product.size);
      if (indexOfItem !== -1) {
        cart[indexOfItem].qty += 1;
      } else {
        cart.push(product);
      }

      storeCart(cart);

      return {
        ...state,
        cart,
      };
    }
    case 'DECREMENT_ITEM': {
      const product = action.payload;
      const cart = state.cart;

      const indexOfItem = cart.findIndex((item: any) => item.name === product.name && item.size === product.size);
      if (indexOfItem !== -1) {
        cart[indexOfItem].qty -= 1;
      }

      storeCart(cart);

      return {
        ...state,
        cart,
      };
    }
    case 'DELETE_ITEM': {
      const product = action.payload;
      const cart = state.cart.filter((item) => item.variantId !== product.variantId);

      storeCart(cart);

      return {
        ...state,
        cart,
      };
    }
    case 'SET_CART': {
      const cart = action.payload;
      storeCart(cart);
      return {
        ...state,
        cart,
      };
    }
    case 'SET_PROMO': {
      return {
        ...state,
        promo: action.payload,
      };
    }
    case 'SET_SHIPPING': {
      return {
        ...state,
        shipping: action.payload,
      };
    }
    default:
      return state;
  }
}
