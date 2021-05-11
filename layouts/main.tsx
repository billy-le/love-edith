import React from 'react';

import Header from '@components/header';
import { SHOPPING_CART } from '@context/context.reducers';
import { useAppContext } from '@hooks/useAppContext';

export function MainLayout({ children }: React.PropsWithChildren<any>) {
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

  return <main className='relative container mx-auto flex flex-col flex-grow p-4'>{children}</main>;
}
