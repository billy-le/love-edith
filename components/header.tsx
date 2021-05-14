import { useEffect, useRef, useState } from 'react';

import Link from 'next/link';
import { Nav } from './nav';
import { Icon } from './icon';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useAppContext } from '@hooks/useAppContext';
import { usePromo } from '../hooks/usePromo';

const HEADER_SHADOW = 'shadow-lg';

export default function Header() {
  const { state, dispatch } = useAppContext();
  const { data } = usePromo();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (data?.promos?.length) {
      dispatch({
        type: 'SET_PROMO',
        payload: data.promos[0],
      });
    }
  }, [data]);

  useEffect(() => {
    if (headerRef.current) {
      document.addEventListener('scroll', handleScrollChange);
    }

    return () => document.removeEventListener('scroll', handleScrollChange);
  }, []);

  function handleScrollChange(e: Event) {
    const target = e.target as HTMLDocument;

    if ((target?.scrollingElement?.scrollTop ?? 0) > 0) {
      if (!headerRef.current?.classList.contains(HEADER_SHADOW)) {
        headerRef.current?.classList.add(HEADER_SHADOW);
      }
    } else if (headerRef.current?.classList.contains(HEADER_SHADOW)) {
      headerRef.current.classList.remove(HEADER_SHADOW);
    }
  }

  return (
    <header ref={headerRef} className='header sticky top-0 bg-white z-10'>
      <div className='container relative flex justify-center items-center mx-auto p-4'>
        <Nav className='absolute left-4' />
        <h1>
          <Link href='/'>
            <a>
              <img className='h-12' src='/assets/love-edith-logo.jpg' />
            </a>
          </Link>
        </h1>
        <div className='absolute right-4'>
          <Link href='/cart'>
            <a className='relative inline-block cursor-pointer'>
              <Icon className='h-6 w-6' icon={faShoppingCart} size='lg' />
              {state.cart.length > 0 && (
                <div className='absolute bg-red-400 shadow rounded-full h-5 w-5 text-xs flex items-center justify-center animate-bounce -top-3 right-0 sm:-right-2.5'>
                  {state.cart.reduce((sum, item) => sum + item.qty, 0)}
                </div>
              )}
            </a>
          </Link>
        </div>
      </div>
      {state.promo && (
        <div className='bg-red-100 bg-opacity-80 '>
          <p className='container mx-auto px-4 py-1 text-center text-xs sm:text-sm'>{state.promo.details}</p>
        </div>
      )}
    </header>
  );
}
