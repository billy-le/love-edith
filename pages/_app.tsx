import '../styles/tailwind.css';
import '../styles/index.css';

import React, { useReducer } from 'react';
import type { AppProps } from 'next/app';

import { AppProvider as Provider } from '../context';
import { reducer } from '../context/context.reducers';
import { App } from '../context/context.interfaces';

const initialState: App.State = {
  isCartOpen: false,
  cart: [],
};

function AppProvider({ children }: React.PropsWithChildren<React.ReactNode>) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
  );
}

export default MyApp;
