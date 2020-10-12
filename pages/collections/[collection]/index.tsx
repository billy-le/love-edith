import React, { useMemo, useState } from 'react';
import { useRouter, NextRouter } from 'next/router';
import Link from 'next/link';

import { appContext } from '../../../context';
import { ACTION } from '../../../context/context.actions';
import Header from '../../../components/header';

import { App } from '../../../context/context.interfaces';
import inventory, { colorType } from '../../../inventory';

export default function CottonCandyCollection() {
  const {
    query: { productId, item },
  }: NextRouter = useRouter();

  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [currentSize, setCurrentSize] = useState<string>('');
  const [currentColor, setCurrentColor] = useState<string>('');
  const [currentImage, setCurrentImage] = useState<string>('');
  const [additionalDetails, setAdditionDetails] = useState<any>({});
  const [info, setInfo] = useState<keyof typeof additionalDetails>('description');

  const {
    state: { isCartOpen },
    dispatch,
  } = appContext();

  const collection = useMemo(() => {
    const items = inventory.find((product) => product.productId.toString() === productId);
    if (!items) {
      return null;
    }
    const colors = Object.keys(items.colors);
    const selectedColor = colors.find((color) => color === item) as colorType;
    setColors(colors);
    setSizes(items.sizes.map((s) => s.toUpperCase()));

    setCurrentImage(items.colors[item as colorType][0]);
    setCurrentColor(selectedColor || colors[0]);
    setCurrentSize(items.sizes[0].toUpperCase());
    setAdditionDetails({
      description: items.description,
      model: items.model,
      'care-instructions': items['care-instructions'],
    });

    return items;
  }, [productId]);

  function handleAdditionalDetailsChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value as keyof typeof additionalDetails;
    setInfo(value);
  }

  function handleColorChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    setCurrentColor(value);
    if (collection) {
      setCurrentImage(collection?.colors[value as colorType]?.[0]);
    }
    setInfo('description');
  }

  function handleSizeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const { value } = e.target;
    setCurrentSize(value);
  }

  function handleAddToCart() {
    const product: App.Product = {
      productId: parseInt(productId as string, 10),
      qty: 1,
      name: currentColor,
      description: collection?.name || '',
      price: parseInt(collection?.price || '0'),
      image: collection?.colors?.[currentColor as colorType][0] || '',
      size: currentSize as App.Product['size'],
    };

    dispatch({ type: ACTION.ADD_TO_CART, payload: { product } });

    if (!isCartOpen) {
      dispatch({
        type: ACTION.TOGGLE_CART,
        payload: {
          isCartOpen: true,
        },
      });
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
  }

  function render(component: JSX.Element) {
    return (
      <div className='main flex flex-col'>
        <Header />
        {component}
      </div>
    );
  }

  if (!collection) {
    return render(
      <main className='h-full flex flex-grow justify-center items-center'>
        <div>
          <div className='text-6xl text-center '>404</div>
          <span className='text-gray-600'>Ooops! Sorry, this page doesn't exist. Are you looking for our </span>
          <Link href='/shop'>
            <a className='hover:underline'>collections page?</a>
          </Link>
        </div>
      </main>
    );
  }

  return render(
    <main className='product h-full flex-grow grid grid-cols-2 gap-4 w-full p-10 relative'>
      <div className='flex'>
        <div className='mr-4'>
          {collection.colors[currentColor as colorType]?.map((image, index) => {
            const isNotLast = index !== collection.colors[currentColor as colorType].length - 1;
            return (
              <div
                key={index}
                className={`h-32 w-32 bg-cover ${isNotLast ? 'mb-4' : ''}`}
                style={{ backgroundImage: `url("/assets/${image}")` }}
                onMouseEnter={() => setCurrentImage(image)}
              ></div>
            );
          })}
        </div>
        <div
          className='bg-cover bg-no-repeat w-full'
          style={{ backgroundImage: `url("/assets/${currentImage}")` }}
        ></div>
      </div>
      <form className='bg-gray-300 w-full p-4' onSubmit={handleSubmit}>
        <h2 className='text-xl mb-1'>{collection.name}</h2>
        <p className='text-xl mb-4'>P{collection.price}</p>
        <div className='mb-4'>
          <label className='block mb-1'>
            Size | <span>size chart</span>
          </label>
          <select className='block' onChange={handleSizeChange} value={currentSize || ''}>
            {sizes.map((size) => (
              <option key={size} value={size.toUpperCase()} className='uppercase'>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className='mb-4'>
          <label className='block mb-1'>Color</label>
          <select className='block' onChange={handleColorChange} value={currentColor}>
            {colors.map((color) => (
              <option key={color} className='capitalize' value={color}>
                {color}
              </option>
            ))}
          </select>
        </div>

        <div className='mb-4'>
          <button className='bg-black text-white py-2 uppercase w-40' onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>

        <div className='mb-4'>
          <label htmlFor='description' className={`underline mr-4 ${info === 'description' ? 'font-bold' : ''}`}>
            <input
              type='radio'
              name='additional-details'
              id='description'
              value='description'
              className='hidden'
              onChange={handleAdditionalDetailsChange}
            ></input>
            Description
          </label>
          <label htmlFor='model' className={`underline mr-4 ${info === 'model' ? 'font-bold' : ''}`}>
            <input
              type='radio'
              name='additional-details'
              id='model'
              value='model'
              className='hidden'
              onChange={handleAdditionalDetailsChange}
            ></input>
            Model & Fit
          </label>
          <label htmlFor='care-instructions' className={`underline ${info === 'care-instructions' ? 'font-bold' : ''}`}>
            <input
              type='radio'
              name='additional-details'
              id='care-instructions'
              value='care-instructions'
              className='hidden'
              onChange={handleAdditionalDetailsChange}
            ></input>
            Fabric & Care
          </label>
        </div>
        <div dangerouslySetInnerHTML={{ __html: additionalDetails[info] }}></div>
      </form>
    </main>
  );
}
