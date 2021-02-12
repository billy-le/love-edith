import Link from 'next/link';
import { Nav } from './nav';
import { Icon } from './icon';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useAppContext } from '@hooks/useAppContext';

export default function Header() {
  const { state } = useAppContext();

  return (
    <header className='header flex justify-center items-center my-4 mx-10 relative'>
      <Nav className='absolute left-0' />
      <h1>
        <Link href='/'>
          <a>
            <img className='h-12' src='/assets/love-edith-logo.jpg' />
          </a>
        </Link>
      </h1>
      <Link href='/cart'>
        <a className='absolute right-0'>
          <div className='relative'>
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
        </a>
      </Link>
    </header>
  );
}
