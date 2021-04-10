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

marked.setOptions({
  breaks: true,
});

export default function Product() {
  const { query } = useRouter();

  const { id: paramId } = query;
  const { dispatch } = useAppContext();

  const [selectedSize, setSelectedSize] = React.useState<string>('');
  const [selectedColor, setSelectedColor] = React.useState<string>('');
  const [activeTab, setActiveTab] = React.useState<string>('description');
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);

  const { error, loading, data } = useQuery(PRODUCT_QUERY, {
    variables: {
      id: paramId,
    },
  });

  const colors = React.useMemo(() => {
    const map = new Map<string, number[]>();
    if (!data?.product?.variants) {
      return [];
    }

    data.product.variants.forEach((v: any) => {
      const color = map.get(v.color.name);
      if (color) {
        map.set(v.color.name, color.concat(v.qty));
      } else {
        map.set(v.color.name, [v.qty]);
      }
    });
    const entries = Object.fromEntries(map);
    const colors: { name: string }[] = [];

    for (const color in entries) {
      if (entries[color].every((qty) => qty === 0)) {
        break;
      }
      colors.push({ name: color });
    }

    setSelectedColor(colors?.[0]?.name ?? '');

    return colors;
  }, [data]);

  const sizes = React.useMemo(() => {
    const map = new Map<string, number[]>();
    if (!data?.product?.variants) {
      return [];
    }

    data.product.variants.forEach((v: any) => {
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
    product: { id, name, price, size_chart, fabric_and_care, description, product_images, variants },
  } = data;

  const images = product_images.flatMap((productImage: any) => productImage.images);

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
    if (!variant) return;

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
    toast(`${name} has been added to your cart!`);
  }

  return (
    <div className='grid xl:grid-cols-2 gap-4'>
      <div className='grid grid-cols-4 col-span-1 gap-2'>
        <div className='relative col-span-1 flex flex-col flex-nowrap overflow-y-auto'>
          <div className='absolute grid gap-2 w-full'>
            {images.map((image: any, index: number) => {
              const formats: any[] = Object.values(image.formats);
              return (
                <div key={index} className='aspect-h-4 aspect-w-3 overflow-hidden rounded'>
                  <picture onClick={handleImageClick(index)}>
                    {formats.map((format: any, index: number) => (
                      <source key={index} srcSet={`${format.url} ${format.width}w`} />
                    ))}
                    <IKImage className='rounded' src={image.url} />
                  </picture>
                </div>
              );
            })}
          </div>
        </div>
        <div className='col-span-3'>
          <div className='aspect-h-4 aspect-w-3 overflow-hidden rounded'>
            <picture>
              {Object.values(images[selectedImageIndex].formats).map((format: any, index: number) => (
                <source key={index} srcSet={`${format.url} ${format.width}w`} />
              ))}
              <IKImage className='rounded' src={images[selectedImageIndex].url} />
            </picture>
          </div>
        </div>
      </div>

      <div
        className='grid grid-cols-1 xl:grid-cols-3 gap-4 col-span-1 bg-gray-100 p-4 rounded shadow-md'
        style={{ height: 'fit-content' }}
      >
        <form className='col-span-1' onSubmit={handleSubmit}>
          <div className='flex justify-between space-x-4 mb-4 xl:space-x-0 xl:space-y-4 xl:block xl:mb-0'>
            <div className='space-y-2 w-1/2 xl:w-full'>
              <h2 className='text-2xl text-gray-800'>{name}</h2>
              <p className='text-xl'>{PHP(price).format()}</p>
            </div>

            <div className='space-y-4 w-1/2 xl:w-full'>
              <fieldset>
                <label htmlFor='color' className='flex items-center mb-0 mr-2 xl:mb-1'>
                  Color
                </label>
                <select
                  id='color'
                  name='color'
                  className='rounded border-2 border-solid border-black py-1 px-2 capitalize'
                  onChange={handleColorChange}
                  value={selectedColor}
                  style={{
                    width: '-webkit-fill-available',
                  }}
                >
                  {colors.map((color: any) => (
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
                  className='rounded border-2 border-solid border-black py-1 px-2 uppercase'
                  onChange={handleSizeChange}
                  value={selectedSize}
                  style={{
                    width: '-webkit-fill-available',
                  }}
                >
                  {sizes.map((size: any) => (
                    <option key={size.name} value={size.name} disabled={size.isSoldOut} className='uppercase'>
                      {`${size.name}${size.isSoldOut ? ' - sold out' : ''}`}
                    </option>
                  ))}
                </select>
              </fieldset>

              <fieldset>
                <button className='rounded py-2 px-3 w-full bg-gray-900 text-white' type='submit'>
                  Add to Cart
                </button>
              </fieldset>
            </div>
          </div>
        </form>
        <div className='col-span-2'>
          <div className='hidden xl:grid grid-cols-3 lg:grid-cols-3 gap-2 mb-4'>
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
          <div className='xl:hidden space-y-4 rich-text'>
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
  );
}
