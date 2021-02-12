import { createCtx } from './context.helpers';
import { reducer } from './context.reducers';
import { App } from './context.interfaces';

const initialState: App.State = {
  isCartOpen: false,
  cart: [],
};

export const [appContext, AppProvider] = createCtx(reducer, initialState);
