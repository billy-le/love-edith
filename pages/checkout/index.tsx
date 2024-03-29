import { useState, useMemo } from 'react';

// libs
import { PHP } from '@helpers/currency';
import regions from 'philippines/regions.json';
import cities from 'philippines/cities.json';
import provinces from 'philippines/provinces.json';
import { useForm } from 'react-hook-form';
import { useAppContext } from '@hooks/useAppContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// components
import { Input } from '@components/input';
import { Label } from '@components/label';
import { FormControl } from '@components/form-control';
import { TextArea } from '@components/text-area';
import { IKImage } from 'imagekitio-react';
import { useEffect } from 'react';
import { MainLayout } from '@layouts/main';

const phoneRegExp = /9\d{9}/;

const invoiceSchema = yup.object().shape({
  first_name: yup.string().required('A first name is required'),
  last_name: yup.string().required('A last name is required'),
  contact: yup.string().required('A contact number is required').matches(phoneRegExp, 'Mobile number is invalid'),
  email: yup.string().email().required('An email is required'),
  'social_media': yup.string(),
  'social_media_account': yup.string(),
  building: yup.string().required('A building identifier is required'),
  street: yup.string().required('A street is required'),
  barangay: yup.string().required('A barangay is required'),
  city: yup.string().required('A city is required'),
  region: yup.string().required('A region is required'),
  province: yup.string().required('A province is required'),
  shipping: yup.string().nullable().required('A shipping method is required'),
  payment: yup.string().nullable().required('A payment is required'),
});

export default function CheckoutPage() {
  const { state, dispatch } = useAppContext();
  const { push, query } = useRouter();
  const { register, handleSubmit, getValues, errors, watch, reset, setValue } = useForm({
    resolver: yupResolver(invoiceSchema),
  });
  const [isFreeShipping, setIsFreeShipping] = useState(false);
  const [percentDiscount, setPercentDiscount] = useState(0);
  const [amountDiscount, setAmountDiscount] = useState(0);

  useEffect(() => {
    if (Object.keys(query).length) {
      reset(query);
    }
  }, [query]);

  const subtotal = useMemo(
    () => state.cart.reduce((sum, item) => PHP(sum).add(PHP(item.price).multiply(item.qty)), PHP(0)),
    [state.cart]
  );

  const total = useMemo(
    () =>
      PHP(subtotal)
        .subtract(PHP(amountDiscount))
        .subtract(PHP(subtotal).multiply(`0.${percentDiscount}`)),
    [subtotal, amountDiscount, percentDiscount]
  );

  useEffect(() => {
    if (state.cart.find((item) => item.hasFreeShipping)) {
      dispatch({
        type: 'SET_SHIPPING_COST',
        payload: '0',
      });
      setValue('shipping', '0');
      setIsFreeShipping(true);
    } else if (state.promo) {
      const { is_free_shipping, free_shipping_threshold } = state.promo;
      if (is_free_shipping && total.value >= free_shipping_threshold) {
        dispatch({
          type: 'SET_SHIPPING_COST',
          payload: '0',
        });
        setValue('shipping', '0');
        setIsFreeShipping(true);
      } else {
        dispatch({
          type: 'SET_SHIPPING_COST',
          payload: null,
        });
        setIsFreeShipping(false);
      }
    } else {
      setIsFreeShipping(false);
    }
  }, [state.promo, state.cart, total]);

  useEffect(() => {
    if (state.promo) {
      const { amount, percent_discount, amount_threshold, percent_discount_threshold } = state.promo;
      if (subtotal.value >= amount_threshold) {
        setAmountDiscount(amount);
      } else {
        setAmountDiscount(0);
      }
      if (subtotal.value >= percent_discount_threshold) {
        setPercentDiscount(percent_discount);
      } else {
        setPercentDiscount(0);
      }
    } else {
      setAmountDiscount(0);
      setPercentDiscount(0);
    }
  }, [state.promo, state.cart]);

  const shipping = watch('shipping') as string | null;

  async function onSubmit() {
    let {
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
      shipping,
      social_media,
      social_media_account
    } = getValues();

    const shippingMethod = isFreeShipping
      ? 'FREE'
      : shipping == '0'
      ? 'Pick-up at HQ / Book Your Own Courier'
      : shipping === '79'
      ? 'Metro Manila'
      : 'Outside Metro Manila';
    shipping = isFreeShipping ? '0' : shipping;
    push({
      pathname: '/summary',
      query: {
        email,
        first_name,
        last_name,
        contact,
        building,
        street,
        barangay,
        city,
        province,
        region,
        landmarks,
        payment,
        shipping,
        shipping_method: shippingMethod,
        social_media,
        social_media_account
      },
    });
  }

  function handleShipping(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    if (isFreeShipping) {
      dispatch({
        type: 'SET_SHIPPING_COST',
        payload: '0',
      });
    } else {
      dispatch({
        type: 'SET_SHIPPING_COST',
        payload: value as typeof state['shippingCost'],
      });
    }
  }

  if (state.cart.length === 0) {
    return (
      <MainLayout title='Checkout'>
        <div className='justify-center flex-grow pt-40'>
          <div className='max-w-2xl mx-auto'>
            <h2 className='mb-8 text-3xl font-black sm:text-5xl'>
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
      </MainLayout>
    );
  }

  return (
    <MainLayout title='Checkout'>
      <section className='container grid grid-cols-1 gap-6 mx-auto sm:grid-cols-2'>
        <form className='grid grid-cols-1 gap-4 sm:grid-cols-2' style={{ height: 'fit-content' }}>
          <FormControl className='col-span-1'>
            <Label htmlFor='first_name'>First Name</Label>
            <Input ref={register} id='first_name' name='first_name' type='text' error={errors.first_name} />
          </FormControl>

          <FormControl className='col-span-1'>
            <Label htmlFor='last_name'>Last Name</Label>
            <Input ref={register} id='last_name' name='last_name' type='text' error={errors.last_name} />
          </FormControl>

          <FormControl className='col-span-1 sm:col-span-2'>
            <Label htmlFor='contact'>Mobile Number</Label>
            <div className='relative'>
              <Input
                ref={register}
                className='pl-10'
                id='contact'
                name='contact'
                type='tel'
                inputMode='tel'
                error={errors.contact}
              />
              <span className='absolute inset-y-0 flex items-center left-2'>+63</span>
            </div>
          </FormControl>

          <FormControl className='col-span-1 sm:col-span-2'>
            <Label htmlFor='email'>Email</Label>
            <Input ref={register} id='email' name='email' type='email' inputMode='email' error={errors.email} />
          </FormControl>

          <FormControl className='col-span-1 sm:col-span-2'>
            <Label htmlFor='social_media_account'>Social Media</Label>
            <div className="flex">
              <select ref={register} id="social_media" name='social_media' defaultValue="instagram" className="rounded-l-sm border-r-0 border-black py-1 pl-2">
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
              </select>
              <input ref={register}  id="social_media_account" name="social_media_account" className="rounded-r-sm border-black w-full py-1 px-2 placeholder-gray-400" type="text" placeholder="i.e. @loveedith.ph"/>
            </div>
           
          </FormControl>

          <h3 className='col-span-1 mt-4 sm:col-span-2'>Shipping Address</h3>
          <FormControl>
            <Label htmlFor='building' className='truncate'>
              Unit Number / House / Building
            </Label>
            <Input ref={register} id='building' name='building' type='text' error={errors.building} />
          </FormControl>
          <FormControl>
            <Label htmlFor='street'>Street</Label>
            <Input ref={register} id='street' name='street' type='text' error={errors.street} />
          </FormControl>

          <FormControl>
            <Label htmlFor='barangay'>Barangay</Label>
            <Input ref={register} id='barangay' name='barangay' type='text' error={errors.barangay} />
          </FormControl>

          <FormControl>
            <Label htmlFor='city'>City</Label>
            <Input list='cities' id='city' name='city' type='text' ref={register} error={errors.city} />

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
            <Input list='provinces' id='province' name='province' ref={register} error={errors.province} />

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
            <Input list='regions' id='region' name='region' ref={register} error={errors.region} />

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

          <FormControl className='flex justify-end col-span-1 sm:col-span-2'></FormControl>
        </form>

        <div className='flex flex-col p-4 bg-gray-100 rounded shadow-md'>
          {state.cart.map((item, index) => (
            <div className='flex items-center justify-between mb-4' key={index}>
              <div className='flex items-center h-full'>
                <div className='relative mr-4'>
                  <picture>
                    {item.image.map((format, index) => (
                      <source key={index} srcSet={`${format.url} ${format.width}w`} />
                    ))}
                    <IKImage className='flex-shrink-0 h-16 rounded' src={item.image[0].url} />
                  </picture>
                  <div
                    className='absolute flex items-center justify-center w-4 h-4 text-xs text-white bg-gray-900 rounded-full shadow cursor-default'
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
                    {` | `}
                    <span className='uppercase'>{item.color}</span>
                    {item.isPreorder && (
                      <>
                        {` | `}
                        <span>Pre-Order</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div>{PHP(item.price).multiply(item.qty).format()}</div>
            </div>
          ))}

          <div className='flex justify-between py-4 border-t border-b border-black border-solid'>
            <p className='font-black'>Subtotal</p>
            <p>{subtotal.format()}</p>
          </div>

          <div className='py-4 border-b border-black border-solid'>
            <p className='mb-2 font-black'>Shipping Method</p>
            {errors.shipping && <p className='text-xs text-red-400'>{errors.shipping.message}</p>}

            <div className='flex items-center'>
              <input
                ref={register}
                className='mr-1'
                type='radio'
                name='shipping'
                id='pick-up'
                value='0'
                onChange={handleShipping}
              />
              <Label htmlFor='pick-up' style={{ width: 'max-content' }}>
                Pick-up at HQ / Book Your Own Courier
              </Label>
            </div>
            <div className='pl-4 mb-2 text-xs'>
              <p>Eastwood - Quezon City</p>
              <p>1pm - 5pm</p>
            </div>
            <div className='flex items-center mb-2'>
              <input
                ref={register}
                className='mr-1'
                type='radio'
                name='shipping'
                id='manila'
                value='79'
                onChange={handleShipping}
              />
              <Label htmlFor='manila' style={{ width: 'max-content' }}>
                Metro Manila - {PHP(79).format()}
              </Label>
            </div>
            <div className='flex items-center'>
              <input
                ref={register}
                className='mr-1'
                type='radio'
                name='shipping'
                id='other'
                value='150'
                onChange={handleShipping}
              />
              <Label htmlFor='other' style={{ width: 'max-content' }}>
                Outside Manila - {PHP(150).format()}
              </Label>
            </div>

            <div className='flex justify-end mt-3'>
              Shipping Cost:{' '}
              {isFreeShipping ? 'FREE' : shipping ? (shipping == '0' ? 'FREE' : PHP(shipping).format()) : 'N/A'}
            </div>
          </div>

          <div className='py-4 border-b border-black border-solid'>
            <p className='mb-2 font-black'>Payment Method</p>
            {errors.payment && <p className='text-xs text-red-400'>{errors.payment.message}</p>}

            <div className='flex items-center'>
              <input ref={register} className='mr-1' type='radio' name='payment' id='gcash' value='gcash' />
              <Label htmlFor='gcash' style={{ width: 'max-content' }}>
                GCash
              </Label>
            </div>

            <div className='flex items-center'>
              <input ref={register} className='mr-1' type='radio' name='payment' id='bpi' value='bpi' />
              <Label htmlFor='bpi' style={{ width: 'max-content' }}>
                BPI
              </Label>
            </div>
          </div>

          {amountDiscount > 0 && (
            <div className='flex justify-between mt-4'>
              <p className='text-lg font-black'>Discount - {PHP(amountDiscount).format()} off</p>
              <p className='text-lg font-black'>-{PHP(amountDiscount).format()}</p>
            </div>
          )}

          {percentDiscount > 0 && (
            <div className='flex justify-between mt-4'>
              <p className='text-lg font-black'>Discount - {percentDiscount}% off</p>
              <p className='text-lg font-black'>-{PHP(subtotal).multiply(`0.${percentDiscount}`).format()}</p>
            </div>
          )}

          <div className='flex justify-between mt-4'>
            <p className='text-lg font-black'>Total</p>
            <p className='text-lg font-black'>{total.add(PHP(state.shippingCost || 0)).format()}</p>
          </div>

          <div className='flex justify-end mt-4'>
            <input
              className='w-full py-2 text-sm text-white uppercase bg-black rounded sm:w-64'
              type='button'
              value='Continue'
              onClick={handleSubmit(onSubmit)}
            />
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
