import 'core-js/es/map';
import 'core-js/es/promise';
import 'core-js/es/set';

import 'tailwindcss/tailwind.css';
import '../styles/index.css';

import React from 'react';
import type { AppProps } from 'next/app';
import { DefaultSeo } from 'next-seo';
import { AppProvider } from '@context';

import { useApollo } from '@hooks/useApollo';
import { ApolloProvider, ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { IKContext } from 'imagekitio-react';

import { ToastContainer } from 'react-toastify';
import Header from '../components/header';
import Footer from '../components/footer';

import 'react-toastify/dist/ReactToastify.min.css';

export default function MyApp({
  Component,
  pageProps,
}: AppProps<{ pageProps: { initialApolloState: ApolloClient<NormalizedCacheObject> } }>) {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <>
      <AppProvider>
        <ApolloProvider client={apolloClient}>
          <IKContext urlEndpoint={`${process.env.NEXT_PUBLIC_IMAGEKIT_URL}${process.env.NEXT_PUBLIC_IMAGEKIT_FOLDER}`}>
            <div className='min-h-screen flex flex-col'>
              <DefaultSeo
                openGraph={{
                  type: 'website',
                  locale: 'en_IE',
                  url: 'https://www.love-edith.com/',
                  site_name: 'Love, Edith',
                }}
              />
              <Header />
              <Component {...pageProps} />
              <Footer />
            </div>
            <ToastContainer limit={5} newestOnTop hideProgressBar autoClose={2000} />
          </IKContext>
        </ApolloProvider>
      </AppProvider>
    </>
  );
}
