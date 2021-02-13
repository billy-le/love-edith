import '../styles/tailwind.css';
import '../styles/index.css';

import React from 'react';
import type { AppProps } from 'next/app';

import { AppProvider } from '@context';

import { useApollo } from '@hooks/useApollo';
import { ApolloProvider, ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { IKContext } from 'imagekitio-react';

import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.min.css';

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
          <ToastContainer />
        </IKContext>
      </ApolloProvider>
    </AppProvider>
  );
}
