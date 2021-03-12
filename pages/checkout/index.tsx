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

// components
import { Select } from '@components/select';
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

const SELECT_CITY_TEXT = 'Select a City';
const SELECT_PROVINCE_TEXT = 'Select a Province';
const SELECT_REGION_TEXT = 'Select a Region';

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

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const { name } = e.target;

    if ('selectedIndex' in e.target) {
      const index = e.target.selectedIndex;
      const { dataset } = e.target.options[index];
      const key = Object.values(dataset)[0];
      if (name === 'city') {
        const province = provinces.find((p) => p.key === key);
        const region = regions.find((r) => r.key === province?.region);

        setValue('province', province?.name ?? '');
        setValue('region', region?.long ?? '');

        clearErrors(['province', 'region']);
      } else if (name === 'province') {
        const region = regions.find((r) => r.key === key);

        setValue('city', SELECT_CITY_TEXT);
        setError('city', {});

        setValue('region', region?.long ?? '');
        clearErrors(['region']);
      } else if (name === 'region') {
        setValue('city', SELECT_CITY_TEXT);
        setValue('province', SELECT_PROVINCE_TEXT);

        setError('city', {});
        setError('province', {});
      }
    }
  }

  function handleShippingChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    setShipping(value);
  }

  const subtotal = state.cart.reduce((sum, item) => PHP(sum).add(PHP(item.price).multiply(item.qty)), PHP(0)).format();

  return (
    <section className='container mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6'>
      <form className={`grid grid-cols-1 sm:grid-cols-2 gap-2`}>
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
                  <IKImage className='h-20 rounded' src={item.image[0].url} />
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
          <p>Subtotal</p>
          <p>{state.cart.reduce((sum, item) => PHP(sum).add(PHP(item.price).multiply(item.qty)), PHP(0)).format()}</p>
        </div>

        <div className='py-4 border-solid border-b border-black'>
          <p className='mb-2'>Shipping Method</p>

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
              Pick-up / Book Your Own Courier
            </Label>
          </div>
          <div className='flex items-center'>
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

          <div className='flex justify-end mt-3'>Shipping Cost: {shipping ? PHP(shipping).format() : 'N/A'}</div>
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
