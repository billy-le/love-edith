import React, { useState } from 'react';

// libs
import { PHP } from '@helpers/currency';
import regions from 'philippines/regions.json';
import cities from 'philippines/cities.json';
import provinces from 'philippines/provinces.json';
import { toast } from 'react-toastify';
import { gql, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { useAppContext } from '@hooks/useAppContext';
import { useRouter } from 'next/router';
import Link from 'next/link';

// components
import { Input } from '@components/input';
import { Label } from '@components/label';
import { FormControl } from '@components/form-control';
import { TextArea } from '@components/text-area';
import { IKImage } from 'imagekitio-react';

const CREATE_ORDER = gql`
  mutation CreateOrder(
    $name: String!
    $email: String!
    $contact: String
    $building: String
    $street: String
    $barangay: String
    $city: String
    $province: String
    $region: String
    $landmarks: String
    $shipping: Float!
    $items: JSON!
  ) {
    createOrder(
      input: {
        data: {
          name: $name
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
        }
      }
    ) {
      order {
        order_number
      }
    }
  }
`;

export default function CheckoutPage() {
  const { state } = useAppContext();
  const [createOrder, { loading }] = useMutation(CREATE_ORDER);
  const { register, handleSubmit, setValue, getValues, errors, clearErrors, setError } = useForm();
  const { push } = useRouter();
  const [shipping, setShipping] = useState<null | string>(null);

  async function onSubmit() {
    if (!shipping) {
      return;
    }
    const { email, name, contact, building, street, barangay, city, province, region, landmarks } = getValues();

    const res = await createOrder({
      variables: {
        name,
        email,
        contact,
        building,
        street,
        barangay,
        city,
        province,
        region,
        landmarks,
        items: JSON.stringify(state.cart),
        shipping: parseInt(shipping, 10),
      },
    });

    if (res.data.createOrder.order.order_number) {
      push(`/order/${res.data.createOrder.order.order_number}`);
    } else if (res.errors) {
      toast('Uh-oh! Something went wrong! Please try again or contact us.', { type: 'error' });
    }
  }

  function handleShippingChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    setShipping(value);
  }

  const subtotal = state.cart.reduce((sum, item) => PHP(sum).add(PHP(item.price).multiply(item.qty)), PHP(0)).format();

  if (state.cart.length === 0) {
    return (
      <div className='flex-grow pt-40 justify-center'>
        <div className='max-w-2xl mx-auto'>
          <h2 className='text-3xl sm:text-5xl font-black mb-8'>
            Oops! There doesn't seem like there is anything to checkout!
          </h2>
          <p className='text-xl sm:text-4xl'>
            Why not take a look at our{' '}
            <Link href='/products'>
              <a className='text-red-400'>products and start shopping!</a>
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className='container mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6'>
      <form className='grid grid-cols-1 sm:grid-cols-2 gap-2' style={{ height: 'fit-content' }}>
        <FormControl className='col-span-1 sm:col-span-2'>
          <Label htmlFor='name'>Name</Label>
          <Input ref={register({ required: true })} id='name' name='name' type='text' error={errors.name} />
        </FormControl>

        <FormControl className='col-span-1 sm:col-span-2'>
          <Label htmlFor='contact'>Contact Number</Label>
          <Input
            ref={register({ required: true })}
            id='contact'
            name='contact'
            type='number'
            inputMode='tel'
            error={errors.contact}
          />
        </FormControl>

        <FormControl className='col-span-1 sm:col-span-2'>
          <Label htmlFor='email'>Email</Label>
          <Input
            ref={register({ required: true })}
            id='email'
            name='email'
            type='email'
            inputMode='email'
            error={errors.email}
          />
        </FormControl>

        <h3 className='mt-4 col-span-1 sm:col-span-2'>Shipping Address</h3>
        <FormControl>
          <Label htmlFor='building'>Unit Number / House / Building</Label>
          <Input ref={register({ required: true })} id='building' name='building' type='text' error={errors.building} />
        </FormControl>
        <FormControl>
          <Label htmlFor='street'>Street</Label>
          <Input ref={register({ required: true })} id='street' name='street' type='text' error={errors.street} />
        </FormControl>

        <FormControl>
          <Label htmlFor='barangay'>Barangay</Label>
          <Input ref={register({ required: true })} id='barangay' name='barangay' type='text' error={errors.barangay} />
        </FormControl>

        <FormControl>
          <Label htmlFor='city'>City</Label>
          <Input
            list='cities'
            id='city'
            name='city'
            type='text'
            ref={register({
              required: true,
            })}
            error={errors.city}
          />

          <datalist id='cities'>
            {cities
              .sort((a, b) => `${a.name} - ${a.province}`.localeCompare(`${b.name} - ${b.province}`))
              .map((city, index) => (
                <option key={index} value={`${city.name} - ${city.province}`} data-key={city.province}>
                  {city.name} - {city.province}
                </option>
              ))}
          </datalist>
        </FormControl>

        <FormControl>
          <Label htmlFor='province'>Province</Label>
          <Input
            list='provinces'
            id='province'
            name='province'
            ref={register({
              required: true,
            })}
            error={errors.province}
          />

          <datalist id='provinces'>
            {provinces
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((province) => (
                <option key={province.key} value={province.name} data-key={province.region}>
                  {province.name}
                </option>
              ))}
          </datalist>
        </FormControl>

        <FormControl>
          <Label htmlFor='region'>Region</Label>
          <Input
            list='regions'
            id='region'
            name='region'
            ref={register({
              required: true,
            })}
            error={errors.region}
          />

          <datalist id='regions'>
            {regions
              .sort((a, b) => a.long.localeCompare(b.long))
              .map((region) => (
                <option key={region.key} value={region.long}>
                  {region.long}
                </option>
              ))}
          </datalist>
        </FormControl>

        <FormControl className='col-span-1 sm:col-span-2'>
          <Label htmlFor='landmarks'>Landmarks</Label>
          <TextArea ref={register} id='landmarks' name='landmarks' rows={3} />
        </FormControl>

        <FormControl className='col-span-1 sm:col-span-2'></FormControl>

        <FormControl className='col-span-1 sm:col-span-2 flex justify-end'></FormControl>
      </form>

      <div className='flex flex-col bg-gray-100 shadow-md rounded p-4'>
        {state.cart.map((item, index) => (
          <div className='flex items-center justify-between mb-4' key={index}>
            <div className='flex items-center h-full'>
              <div className='relative mr-4'>
                <picture>
                  {item.image.map((format: any, index: number) => (
                    <source key={index} srcSet={`${format.url} ${format.width}w`} />
                  ))}
                  <IKImage className='h-16 rounded' src={item.image[0].url} />
                </picture>
                <div
                  className='h-4 w-4 rounded-full bg-gray-900 text-white absolute flex items-center justify-center text-xs shadow cursor-default'
                  style={{ right: -8, top: -8 }}
                >
                  <span className='pr-px'>{item.qty}</span>
                </div>
              </div>

              <div>
                <div>
                  <span>{item.name}</span>
                  {` | `}
                  <span className='capitalize'>{item.size}</span>
                </div>
              </div>
            </div>
            <div>{PHP(item.price).multiply(item.qty).format()}</div>
          </div>
        ))}

        <div className='flex justify-between py-4 border-t border-solid border-b border-black'>
          <p className='font-black'>Subtotal</p>
          <p>{state.cart.reduce((sum, item) => PHP(sum).add(PHP(item.price).multiply(item.qty)), PHP(0)).format()}</p>
        </div>

        <div className='py-4 border-solid border-b border-black'>
          <p className='mb-2 font-black'>Shipping Method</p>

          <div className='flex items-center'>
            <input
              className='mr-1'
              type='radio'
              name='shipping'
              id='pick-up'
              value='0'
              onChange={handleShippingChange}
            />
            <Label htmlFor='pick-up' style={{ width: 'max-content' }}>
              Pick-up at HQ / Book Your Own Courier
            </Label>
          </div>
          <div className='mb-2 text-xs pl-4'>
            <p>Eastwood Lafayette 3</p>
            <p>1pm - 5pm</p>
          </div>
          <div className='mb-2 flex items-center'>
            <input
              className='mr-1'
              type='radio'
              name='shipping'
              id='manila'
              value='79'
              onChange={handleShippingChange}
            />
            <Label htmlFor='manila' style={{ width: 'max-content' }}>
              Metro Manila - {PHP(79).format()}
            </Label>
          </div>
          <div className='flex items-center'>
            <input
              className='mr-1'
              type='radio'
              name='shipping'
              id='other'
              value='150'
              onChange={handleShippingChange}
            />
            <Label htmlFor='other' style={{ width: 'max-content' }}>
              Outside Manila - {PHP(150).format()}
            </Label>
          </div>

          <div className='flex justify-end mt-3'>
            Shipping Cost: {shipping ? (shipping == '0' ? 'FREE' : PHP(shipping).format()) : 'N/A'}
          </div>
        </div>

        <div className='py-4 border-solid border-b border-black'>
          <p className='mb-2 font-black'>Payment Method</p>
          <div className='flex items-center'>
            <input className='mr-1' type='radio' name='payment' id='gcash' value='gcash' />
            <Label htmlFor='gcash' style={{ width: 'max-content' }}>
              GCash
            </Label>
          </div>
          <div className='mb-2 text-xs pl-4'>
            <p>+63 916 288 9221</p>
            <p>Arna Monica B.</p>
          </div>
          <div className='flex items-center'>
            <input className='mr-1' type='radio' name='payment' id='bpi' value='bpi' />
            <Label htmlFor='bpi' style={{ width: 'max-content' }}>
              BPI
            </Label>
          </div>{' '}
          <div className='mb-2 text-xs pl-4'>
            <p>1519079875</p>
            <p>Arna Monica B.</p>
          </div>
        </div>

        <div className='mt-4 flex justify-between'>
          <p className='font-black text-lg'>Total</p>
          <p className='font-black text-lg'>
            {PHP(subtotal)
              .add(shipping || 0)
              .format()}
          </p>
        </div>

        <div className='mt-4 flex justify-end'>
          <input
            className='w-full sm:w-64 text-white bg-black py-2 uppercase text-sm rounded'
            type='button'
            value='Submit Order'
            disabled={loading}
            onClick={handleSubmit(onSubmit)}
          />
        </div>
      </div>
    </section>
  );
}
