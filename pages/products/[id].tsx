import React from 'react';

// helpers
import { gql, useQuery } from '@apollo/client';
import { PHP, roundUp } from '@helpers/currency';
import { useAppContext } from '@hooks/useAppContext';
import { useRouter } from 'next/router';
import marked from 'marked';
import { getDiscount } from '@helpers/getDiscount';

// components
import { IKImage } from 'imagekitio-react';
import Spinner from '@components/spinner';
import { toast } from 'react-toastify';
import { Icon } from '@components/icon';

// interfaces
import { Product } from 'types/models';
import { MainLayout } from '@layouts/main';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

const TABS = ['description', 'size guide', 'fabric & care'];
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
      fabric_and_care
      product_images {
        images {
          url
          formats
        }
      }
      discounts {
        id
        percent_discount
        amount
        expiration_date
        is_free_shipping
      }
      is_preorder
    }
  }
`;

marked.setOptions({
  breaks: true,
});

export default function ProductPage() {
  const { query } = useRouter();

  const { id: paramId } = query;
  const { dispatch } = useAppContext();

  const [selectedSize, setSelectedSize] = React.useState('');
  const [selectedColor, setSelectedColor] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('description');

  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const totalImages = React.useRef(0);

  const { error, loading, data } = useQuery<{ product: Product }>(PRODUCT_QUERY, {
    variables: {
      id: paramId,
    },
  });

  const colors = React.useMemo(() => {
    const map = new Map<string, number[]>();
    if (!data?.product?.variants) {
      return [];
    }

    data.product.variants.forEach((v) => {
      const color = map.get(v.color.name);
      if (color) {
        map.set(v.color.name, color.concat(v.qty));
      } else {
        map.set(v.color.name, [v.qty]);
      }
    });
    const entries = Object.fromEntries(map);
    const colors: { name: string; isSoldOut: boolean }[] = [];

    for (const color in entries) {
      colors.push({ name: color, isSoldOut: entries[color].every((qty) => qty === 0) });
    }

    setSelectedColor(colors?.[0]?.name ?? '');

    return colors;
  }, [data]);

  const sizes = React.useMemo(() => {
    const map = new Map<string, number[]>();
    if (!data?.product?.variants) {
      return [];
    }

    data.product.variants.forEach((v) => {
      if (v.color.name === selectedColor) {
        const size = map.get(v.size.name);
        if (size) {
          map.set(v.size.name, size.concat(v.qty));
        } else {
          map.set(v.size.name, [v.qty]);
        }
      }
    });
    const entries = Object.fromEntries(map);
    const sizes: { name: string; isSoldOut: boolean }[] = [];
    for (const size in entries) {
      sizes.push({ name: size, isSoldOut: entries[size].every((qty) => qty === 0) });
    }

    const firstSize = sizes.find((s) => !s.isSoldOut);

    if (firstSize) {
      setSelectedSize(firstSize.name);
    }

    return sizes;
  }, [selectedColor]);

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
    product: { id, name, price, size_chart, fabric_and_care, description, product_images, variants, is_preorder },
  } = data;

  const discounts = data.product.discounts.filter((discount) => getDiscount(discount));
  const retailPrice = PHP(price);
  const discountPercent = discounts.reduce(
    (totalDiscount, discount) => PHP(totalDiscount).add(PHP(discount.percent_discount).divide(100)),
    PHP(0)
  );
  const amountOff = discounts.reduce((totalDiscount, discount) => PHP(totalDiscount).add(discount.amount), PHP(0));
  let adjustedPrice = amountOff.value ? roundUp(retailPrice.subtract(amountOff)) : retailPrice;
  adjustedPrice = discountPercent.value
    ? roundUp(adjustedPrice.subtract(adjustedPrice.multiply(discountPercent)))
    : retailPrice;

  const hasFreeShipping = !!discounts.find((discount) => discount.is_free_shipping);
  const images = product_images.flatMap((productImage) => productImage.images);

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

    const variant = variants.find((v) => v.size.name === selectedSize && v.color.name === selectedColor);
    if (!variant) return;

    dispatch({
      type: 'INCREMENT_ITEM',
      payload: {
        productId: parseInt(id, 10),
        variantId: parseInt(variant.id, 10),
        image: Object.values(images[selectedImageIndex].formats),
        name,
        price: adjustedPrice.value,
        qty: 1,
        size: selectedSize,
        color: selectedColor,
        hasFreeShipping,
        isPreorder: is_preorder,
      },
    });
    toast(`${name} has been added to your cart!`);
  }

  function handleNextImage() {
    const nextImageIndex = selectedImageIndex + 1;
    if (nextImageIndex > images.length - 1) {
      setSelectedImageIndex(0);
    } else {
      setSelectedImageIndex(nextImageIndex);
    }
  }

  function handlePreviousImage() {
    const previousImageIndex = selectedImageIndex - 1;
    if (previousImageIndex < 0) {
      setSelectedImageIndex(images.length - 1);
    } else {
      setSelectedImageIndex(previousImageIndex);
    }
  }

  return (
    <MainLayout title={name}>
      <div className='grid gap-4 lg:grid-cols-2'>
        <div className='grid grid-cols-4 col-span-1 gap-2' style={{ height: 'fit-content' }}>
          <div className='relative flex flex-col col-span-1 overflow-y-auto flex-nowrap'>
            <div className='relative h-full'>
              <div className='absolute grid w-full gap-2'>
                {images.map((image, index) => {
                  const formats = Object.values(image.formats);
                  return (
                    <div key={index} className='overflow-hidden rounded aspect-h-4 aspect-w-3'>
                      <picture onClick={handleImageClick(index)}>
                        {formats.map((format, index: number) => (
                          <source key={index} srcSet={`${format.url} ${format.width}w`} />
                        ))}
                        <IKImage className='rounded' src={image.url} />
                      </picture>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className='col-span-3'>
            <div className='relative'>
              {images.length > 0 && (
                <button
                  className='absolute bottom-2 z-10 grid w-6 h-6 transform bg-gray-900 rounded-full place-items-center  pr-0.5 shadow-lg left-2'
                  aria-label='previous image'
                  onClick={handlePreviousImage}
                >
                  <Icon icon={faAngleLeft} size='lg' className='text-white' />
                </button>
              )}
              <div className='overflow-hidden rounded aspect-h-4 aspect-w-3'>
                <picture>
                  {Object.values(images[selectedImageIndex].formats).map((format, index) => (
                    <source key={index} srcSet={`${format.url} ${format.width}w`} />
                  ))}
                  <IKImage className='rounded' src={images[selectedImageIndex].url} />
                </picture>
              </div>
              {images.length > 0 && (
                <button
                  className='absolute bottom-2 z-10 grid w-6 h-6 transform bg-gray-900 rounded-full place-items-center   pl-0.5 shadow-lg right-2'
                  onClick={handleNextImage}
                  aria-label='next image'
                >
                  <Icon icon={faAngleRight} size='lg' className='w-full text-white' />
                </button>
              )}
            </div>
          </div>
        </div>

        <div
          className='grid grid-cols-1 col-span-1 gap-4 p-4 bg-gray-100 rounded shadow-md xl:grid-cols-3'
          style={{ height: 'fit-content' }}
        >
          <form className='col-span-1' onSubmit={handleSubmit}>
            <div className='flex justify-between mb-4 space-x-4 xl:space-x-0 xl:space-y-4 xl:block xl:mb-0'>
              <div className='w-1/2 space-y-2 xl:w-full'>
                <h2 className='text-2xl text-gray-800'>{name}</h2>
                {is_preorder && <p className='text-gray-700'>Pre-Order</p>}
                <p className='text-xl'>
                  {amountOff.value || discountPercent.value ? (
                    <>
                      <span className='text-gray-400 line-through'>{retailPrice.format()}</span>{' '}
                      <span>{adjustedPrice.format()}</span>
                    </>
                  ) : (
                    retailPrice.format()
                  )}
                </p>
              </div>

              <div className='w-1/2 space-y-4 xl:w-full'>
                <fieldset>
                  <label htmlFor='color' className='flex items-center mb-0 mr-2 xl:mb-1'>
                    Color
                  </label>
                  <select
                    id='color'
                    name='color'
                    className='w-full px-2 py-1 capitalize border-2 border-black border-solid rounded'
                    onChange={handleColorChange}
                    value={selectedColor}
                    style={{
                      width: '-webkit-fill-available',
                    }}
                  >
                    {colors.map((color) => (
                      <option key={color.name} value={color.name} disabled={color.isSoldOut} className='capitalize'>
                        {`${color.name}${color.isSoldOut ? ' - sold out' : ''}`}
                      </option>
                    ))}
                  </select>
                </fieldset>

                <fieldset>
                  <label htmlFor='size' className='flex items-center mb-0 mr-2 xl:mb-1'>
                    Size
                  </label>
                  <select
                    id='size'
                    name='size'
                    className='w-full px-2 py-1 uppercase border-2 border-black border-solid rounded'
                    onChange={handleSizeChange}
                    value={selectedSize}
                    style={{
                      width: '-webkit-fill-available',
                    }}
                  >
                    {sizes.map((size) => (
                      <option key={size.name} value={size.name} disabled={size.isSoldOut} className='uppercase'>
                        {`${size.name}${size.isSoldOut ? ' - sold out' : ''}`}
                      </option>
                    ))}
                  </select>
                </fieldset>

                <fieldset>
                  <button className='w-full px-3 py-2 text-white bg-gray-900 rounded' type='submit'>
                    Add to Cart
                  </button>
                </fieldset>
              </div>
            </div>
          </form>
          <div className='col-span-2'>
            <div className='hidden grid-cols-3 gap-2 mb-4 xl:grid lg:grid-cols-3'>
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
              className='hidden xl:block rich-text'
              dangerouslySetInnerHTML={{
                __html: marked(
                  activeTab === 'description'
                    ? description || NA
                    : activeTab === 'size guide'
                    ? size_chart || NA
                    : fabric_and_care || NA
                ),
              }}
            />
            <div className='space-y-4 xl:hidden rich-text'>
              <div>
                <h2 className='text-lg'>Description</h2>
                <div dangerouslySetInnerHTML={{ __html: marked(description || NA) }}></div>
              </div>

              <div>
                <h2 className='text-lg'>Size Guide</h2>
                <div dangerouslySetInnerHTML={{ __html: marked(size_chart || NA) }}></div>
              </div>
              <div>
                <h2 className='text-lg'>Fabric & Care</h2>
                <div dangerouslySetInnerHTML={{ __html: marked(fabric_and_care || NA) }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
