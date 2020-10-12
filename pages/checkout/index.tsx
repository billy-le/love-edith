import { PropsWithChildren } from 'react';
import Header from '../../components/header';
import { appContext } from '../../context';

import { PHP } from '../../helpers/currency';
import currency from 'currency.js';

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

export default function CheckoutPage() {
  const { state } = appContext();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    e.persist();
    const form = e.target as HTMLFormElement;
    const names = Array.from(form.elements) as HTMLInputElement[];
    let formData: any = {};
    for (const name of names) {
      formData[name.name] = name.value;
      delete formData[''];
    }

    console.log(formData);
  }
  return (
    <div className='main flex flex-col'>
      <Header />
      <section className='p-10 grid grid-cols-2 gap-6'>
        <form className='grid grid-cols-1 sm:grid-cols-2 gap-2' onSubmit={handleSubmit}>
          <FormControl className='col-span-1 sm:col-span-2'>
            <Label htmlFor='name'>Name</Label>
            <Input id='name' name='name' type='text' required />
          </FormControl>

          <FormControl className='col-span-1 sm:col-span-2'>
            <Label htmlFor='contact'>Contact</Label>
            <Input id='contact' name='contact' type='number' inputMode='tel' required />
          </FormControl>

          <FormControl className='col-span-1 sm:col-span-2'>
            <Label htmlFor='email'>Email</Label>
            <Input id='email' name='email' type='email' inputMode='email' required />
          </FormControl>

          <h3 className='col-span-1 sm:col-span-2'>Address</h3>
          <FormControl>
            <Label htmlFor='apt'>House/Unit/Apt #</Label>
            <Input id='apt' name='apt' type='text' />
          </FormControl>
          <FormControl>
            <Label htmlFor='street'>Street</Label>
            <Input id='street' name='street' type='text' required />
          </FormControl>

          <FormControl>
            <Label htmlFor='city'>City</Label>
            <Input id='city' name='city' type='text' required />
          </FormControl>

          <FormControl>
            <Label htmlFor='barangay'>Barangay</Label>
            <Input id='barangay' name='barangay' type='text' />
          </FormControl>

          <FormControl>
            <Label htmlFor='region'>Region</Label>
            <Input id='region' name='region' type='text' />
          </FormControl>

          <FormControl>
            <Label htmlFor='landmarks'>Landmarks</Label>
            <Input id='landmarks' name='landmarks' type='text' />
          </FormControl>

          <FormControl className='col-span-1 sm:col-span-2 flex justify-end'>
            <button className='w-64 text-white bg-black py-1 uppercase text-sm' type='submit'>
              Confirm Order
            </button>
          </FormControl>
        </form>
        <div className='h-full bg-gray-200 rounded-sm p-5'>
          {state.cart.map((item, index) => (
            <div className='flex items-center justify-between mb-4' key={index}>
              <div className='flex items-center h-full'>
                <div
                  className='h-20 w-20 relative bg-cover bg-top rounded-sm mr-4'
                  style={{ backgroundImage: `url("/assets/${item.image}")` }}
                >
                  <div
                    className='absolute rounded-full h-4 w-4 flex items-center justify-center text-xs bg-gray-700 text-white'
                    style={{ top: -8, right: -8 }}
                  >
                    {item.qty}
                  </div>
                </div>
                <div>
                  <div className='text-gray-600 text-xs'>{item.description}</div>
                  <div>
                    <span>{item.name}</span>
                    {` / `}
                    <span>{item.size}</span>
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
