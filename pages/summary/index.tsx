import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/router';
import { Icon } from 'components/icon';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { useAppContext } from '@hooks/useAppContext';
import { PHP } from '@helpers/currency';
import { IKImage } from 'imagekitio-react';
import currency from 'currency.js';
import { toast } from 'react-toastify';
import { MainLayout } from 'layouts/main';

const CREATE_ORDER = gql`
  mutation CreateOrder(
    $first_name: String!
    $last_name: String!
    $email: String!
    $contact: String!
    $building: String!
    $street: String!
    $barangay: String!
    $city: String!
    $province: String!
    $region: String!
    $landmarks: String!
    $shipping: Float!
    $payment: ENUM_ORDER_PAYMENT_METHOD!
    $items: JSON!
    $discount: ID
  ) {
    createOrder(
      input: {
        data: {
          first_name: $first_name
          last_name: $last_name
          email: $email
          contact_number: $contact
          house_building_unit: $building
          street: $street
          barangay: $barangay
          city: $city
          province: $province
          region: $region
          landmarks: $landmarks
          items: $items
          shipping: $shipping
          payment_method: $payment
          discount: $discount
        }
      }
    ) {
      order {
        order_number
      }
    }
  }
`;

const MEDIA_QUERIES = ['(max-width: 480px)', '(min-width: 481px)', '(min-width: 768px)'];
const TABLE_HEADERS = [null, 'item', 'price', 'quantity', 'total'];

export default function OrderSummary() {
  const {
    state: { cart, promo, shippingCost },
    dispatch,
  } = useAppContext();
  const { push, query } = useRouter();
  const [createOrder, { loading }] = useMutation(CREATE_ORDER);

  async function handleOrderSubmit() {
    if (!cart.length) {
      toast('Your cart is empty! Try adding some items before submitting an order.', {
        type: 'info',
      });
      return;
    }
    const res = await createOrder({
      variables: {
        ...query,
        items: JSON.stringify(cart),
        discount: promo ? parseInt(promo.id, 10) : null,
        shipping: parseFloat(query.shipping as any),
      },
    });

    if (res.data?.createOrder?.order?.order_number) {
      push({
        pathname: '/thank-you',
      });
      localStorage.removeItem('shopping_cart');
      dispatch({ type: 'SET_CART', payload: [] });
    } else {
      toast(
        `We're sorry. Your order didn't go thru. Please try again or contact hello@love-edith.com for further assistance.`,
        {
          type: 'error',
        }
      );
    }
  }

  if (
    'barangay' in query &&
    'building' in query &&
    'city' in query &&
    'contact' in query &&
    'email' in query &&
    'landmarks' in query &&
    'first_name' in query &&
    'last_name' in query &&
    'payment' in query &&
    'province' in query &&
    'region' in query &&
    'street' in query &&
    'shipping' in query &&
    shippingCost
  ) {
    const {
      barangay,
      building,
      city,
      contact,
      email,
      landmarks,
      first_name,
      last_name,
      payment,
      province,
      region,
      street,
      shipping: shippingMethod,
    } = query;

    const subtotal = PHP(
      cart.reduce((sum, item) => currency(sum).add(currency(item.price).multiply(item.qty)), currency(0))
    );

    const total = PHP(subtotal)
      .subtract(PHP(subtotal).multiply(`0.${promo?.percent_discount ?? 0}`))
      .add(typeof shippingCost === 'string' ? shippingCost : 0);

    return (
      <MainLayout title='Order Summary'>
        <section>
          <div className='flex items-center justify-center space-x-4 mb-6'>
            <h1 className='text-3xl font-bold'>Order Summary</h1>
            <button
              className='flex items-center space-x-2 bg-gray-900 text-white px-2 py-1 rounded'
              style={{ height: 'fit-content' }}
              onClick={() => {
                push({
                  pathname: '/checkout',
                  query,
                });
              }}
            >
              <Icon icon={faPencilAlt} className='text-white h-3 w-3' size='xs' />
              <span className='text-xs'>Edit</span>
            </button>
          </div>

          <div className='flex justify-center flex-col space-y-4 sm:space-y-0 sm:flex-row sm:space-x-6 mb-8'>
            <div>
              <h3 className='text-lg underline font-semibold text-gray-800 mb-2'>Issued To:</h3>
              <p className='text-sm'>
                {first_name} {last_name}
              </p>
              <p className='text-sm'>{email}</p>
              <p className='text-sm'>+63 {contact}</p>
            </div>

            <div>
              <h3 className='text-lg underline font-semibold text-gray-800 mb-2'>Shipping Details:</h3>
              <p className='text-sm'>
                {building} {street}
              </p>
              <p className='text-sm'>
                {city}, Barangay {barangay}
              </p>
              <p className='text-sm'>
                {region}, {province}
              </p>
              <p className='text-sm'>{landmarks}</p>
            </div>

            <div>
              <h3 className='text-lg underline font-semibold text-gray-800 mb-2'>Shipping Method:</h3>
              <p className='text-sm'>
                {shippingMethod === '0' ? 'FREE' : shippingCost === '79' ? 'Metro Manila' : 'Outside Metro Manila'}
              </p>
            </div>

            <div>
              <h3 className='text-lg underline font-semibold text-gray-800 mb-2'>Payment Method:</h3>
              <p className='text-sm uppercase mb-4'>{payment}</p>
            </div>
          </div>

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
                          <source
                            key={format.url}
                            srcSet={`${format.url} ${format.width}w`}
                            media={MEDIA_QUERIES[index]}
                          />
                        ))}
                        <IKImage className='rounded h-20' src={thumbnail.url} loading='lazy' />
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

                        <span className='mx-2 text-xl'>{item.qty}</span>
                      </div>
                      <div className='md:hidden mt-4'>
                        <div>Total:</div>
                        <div>{PHP(item.price).multiply(item.qty).format()}</div>
                      </div>
                    </td>
                    <td className='p-3 hidden md:table-cell'>{PHP(item.price).format()}</td>
                    <td className='p-3 hidden md:table-cell'>
                      <div className='flex items-center justify-center'>
                        <span className='mx-2 w-10'>{item.qty}</span>
                      </div>
                    </td>
                    <td className='p-3 hidden md:table-cell'>{PHP(item.price).multiply(item.qty).format()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className='flex flex-col items-end mt-4'>
            <table className='summary__table__total table-fixed text-right'>
              <tbody>
                <tr>
                  <td>Subtotal</td>
                  <td className='text-xl font-medium'>{subtotal.format()}</td>
                </tr>
                <tr>
                  <td>Shipping</td>
                  <td className='text-xl font-medium'>
                    {shippingCost === '0' ? 'FREE' : PHP(typeof shippingCost === 'string' ? shippingCost : 0).format()}
                  </td>
                </tr>
                {promo?.amount
                  ? subtotal.value >= promo.amount_threshold && (
                      <tr>
                        <td>Discount - {PHP(promo.amount).format()} off</td>
                        <td className='text-xl font-medium'>-{PHP(subtotal).subtract(promo.amount).format()}</td>
                      </tr>
                    )
                  : null}
                {promo?.percent_discount
                  ? subtotal.value >= promo.percent_discount_threshold && (
                      <tr>
                        <td>Discount - {promo.percent_discount}% off</td>
                        <td className='text-xl font-medium'>
                          -
                          {PHP(subtotal)
                            .subtract(promo.amount && promo.amount >= promo.amount_threshold ? promo.amount : 0)
                            .multiply(`0.${promo.percent_discount}`)
                            .format()}
                        </td>
                      </tr>
                    )
                  : null}
                <tr>
                  <td>Total</td>
                  <td className='text-2xl font-bold'>{total.format()}</td>
                </tr>
              </tbody>
            </table>

            <button
              disabled={loading}
              className={`uppercase bg-black rounded w-40 text-center py-2 text-white mt-2 ${
                loading ? 'opacity-50 pointer-events-none' : ''
              }`}
              onClick={handleOrderSubmit}
            >
              Submit Order
            </button>
          </div>
        </section>
      </MainLayout>
    );
  } else
    return (
      <MainLayout title='Order Summary'>
        <section className='flex-grow flex flex-col items-center justify-center'>
          <h1 className='text-2xl sm:text-4xl font-bold text-center max-w-xl'>
            Sorry this order is incomplete, please click on the cart button to checkout
          </h1>
        </section>
      </MainLayout>
    );
}
