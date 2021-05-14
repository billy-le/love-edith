import React from 'react';

import Head from 'next/head';
import { SHOPPING_CART } from '@context/context.reducers';
import { useAppContext } from '@hooks/useAppContext';

export function MainLayout({ title, children }: React.PropsWithChildren<{ title?: string }>) {
  const { dispatch } = useAppContext();

  React.useEffect(() => {
    if ('localStorage' in window) {
      const cart = window.localStorage.getItem(SHOPPING_CART);
      if (cart) {
        try {
          dispatch({ type: 'SET_CART', payload: JSON.parse(cart) });
        } catch (err) {
          console.log(err);
        }
      }
    }
  }, []);

  return (
    <main className='relative container mx-auto flex flex-col flex-grow p-4'>
      <Head>
        <title>{title}</title>
        <link rel='shortcut icon' type='image/jpg' href='/assets/favicon.ico' key='favicon' />
      </Head>
      {children}
    </main>
  );
}

MainLayout.defaultProps = {
  title: 'love, edith',
};
