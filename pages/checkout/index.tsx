import React from 'react';
import { PropsWithChildren } from 'react';
import Header from '@components/header';
import { PHP } from '@helpers/currency';
import regions from 'philippines/regions.json';
import cities from 'philippines/cities.json';
import provinces from 'philippines/provinces.json';
import { useAppContext } from '@hooks/useAppContext';
import { gql } from '@apollo/client';

function FormControl({ children, ...props }: PropsWithChildren<React.HTMLProps<HTMLDivElement>>) {
  return <div {...props}>{children}</div>;
}

function Label({ children, ...props }: Omit<PropsWithChildren<React.HTMLProps<HTMLLabelElement>>, 'className'>) {
  return (
    <label className='block mb-1' {...props}>
      {children}
    </label>
  );
}

function Input(props: Omit<React.HTMLProps<HTMLInputElement>, 'className'>) {
  return <input className='block py-1 px-2 border-black border-solid border-2 rounded-sm w-full' {...props} />;
}

function TextArea({ className = '', ...props }: React.HTMLProps<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`block py-1 px-2 border-black border-solid border-2 rounded-sm w-full ${className}`}
      {...props}
    />
  );
}

function Select(props: Omit<React.HTMLProps<HTMLSelectElement>, 'className'>) {
  return (
    <select className='py-1 px-2 border-black border-solid border-2 rounded-sm w-full' {...props}>
      {props.children}
    </select>
  );
}

export default function CheckoutPage() {
  const { state, dispatch } = useAppContext();
  const [formState, setFormState] = React.useState<any>({});

  React.useEffect(() => {
    // TODO - remove any items that is over stock count
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(state);
    // TODO - Submit order
  };

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void;
  function handleChange(e: React.ChangeEvent<HTMLSelectElement>): void;
  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>): void;
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;

    let state: any = {
      ...formState,
      [name]: value,
    };

    if ('selectedIndex' in e.target) {
      const index = e.target.selectedIndex;
      const { dataset } = e.target.options[index];
      const key = Object.values(dataset)[0];
      if (name === 'city') {
        const province = provinces.find((p) => p.key === key);
        const region = regions.find((r) => r.key === province?.region);
        state['province'] = province?.name ?? '';
        state['region'] = region?.long ?? '';
      } else if (name === 'province') {
        const region = regions.find((r) => r.key === key);
        state['city'] = '';
        state['region'] = region?.long ?? '';
      } else if (name === 'region') {
        state['city'] = '';
        state['province'] = '';
      }
    }

    setFormState(state);
  }

  return (
    <div className='main flex flex-col'>
      <Header />
      <section className='p-10 grid grid-cols-2 gap-6'>
        <form className='grid grid-cols-1 sm:grid-cols-2 gap-2' onSubmit={handleSubmit}>
          <FormControl className='col-span-1 sm:col-span-2'>
            <Label htmlFor='name'>Name</Label>
            <Input id='name' name='name' type='text' required onChange={handleChange} value={formState['name'] ?? ''} />
          </FormControl>

          <FormControl className='col-span-1 sm:col-span-2'>
            <Label htmlFor='contact'>Contact Number</Label>
            <Input
              id='contact'
              name='contact'
              type='number'
              inputMode='tel'
              required
              onChange={handleChange}
              value={formState['contact'] ?? ''}
            />
          </FormControl>

          <FormControl className='col-span-1 sm:col-span-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              name='email'
              type='email'
              inputMode='email'
              required
              onChange={handleChange}
              value={formState['email'] ?? ''}
            />
          </FormControl>

          <h3 className='col-span-1 sm:col-span-2'>Address</h3>
          <FormControl>
            <Label htmlFor='building'>Unit Number / House / Building</Label>
            <Input
              id='building'
              name='building'
              type='text'
              onChange={handleChange}
              value={formState['building'] ?? ''}
            />
          </FormControl>
          <FormControl>
            <Label htmlFor='street'>Street</Label>
            <Input
              id='street'
              name='street'
              type='text'
              required
              onChange={handleChange}
              value={formState['street'] ?? ''}
            />
          </FormControl>

          <FormControl>
            <Label htmlFor='barangay'>Barangay</Label>
            <Input
              id='barangay'
              name='barangay'
              type='text'
              onChange={handleChange}
              value={formState['barangay'] ?? ''}
            />
          </FormControl>

          <FormControl>
            <Label htmlFor='city'>City</Label>
            <Select name='city' id='city' onChange={handleChange} value={formState['city'] ?? ''}>
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
            <Select id='province' name='province' onChange={handleChange} value={formState['province'] ?? ''}>
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
            <Select id='region' name='region' onChange={handleChange} value={formState['region'] ?? ''}>
              <option>Select a Region</option>S
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
            <TextArea
              id='landmarks'
              name='landmarks'
              rows={3}
              onChange={handleChange}
              value={formState['landmarks'] ?? ''}
            />
          </FormControl>

          <FormControl className='col-span-1 sm:col-span-2 flex justify-end'>
            <input
              className='w-64 text-white bg-black py-2 uppercase text-sm'
              type='submit'
              value='Submit Order'
            ></input>
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
    </div>
  );
}
