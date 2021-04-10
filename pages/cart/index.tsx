import { PHP } from '@helpers/currency';
import currency from 'currency.js';
import Link from 'next/link';
import { Icon } from '@components/icon';
import { faAngleRight, faTrash, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { useAppContext } from '@hooks/useAppContext';
import { App } from '@context/context.interfaces';
import { IKImage } from 'imagekitio-react';
import { useMedia } from 'react-use';

const MEDIA_QUERIES = ['(max-width: 480px)', '(min-width: 481px)', '(min-width: 768px)'];
const TABLE_HEADERS = [null, 'item', 'price', 'quantity', 'total', null];

export default function ShoppingCartPage() {
  const isScreenSm = useMedia('(max-width: 480px)');

  const {
    state: { cart },
    dispatch,
  } = useAppContext();

  function handleIncrementQuantity(item: App.Product) {
    return () => {
      dispatch({ type: 'INCREMENT_ITEM', payload: item });
    };
  }

  function handleDecrementQuantity(item: App.Product) {
    return () => {
      dispatch({ type: 'DECREMENT_ITEM', payload: item });
    };
  }

  function handleDelete(item: App.Product) {
    return () => {
      dispatch({ type: 'DELETE_ITEM', payload: item });
    };
  }

  function handleCheckout() {
    const items = cart.filter((product) => product.qty);
    dispatch({
      type: 'SET_CART',
      payload: items,
    });
  }

  return (
    <>
      <h1 className='text-center text-xl pb-5 mb-5'>Shopping Cart</h1>
      <table className='table-fixed border-black border-b-2 border-t-2 border-solid w-full text-center align-top'>
        <thead>
          <tr className='border-black border-b-2 border-solid'>
            {TABLE_HEADERS.map((th, index) => (
              <th key={index} className={`py-2 uppercase ${index > 1 ? 'hidden md:table-cell' : ''}`}>
                {th}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cart.map((item, index) => {
            const [thumbnail, ...otherImages] = item.image;
            otherImages.pop();
            return (
              <tr key={index}>
                <td className='p-3'>
                  <p className='font-bold md:hidden'>{item.name}</p>
                  <div className='md:hidden'>
                    <span className='text-sm font-normal'>
                      Size: <span className='font-bold uppercase'>{item.size}</span>
                    </span>
                    {' | '}
                    <span className='text-sm font-normal'>
                      Color: <span className='font-bold uppercase'>{item.color}</span>
                    </span>
                  </div>
                  <picture className='flex justify-center'>
                    {otherImages.map((format: any, index: number) => (
                      <source key={format.url} srcSet={`${format.url} ${format.width}w`} media={MEDIA_QUERIES[index]} />
                    ))}
                    <IKImage className='rounded h-40' src={thumbnail.url} loading='lazy' />
                  </picture>
                  <p className='md:hidden'>Price: {PHP(item.price).format()}</p>
                </td>
                <td className='p-3'>
                  <div className='hidden md:block'>
                    <div className='text-lg font-bold'>{item.name}</div>
                    <div>
                      Size: <span className='font-bold text-sm uppercase'>{item.size}</span>
                    </div>
                    <div>
                      Color: <span className='font-bold text-sm uppercase'>{item.color}</span>
                    </div>
                  </div>
                  <div className='md:hidden tw-flex'>
                    <div className='mb-2'>QTY:</div>
                    <button
                      className={'py-1 px-2 shadow disabled:opacity-50'}
                      disabled={!item.qty}
                      onClick={handleDecrementQuantity(item)}
                    >
                      <Icon icon={faMinus} size='sm' />
                    </button>
                    <span className='mx-2 text-xl'>{item.qty}</span>
                    <button className='py-1 px-2 shadow' onClick={handleIncrementQuantity(item)}>
                      <Icon icon={faPlus} size='sm' />
                    </button>
                  </div>
                  <div className='md:hidden mt-4'>
                    <div>Total:</div>
                    <div>{PHP(item.price).multiply(item.qty).format()}</div>
                  </div>
                  <div className='md:hidden mt-4 flex justify-end'>
                    <button className={`py-1 px-3 shadow`} onClick={handleDelete(item)}>
                      <Icon icon={faTrash} />
                    </button>
                  </div>
                </td>
                <td className='p-3 hidden md:table-cell'>{PHP(item.price).format()}</td>
                <td className='p-3 hidden md:table-cell'>
                  <div className='flex items-center justify-center'>
                    <button
                      className={'py-1 px-2 shadow disabled:opacity-50'}
                      disabled={!item.qty}
                      onClick={handleDecrementQuantity(item)}
                    >
                      <Icon icon={faMinus} size='sm' />
                    </button>
                    <span className='mx-2 w-10'>{item.qty}</span>
                    <button className='py-1 px-2 shadow' onClick={handleIncrementQuantity(item)}>
                      <Icon icon={faPlus} size='sm' />
                    </button>
                  </div>
                </td>
                <td className='p-3 hidden md:table-cell'>{PHP(item.price).multiply(item.qty).format()}</td>
                <td className='p-3 hidden md:table-cell'>
                  <button className={`py-1 px-3 shadow`} onClick={handleDelete(item)}>
                    <Icon icon={faTrash} />
                  </button>
                </td>
              </tr>
            );
          })}
          {!cart.length && (
            <tr>
              <td colSpan={isScreenSm ? 2 : TABLE_HEADERS.length} className='py-10'>
                <p>Your cart is empty!</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {cart.length > 0 && (
        <section className='flex justify-end pt-5'>
          <div className='flex flex-col items-end'>
            <Link href='/products'>
              <a>
                Continue Shopping <Icon icon={faAngleRight} />
              </a>
            </Link>
            <p>
              Subtotal{' '}
              <span className='text-2xl font-bold'>
                {PHP(
                  cart.reduce((sum, item) => currency(sum).add(currency(item.price).multiply(item.qty)), currency(0))
                ).format()}
              </span>
            </p>
            <p className='text-xs'>*shipping calculated on next page</p>
            <Link href='/checkout'>
              <button
                className='uppercase bg-black rounded w-40 text-center py-2 text-white mt-2'
                onClick={handleCheckout}
              >
                checkout
              </button>
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
