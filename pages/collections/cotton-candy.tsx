import React, { useState } from 'react';
import { appContext } from '../../context';
import { ACTION } from '../../context/context.actions';
import Header from '../../components/header';
import { App } from '../../context/context.interfaces';
import { PHP } from '../../helpers/currency';

const height = 560;

const images = {
  cotton: ['cotton-1.jpg', 'cotton-2.jpg', 'cotton-3.jpg', 'cotton-4.jpg'],
  candy: ['candy-1.jpg', 'candy-2.jpg'],
};

const additionalDetails = {
  description: [
    'Say hello to your new favorite coords!',
    'Style it with a pair of white sneakers or simply your best sandals and you can never go wrong with the The Cotton Candy.',
    'The Top is slightly larger with half sleeves and relaxed bodice for unrestricted movement. The Shorts are high waisted with an elastic band, side pockets and features a little slit at the sides to give you that fresh feeling.',
    'This set can be worn indoors and outdoors as you chill comfortably.',
  ],
  'model-fit': ['Model Wears', `Height: 5'2`, `Bust: 32"`, `Waist: 25"`, `Hip: 32"`],
  'fabric-care': [
    `60% Linen, 40% Cotton`,
    `Gentle Machine or Hand Wash`,
    'Wash Cold',
    'Do Not Bleach',
    'Hang to Dry',
    'Iron Medium',
  ],
};

export default function CottonCandyCollection() {
  const [color, setColor] = useState<keyof typeof images>('cotton');
  const [size, setSize] = useState('s');
  const [info, setInfo] = useState<keyof typeof additionalDetails>('description');
  const [currentImage, setCurrentImage] = useState<string>(images[color][0]);
  const {
    state: { isCartOpen },
    dispatch,
  } = appContext();

  function handleAdditionalDetailsChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value as keyof typeof additionalDetails;
    setInfo(value);
  }

  function handleColorChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value as keyof typeof images;
    setColor(value);
    setCurrentImage(images[value][0]);
    setInfo('description');
  }

  function handleSizeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const { value } = e.target;
    setSize(value);
  }

  function handleAddToCart() {
    const product: App.Product = {
      productId: 1,
      qty: 1,
      name: color,
      description: additionalDetails[info].join(' '),
      price: 999.0,
      image: images[color][0],
      size: size as App.Product['size'],
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

  return (
    <div className='main flex flex-col'>
      <Header />
      <main className='product h-full flex-grow flex justify-center mx-auto w-full p-10 relative'>
        <div className='flex'>
          <div className='mr-4'>
            {images[color].map((image, index) => {
              const isNotLast = index !== images[color].length - 1;
              return (
                <div
                  key={index}
                  className={`h-32 w-32 bg-cover ${isNotLast ? 'mb-4' : ''}`}
                  style={{ backgroundImage: `url("/assets/${image}")` }}
                  onClick={() => setCurrentImage(image)}
                ></div>
              );
            })}
          </div>
          <div
            className='mr-4 bg-cover bg-no-repeat'
            style={{ height, width: 500, backgroundImage: `url("/assets/${currentImage}")` }}
          ></div>
        </div>
        <form className='bg-gray-300 p-4' style={{ width: 500, height }} onSubmit={handleSubmit}>
          <h2 className='text-xl mb-1'>The Cotton Set</h2>
          <p className='text-xl mb-4'>P999.00</p>
          <div className='mb-4'>
            <label className='block mb-1'>
              Size | <span>size chart</span>
            </label>
            <select className='block' onChange={handleSizeChange} value={size}>
              <option value='s'>S</option>
              <option value='m'>M</option>
              <option value='l'>L</option>
            </select>
          </div>

          <div className='mb-4'>
            <label className='block mb-1'>Color</label>
            <select className='block' onChange={handleColorChange} value={color}>
              <option value='cotton'>The Cotton - Beige</option>
              <option value='candy'>The Candy - Pink</option>
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
            <label htmlFor='model-fit' className={`underline mr-4 ${info === 'model-fit' ? 'font-bold' : ''}`}>
              <input
                type='radio'
                name='additional-details'
                id='model-fit'
                value='model-fit'
                className='hidden'
                onChange={handleAdditionalDetailsChange}
              ></input>
              Model & Fit
            </label>
            <label htmlFor='fabric-care' className={`underline ${info === 'fabric-care' ? 'font-bold' : ''}`}>
              <input
                type='radio'
                name='additional-details'
                id='fabric-care'
                value='fabric-care'
                className='hidden'
                onChange={handleAdditionalDetailsChange}
              ></input>
              Fabric & Care
            </label>
          </div>
          {additionalDetails[info].map((text, index) => (
            <p key={index}>{text}</p>
          ))}
        </form>
      </main>
    </div>
  );
}
