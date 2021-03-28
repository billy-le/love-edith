import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { IKImage } from 'imagekitio-react';
import { PHP } from '@helpers/currency';
import { useAppContext } from '@hooks/useAppContext';
import marked from 'marked';
import Spinner from '@components/spinner';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

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
    }
  }
`;

export default function Product() {
  const { query } = useRouter();

  const { id: paramId } = query;
  const { dispatch } = useAppContext();

  const [selectedSize, setSelectedSize] = React.useState<string>('');
  const [selectedColor, setSelectedColor] = React.useState<string>('');
  const [isSizeChartOpen, setIsSizeChartOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<string>('description');
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);

  const { error, loading, data } = useQuery(PRODUCT_QUERY, {
    variables: {
      id: paramId,
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
    product: { id, name, price, size_chart, fabric_and_care, description, product_images, variants },
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
        color: selectedColor as any,
      },
    });
    toast(
      `${name} - ${selectedSize.toUpperCase()} - ${selectedColor
        .slice(0, 1)
        .toUpperCase()
        .concat(selectedColor.slice(1))} - has been added to your cart!`,
      {
        hideProgressBar: true,
      }
    );
  }

  return (
    <div className='grid sm:grid-cols-4 gap-4'>
      <div className='grid grid-cols-4 col-span-2 gap-2'>
        <div
          className='relative col-span-1 flex flex-col flex-nowrap overflow-y-auto'
          style={{
            maxHeight: '60vh',
          }}
        >
          <div className='absolute grid gap-2'>
            {images.map((image: any, index: number) => {
              const formats: any[] = Object.values(image.formats);
              return (
                <picture key={index} onClick={handleImageClick(index)}>
                  {formats.map((format: any, index: number) => (
                    <source key={index} srcSet={`${format.url} ${format.width}w`} />
                  ))}
                  <IKImage className='rounded' src={image.url} />
                </picture>
              );
            })}
          </div>
        </div>
        <div className='col-span-3' style={{ minHeight: '55vh' }}>
          <picture>
            {Object.values(images[selectedImageIndex].formats).map((format: any, index: number) => (
              <source key={index} srcSet={`${format.url} ${format.width}w`} />
            ))}
            <IKImage className='rounded' src={images[selectedImageIndex].url} />
          </picture>
        </div>
      </div>

      <div
        className='grid grid-cols-1 xl:grid-cols-3 gap-2 col-span-2 bg-gray-100 p-4 rounded shadow-md'
        style={{ height: 'fit-content' }}
      >
        <form className='col-span-1' onSubmit={handleSubmit}>
          <div className='grid gap-2 lg:block justify-between items-center mb-4 lg:mb-0'>
            <h2 className='text-2xl text-gray-800 mb-0 lg:mb-3'>{name}</h2>

            <p className='text-xl mb-0 lg:mb-3'>{PHP(price).format()}</p>

            <fieldset className='mb-0 lg:mb-3 flex lg:block'>
              <label htmlFor='size' className='mr-2 mb-0 lg:mr-0 lg:mb-1 flex items-center'>
                Size
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

            <fieldset className='flex lg:block mb-0 lg:mb-3'>
              <label htmlFor='color' className='mr-2 lg:mr-0 flex items-center mb-0 lg:mb-1'>
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
            </fieldset>
          </div>
        </form>
        <div className='col-span-2'>
          <div className='grid grid-cols-3 lg:grid-cols-3 gap-2 mb-4'>
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
                  : activeTab === 'size guide'
                  ? size_chart || NA
                  : fabric_and_care || NA
              ),
            }}
          />
        </div>
      </div>
    </div>
  );
}
