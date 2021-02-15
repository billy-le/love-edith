import React from 'react';

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

  async function onSubmit() {
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

  return (
    <section className='p-10 grid grid-cols-2 gap-6'>
      <form className={`grid grid-cols-1 sm:grid-cols-2 gap-2`} onSubmit={handleSubmit(onSubmit)}>
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

        <h3 className='col-span-1 sm:col-span-2'>Address</h3>
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
          <Select
            ref={register({
              required: true,
              validate: (value) => {
                if (value === SELECT_CITY_TEXT) return false;
                else return true;
              },
            })}
            name='city'
            id='city'
            onChange={handleChange}
            error={errors.city}
          >
            <option>Select a City</option>
            {cities
              .sort((a, b) => `${a.name} - ${a.province}`.localeCompare(`${b.name} - ${b.province}`))
              .map((city, index) => (
                <option key={index} value={`${city.name} - ${city.province}`} data-key={city.province}>
                  {city.name} - {city.province}
                </option>
              ))}
          </Select>
        </FormControl>

        <FormControl>
          <Label htmlFor='province'>Province</Label>
          <Select
            ref={register({
              required: true,
              validate: (value) => {
                if (value === SELECT_PROVINCE_TEXT) return false;
                else return true;
              },
            })}
            id='province'
            name='province'
            onChange={handleChange}
            error={errors.province}
          >
            <option>Select a Province</option>
            {provinces
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((province) => (
                <option key={province.key} value={province.name} data-key={province.region}>
                  {province.name}
                </option>
              ))}
          </Select>
        </FormControl>

        <FormControl>
          <Label htmlFor='region'>Region</Label>
          <Select
            ref={register({
              required: true,
              validate: (value) => {
                if (value === SELECT_REGION_TEXT) return false;
                else return true;
              },
            })}
            id='region'
            name='region'
            onChange={handleChange}
            error={errors.region}
          >
            <option>Select a Region</option>
            {regions
              .sort((a, b) => a.long.localeCompare(b.long))
              .map((region) => (
                <option key={region.key} value={region.long}>
                  {region.long}
                </option>
              ))}
          </Select>
        </FormControl>

        <FormControl className='col-span-1 sm:col-span-2'>
          <Label htmlFor='landmarks'>Landmarks</Label>
          <TextArea ref={register} id='landmarks' name='landmarks' rows={3} />
        </FormControl>

        <FormControl className='col-span-1 sm:col-span-2 flex justify-end'>
          <input
            className='w-64 text-white bg-black py-2 uppercase text-sm'
            type='submit'
            value='Submit Order'
            disabled={loading}
          />
        </FormControl>
      </form>
      <div className='h-full bg-gray-200 rounded-sm p-5'>
        {state.cart.map((item, index) => (
          <div className='flex items-center justify-between mb-4' key={index}>
            <div className='flex items-center h-full'>
              <div
                className='h-20 w-20 relative bg-cover bg-top rounded-sm mr-4'
                style={{ backgroundImage: `url("${item.image[0].url}")` }}
              >
                <div
                  className='absolute rounded-full h-4 w-4 flex items-center justify-center text-xs bg-gray-700 text-white'
                  style={{ top: -8, right: -8 }}
                >
                  {item.qty}
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
      </div>
    </section>
  );
}
