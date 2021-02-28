import { useEffect, useRef } from 'react';

import Link from 'next/link';
import { Nav } from './nav';
import { Icon } from './icon';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useAppContext } from '@hooks/useAppContext';

const HEADER_SHADOW = 'shadow-lg';

export default function Header() {
  const { state } = useAppContext();
  const headerRef = useRef<HTMLElement>(null);

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
      <div className='flex justify-between items-center py-4 px-10'>
        <Nav />
        <h1>
          <Link href='/'>
            <a>
              <img className='h-12' src='/assets/love-edith-logo.jpg' />
            </a>
          </Link>
        </h1>
        <Link href='/cart'>
          <div className='relative h-6 w-6 cursor-pointer'>
            <Icon icon={faShoppingCart} size='lg' />
            {state.cart.length > 0 && (
              <div
                className='absolute bg-gray-400 shadow rounded-full h-5 w-5 text-xs flex items-center justify-center'
                style={{ top: -10, right: -10 }}
              >
                {state.cart.reduce((sum, item) => sum + item.qty, 0)}
              </div>
            )}
          </div>
        </Link>
      </div>
    </header>
  );
}
