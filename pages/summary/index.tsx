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
    $shipping_method: String!
    $social_media: ENUM_ORDER_SOCIAL_MEDIA
    $social_media_account: String
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
          shipping_method: $shipping_method
          payment_method: $payment
          discount: $discount
          social_media: $social_media
          social_media_account: $social_media_account
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
        shipping: parseInt(shippingCost || '0', 10),
        social_media_account: query.social_media_account ?? null,
        social_media: query.social_media ?? null
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
    'shipping_method' in query &&
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
      shipping_method: shippingMethod,
      social_media,
      social_media_account
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
          <div className='flex items-center justify-center mb-6 space-x-4'>
            <h1 className='text-3xl font-bold'>Order Summary</h1>
            <button
              className='flex items-center px-2 py-1 space-x-2 text-white bg-gray-900 rounded'
              style={{ height: 'fit-content' }}
              onClick={() => {
                push({
                  pathname: '/checkout',
                  query,
                });
              }}
            >
              <Icon icon={faPencilAlt} className='w-3 h-3 text-white' size='xs' />
              <span className='text-xs'>Edit</span>
            </button>
          </div>

          <div className='flex flex-col justify-center mb-8 space-y-4 sm:space-y-0 sm:flex-row sm:space-x-6'>
            <div>
              <h3 className='mb-2 text-lg font-semibold text-gray-800 underline'>Issued To:</h3>
              <p className='text-sm'>
                {first_name} {last_name}
              </p>
              <p className='text-sm'>{email}</p>
              <p className='text-sm'>+63 {contact}</p>
              {social_media && social_media_account && <p className="text-sm">{social_media_account}@{social_media}</p>}
            </div>

            <div>
              <h3 className='mb-2 text-lg font-semibold text-gray-800 underline'>Shipping Address:</h3>
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
              <h3 className='mb-2 text-lg font-semibold text-gray-800 underline'>Shipping Method:</h3>
              <p className='text-sm'>{shippingMethod}</p>
            </div>

            <div>
              <h3 className='mb-2 text-lg font-semibold text-gray-800 underline'>Payment Method:</h3>
              <p className='mb-4 text-sm uppercase'>{payment}</p>
            </div>
          </div>

          <table className='w-full text-center align-top border-t-2 border-b-2 border-black border-solid table-fixed'>
            <thead>
              <tr className='border-b-2 border-black border-solid'>
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
                        {item.isPreorder && (
                          <div>
                            <span className='text-sm font-normal'>Pre-Order</span>
                          </div>
                        )}
                      </div>
                      <picture className='flex justify-center'>
                        {otherImages.map((format: any, index: number) => (
                          <source
                            key={format.url}
                            srcSet={`${format.url} ${format.width}w`}
                            media={MEDIA_QUERIES[index]}
                          />
                        ))}
                        <IKImage className='h-20 rounded' src={thumbnail.url} loading='lazy' />
                      </picture>
                      <p className='md:hidden'>Price: {PHP(item.price).format()}</p>
                    </td>
                    <td className='p-3'>
                      <div className='hidden md:block'>
                        <div className='text-lg font-bold'>{item.name}</div>
                        <div>
                          Size: <span className='text-sm font-bold uppercase'>{item.size}</span>
                        </div>
                        <div>
                          Color: <span className='text-sm font-bold uppercase'>{item.color}</span>
                        </div>
                        {item.isPreorder && (
                          <div>
                            <span className='text-sm font-normal'>Pre-Order</span>
                          </div>
                        )}
                      </div>
                      <div className='md:hidden tw-flex'>
                        <div className='mb-2'>QTY:</div>

                        <span className='mx-2 text-xl'>{item.qty}</span>
                      </div>
                      <div className='mt-4 md:hidden'>
                        <div>Total:</div>
                        <div>{PHP(item.price).multiply(item.qty).format()}</div>
                      </div>
                    </td>
                    <td className='hidden p-3 md:table-cell'>{PHP(item.price).format()}</td>
                    <td className='hidden p-3 md:table-cell'>
                      <div className='flex items-center justify-center'>
                        <span className='w-10 mx-2'>{item.qty}</span>
                      </div>
                    </td>
                    <td className='hidden p-3 md:table-cell'>{PHP(item.price).multiply(item.qty).format()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className='flex flex-col items-end mt-4'>
            <table className='text-right table-fixed summary__table__total'>
              <tbody>
                <tr>
                  <td>Subtotal</td>
                  <td className='text-xl font-medium'>{subtotal.format()}</td>
                </tr>

                {promo?.amount
                  ? subtotal.value >= promo.amount_threshold && (
                      <tr>
                        <td>Discount - {PHP(promo.amount).format()} off</td>
                        <td className='text-xl font-medium'>-{PHP(promo.amount).format()}</td>
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
                  <td>Shipping</td>
                  <td className='text-xl font-medium'>
                    {shippingCost === '0' ? 'FREE' : PHP(typeof shippingCost === 'string' ? shippingCost : 0).format()}
                  </td>
                </tr>
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
        <section className='flex flex-col items-center justify-center flex-grow'>
          <h1 className='max-w-xl text-2xl font-bold text-center sm:text-4xl'>
            Sorry this order is incomplete, please click on the cart button to checkout
          </h1>
        </section>
      </MainLayout>
    );
}
