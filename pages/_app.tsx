import '../styles/tailwind.css';
import '../styles/index.css';

import React, { useReducer } from 'react';
import type { AppProps } from 'next/app';

import { AppProvider as Provider } from '../context';
import { reducer } from '../context/context.reducers';
import { App } from '../context/context.interfaces';

import { useApollo } from '../libs/useApollo';
import { ApolloProvider, ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { IKContext } from 'imagekitio-react';

const initialState: App.State = {
  isCartOpen: false,
  cart: [],
};

function AppProvider({ children }: React.PropsWithChildren<React.ReactNode>) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
}

export default function MyApp({
  Component,
  pageProps,
}: AppProps<{ pageProps: { initialApolloState: ApolloClient<NormalizedCacheObject> } }>) {
  const apolloClient = useApollo(pageProps.initialApolloState);
  return (
    <AppProvider>
      <ApolloProvider client={apolloClient}>
        <IKContext urlEndpoint={`${process.env.NEXT_PUBLIC_IMAGEKIT_URL}${process.env.NEXT_PUBLIC_IMAGEKIT_FOLDER}`}>
          <Component {...pageProps} />
        </IKContext>
      </ApolloProvider>
    </AppProvider>
  );
}
