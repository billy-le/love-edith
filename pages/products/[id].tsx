import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { IKImage } from 'imagekitio-react';
import { PHP } from '@helpers/currency';
import { useAppContext } from '@hooks/useAppContext';
import marked from 'marked';
import Spinner from '@components/spinner';

import { useRouter } from 'next/router';

const TABS = ['description', 'model & fit', 'fabric & care'];
const NA = 'Not Available';

const PRODUCT_QUERY = gql`
  query Product($id: ID!) {
    product(id: $id) {
      id
      name
      slug
      price
      variants {
        id
        size {
          name
        }
        color {
          name
        }
        qty
      }
      description
      size_chart
      model_and_fit
      fabric_and_care
      product_images {
        images {
          url
          formats
        }
      }
    }
  }
`;

export default function Product() {
  const { query } = useRouter();
  const {
    state: { cart },
    dispatch,
  } = useAppContext();

  const [selectedSize, setSelectedSize] = React.useState<string>('');
  const [selectedColor, setSelectedColor] = React.useState<string>('');
  const [isSizeChartOpen, setIsSizeChartOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<string>('description');
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);

  const { error, loading, data } = useQuery(PRODUCT_QUERY, {
    variables: {
      id: query.id,
    },
  });

  const sizes = React.useMemo(() => {
    const map = new Map<string, number[]>();
    if (!data?.product?.variants) {
      return [];
    }

    data.product.variants.forEach((v: any) => {
      const size = map.get(v.size.name);
      if (size) {
        map.set(v.size.name, size.concat(v.qty));
      } else {
        map.set(v.size.name, [v.qty]);
      }
    });
    const entries = Object.fromEntries(map);
    const sizes: { name: string; isSoldOut: boolean }[] = [];
    for (const size in entries) {
      sizes.push({ name: size, isSoldOut: entries[size].every((qty) => qty === 0) });
    }

    const firstSizeNotSoldOut = sizes.find((size) => !size.isSoldOut);
    setSelectedSize(firstSizeNotSoldOut?.name ?? '');

    return sizes;
  }, [data]);

  const colors = React.useMemo(() => {
    const map = new Map<string, number[]>();
    if (!data?.product?.variants) {
      return [];
    }

    data.product.variants.forEach((v: any) => {
      if (v.size.name === selectedSize) {
        const color = map.get(v.color.name);
        if (color) {
          map.set(v.color.name, color.concat(v.qty));
        } else {
          map.set(v.color.name, [v.qty]);
        }
      }
    });
    const entries = Object.fromEntries(map);
    const colors: { name: string; isSoldOut: boolean }[] = [];
    for (const color in entries) {
      colors.push({ name: color, isSoldOut: entries[color].every((qty) => qty === 0) });
    }

    const firstColorNotSoldOut = colors.find((color) => !color.isSoldOut);
    setSelectedColor(firstColorNotSoldOut?.name ?? '');

    return colors;
  }, [selectedSize]);

  if (error) {
    return null;
  }

  if (loading) {
    return <Spinner />;
  }

  if (!data) {
    return null;
  }

  const {
    product: { id, name, price, size_chart, model_and_fit, fabric_and_care, description, product_images, variants },
  } = data;

  const images = product_images.flatMap((productImage: any) => productImage.images);

  function toggleSizeChart() {
    setIsSizeChartOpen(!isSizeChartOpen);
  }

  function handleSizeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const { value } = e.target;
    if (value === selectedSize) return;
    setSelectedSize(value);
  }

  function handleColorChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const { value } = e.target;
    if (value === selectedColor) return;
    setSelectedColor(value);
  }

  function handleTabChange(tab: string) {
    return (e: React.MouseEvent) => {
      if (tab === activeTab) return;
      setActiveTab(tab);
    };
  }

  function handleImageClick(index: number) {
    return (e: React.MouseEvent) => {
      setSelectedImageIndex(index);
    };
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const variant = variants.find((v: any) => v.size.name === selectedSize && v.color.name === selectedColor);
    if (cart.length) {
      const hasItemInCart = cart.find((item) => item.variantId === variant.id);

      if (hasItemInCart) return;
    }
    dispatch({
      type: 'INCREMENT_ITEM',
      payload: {
        productId: id,
        variantId: variant.id,
        image: Object.values(images[selectedImageIndex].formats),
        name,
        price,
        qty: 1,
        size: selectedSize as any,
      },
    });
  }

  return (
    <div className='container mx-auto grid grid-cols-5 gap-4'>
      <div className='grid grid-cols-4 col-span-2 gap-2'>
        <div
          className='col-span-1 flex flex-col gap-2 overflow-y-auto'
          style={{
            maxHeight: '60vh',
          }}
        >
          {images.map((image: any, index: number) => {
            const formats: any[] = Object.values(image.formats);
            return (
              <React.Fragment key={index}>
                <picture onClick={handleImageClick(index)}>
                  {formats.map((format: any, index: number) => (
                    <source key={index} srcSet={`${format.url} ${format.width}w`} />
                  ))}
                  <IKImage className='rounded' src={image.url} />
                </picture>
              </React.Fragment>
            );
          })}
        </div>
        <div className='col-span-3'>
          <picture>
            {Object.values(images[selectedImageIndex].formats).map((format: any, index: number) => (
              <source key={index} srcSet={`${format.url} ${format.width}w`} />
            ))}
            <IKImage className='rounded' src={images[selectedImageIndex].url} />
          </picture>
        </div>
      </div>

      <div
        className='grid grid-cols-3 gap-2 col-span-3 lg:col-span-3 bg-gray-100 p-4 rounded shadow-md'
        style={{
          height: 'fit-content',
        }}
      >
        <form className='col-span-1' onSubmit={handleSubmit}>
          <div className='flex flex-row flex-wrap gap-2 lg:block justify-between items-center mb-4 lg:mb-0'>
            <h2 className='text-2xl text-gray-800 mb-0 lg:mb-3'>{name}</h2>

            <p className='text-xl mb-0 lg:mb-3'>{PHP(price).format()}</p>

            <fieldset className='mb-0 lg:mb-3 flex lg:block gap-2'>
              <label htmlFor='size' className='mb-0 lg:mb-1 flex items-center'>
                Size
                {size_chart && (
                  <>
                    |
                    <span
                      className='ml-1 cursor-pointer block relative text-gray-600 text-xs'
                      onClick={toggleSizeChart}
                    >
                      size chart
                      <div
                        className='absolute top-0 right-0'
                        dangerouslySetInnerHTML={{ __html: marked(size_chart) }}
                      />
                    </span>
                  </>
                )}
              </label>
              <select
                id='size'
                name='size'
                className='rounded border-2 border-solid border-black w-full  py-1 px-2 uppercase'
                onChange={handleSizeChange}
                value={selectedSize}
              >
                {sizes.map((size: any) => (
                  <option key={size.name} value={size.name} disabled={size.isSoldOut} className='uppercase'>
                    {`${size.name}${size.isSoldOut ? ' - sold out' : ''}`}
                  </option>
                ))}
              </select>
            </fieldset>

            <fieldset className='flex lg:block gap-2 mb-0 lg:mb-3'>
              <label htmlFor='color' className='flex items-center mb-0 lg:mb-1'>
                Color
              </label>
              <select
                id='color'
                name='color'
                className='rounded border-2 border-solid border-black w-full py-1 px-2 capitalize'
                onChange={handleColorChange}
                value={selectedColor}
              >
                {colors.map((color: any) => (
                  <option key={color.name} value={color.name} disabled={color.isSoldOut} className='capitalize'>
                    {`${color.name}${color.isSoldOut ? ' - sold out' : ''}`}
                  </option>
                ))}
              </select>
            </fieldset>

            <fieldset className='mb-0'>
              <button className='rounded py-2 px-3 w-full bg-gray-900 text-white' type='submit'>
                Add to Cart
              </button>
              <p className='mt-3 text-xs text-gray-700'>
                * Due to limited stock, we can only allow adding one item per size per cart.
              </p>
            </fieldset>
          </div>
        </form>
        <div className='col-span-2'>
          <div className='flex gap-4 mb-6'>
            {TABS.map((tab) => (
              <label
                key={tab}
                className={`capitalize cursor-pointer hover:underline ${
                  activeTab === tab ? 'underline font-black' : ''
                }`}
                onClick={handleTabChange(tab)}
              >
                {tab}
              </label>
            ))}
          </div>
          <div
            dangerouslySetInnerHTML={{
              __html: marked(
                activeTab === 'description'
                  ? description || NA
                  : activeTab === 'model & fit'
                  ? model_and_fit || NA
                  : fabric_and_care || NA
              ),
            }}
          />
        </div>
      </div>
    </div>
  );
}
