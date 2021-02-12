import Header from '@components/header';
import { PHP } from '@helpers/currency';
import currency from 'currency.js';
import Link from 'next/link';
import { Icon } from '@components/icon';
import { faPlus, faMinus, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { useAppContext } from '@hooks/useAppContext';
import { App } from '@context/context.interfaces';
import { IKImage } from 'imagekitio-react';

const MEDIA_QUERIES = ['(max-width: 480px)', '(min-width: 481px)', '(min-width: 768px)'];

export default function ShoppingCartPage() {
  const {
    state: { cart },
    dispatch,
  } = useAppContext();
  const tableHeaders = [null, 'item', 'price', 'quantity', 'total'];

  function handleIncrementQuantity(product: App.Product) {
    return () => {
      dispatch({ type: 'ADD_PRODUCT', payload: product });
    };
  }

  function handleDecrementQuantity(product: App.Product) {
    return () => {
      dispatch({ type: 'REMOVE_PRODUCT', payload: product });
    };
  }

  return (
    <div className='main flex flex-col'>
      <Header />
      <div className='p-10'>
        <h1 className='text-center text-xl pb-5 mb-5 border-black border-b-2 border-solid'>Shopping Cart</h1>
        <table className='w-full table-fixed text-center align-top'>
          <thead>
            <tr className='border-black border-b-2 border-solid'>
              {tableHeaders.map((th, index) => (
                <th key={index} className='pb-5 uppercase'>
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
                  <td className='p-5'>
                    <picture>
                      {otherImages.map((format: any, index: number) => (
                        <source
                          key={format.url}
                          srcSet={`${format.url} ${format.width}w`}
                          media={MEDIA_QUERIES[index]}
                        />
                      ))}
                      <IKImage className='rounded h-40' src={thumbnail.url} loading='lazy' />
                    </picture>
                  </td>
                  <td className='p-5'>
                    <p className='font-bold'>{item.name}</p>
                    <p className='text-xs'>
                      Size: <span className='font-bold'>{item.size}</span>
                    </p>
                  </td>
                  <td className='p-5'>{PHP(currency(item.price)).format()}</td>
                  <td className='p-5'>
                    <button
                      className={`mr-8 py-1 px-3 shadow ${item.qty === 1 ? 'opacity-50 bg-gray-100' : ''}`}
                      onClick={handleDecrementQuantity(item)}
                      disabled={item.qty === 1}
                    >
                      <Icon icon={faMinus} />
                    </button>
                    <span>{item.qty}</span>
                    <button className='ml-8 py-1 px-3 shadow' onClick={handleIncrementQuantity(item)}>
                      <Icon icon={faPlus} />
                    </button>
                  </td>
                  <td className='p-5'>{PHP(currency(item.price).multiply(item.qty)).format()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <section className='flex justify-end pt-5 border-t-2 border-black border-solid'>
          <div className='flex flex-col items-end'>
            <Link href='/collections'>
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
            <p className='text-xs'>*shipping not included</p>
            <Link href='/checkout'>
              <button className='uppercase bg-black rounded w-40 text-center py-2 text-white mt-2'>checkout</button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
