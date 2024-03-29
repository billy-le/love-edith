import React from 'react';

import Head from 'next/head';
import { SHOPPING_CART } from '@context/context.reducers';
import { useAppContext } from '@hooks/useAppContext';
import { App } from 'context/context.interfaces';

export function MainLayout({ title, children }: React.PropsWithChildren<{ title?: string }>) {
  const { dispatch } = useAppContext();

  React.useEffect(() => {
    if ('localStorage' in window) {
      const store = window.localStorage.getItem(SHOPPING_CART);

      try {
        const cart: App.State['cart'] = store ? JSON.parse(store) : [];
        const hasFreeShipping = !!cart.find((item) => item.hasFreeShipping);
        if (hasFreeShipping) {
          dispatch({
            type: 'SET_SHIPPING_COST',
            payload: '0',
          });
        }
        dispatch({ type: 'SET_CART', payload: cart });
      } catch (err) {
        console.log(err);
        window.localStorage.clear();
      }
    }
  }, []);

  return (
    <main className='relative container mx-auto flex flex-col flex-grow p-4'>
      <Head>
        <title>
          {title}
          {title === 'Love, Edith' ? '' : ' - Love, Edith'}
        </title>
        <link rel='shortcut icon' type='image/jpg' href='/assets/favicon.ico' key='favicon' />
      </Head>
      {children}
    </main>
  );
}

MainLayout.defaultProps = {
  title: 'Love, Edith',
};
