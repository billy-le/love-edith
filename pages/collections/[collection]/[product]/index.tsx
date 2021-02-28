import React from 'react';
import { IKImage } from 'imagekitio-react';
import { PHP } from '@helpers/currency';
import { useAppContext } from '@hooks/useAppContext';
import marked from 'marked';

const TABS = ['description', 'model & fit', 'fabric & care'];
const MEDIA_QUERIES = ['(max-width: 480px)', '(min-width: 481px)', '(min-width: 768px)'];
const NA = 'Not Available';

export default function Product({
  product: {
    id,
    images: productImages,
    variants,
    price,
    name,
    size_chart,
    description,
    model_and_fit,
    fabric_and_care,
  },
}: any) {
  const {
    state: { cart },
    dispatch,
  } = useAppContext();
  const [selectedSize, setSelectedSize] = React.useState<string>('');
  const [selectedColor, setSelectedColor] = React.useState<string>('');
  const [isSizeChartOpen, setIsSizeChartOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<string>('description');
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);

  const images: Map<number, any> = React.useMemo(() => {
    const imagesMap = new Map();

    productImages.forEach((image: any, index: number) =>
      imagesMap.set(
        index,
        Object.values(image.formats).sort((a: any, b: any) => a.width - b.width)
      )
    );

    return imagesMap;
  }, []);

  const [, ...formats] = images.get(selectedImageIndex);

  const sizes = React.useMemo(() => {
    const map = new Map<string, number[]>();

    variants.forEach((v: any) => {
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
  }, []);

  const colors = React.useMemo(() => {
    const map = new Map<string, number[]>();

    variants.forEach((v: any) => {
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
        image: images.get(0),
        name,
        price,
        qty: 1,
        size: selectedSize as any,
      },
    });
  }

  return (
    <div className='grid grid-cols-3 gap-6'>
      <div className='grid grid-cols-4 gap-2 col-span-3 lg:col-span-2' style={{ height: 'fit-content' }}>
        <div className='grid gap-2 col-span-4 sm:col-span-1'>
          {Array.from(images.values()).map((image, index) => {
            const [, ...formats] = image;
            const [smallImage] = formats;

            return (
              <picture key={index} className='cursor-pointer' onClick={handleImageClick(index)}>
                {formats.map((format: any, index: number) => (
                  <source key={format.url} srcSet={`${format.url} ${format.width}w`} media={MEDIA_QUERIES[index]} />
                ))}
                <IKImage className='rounded' src={smallImage.url} loading='lazy' />
              </picture>
            );
          })}
        </div>
        <picture className='col-span-4 sm:col-span-3'>
          {formats.map((format: any, index: number) => (
            <source key={format.url} srcSet={`${format.url} ${format.width}w`} media={MEDIA_QUERIES[index]} />
          ))}
          <IKImage className='rounded' src={formats[2].url} loading='lazy' />
        </picture>
      </div>
      <div className='col-span-3 lg:col-span-1'>
        <form
          className=' sm:block shadow-sm bg-gray-300 rounded p-6'
          onSubmit={handleSubmit}
          style={{
            height: 'fit-content',
          }}
        >
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
                className='rounded border-2 border-solid border-black w-full lg:w-1/2 py-1 px-2 uppercase'
                onChange={handleSizeChange}
                value={selectedSize}
              >
                {sizes.map((size) => (
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
                className='rounded border-2 border-solid border-black w-full lg:w-1/2 py-1 px-2 capitalize'
                onChange={handleColorChange}
                value={selectedColor}
              >
                {colors.map((color) => (
                  <option key={color.name} value={color.name} disabled={color.isSoldOut} className='capitalize'>
                    {`${color.name}${color.isSoldOut ? ' - sold out' : ''}`}
                  </option>
                ))}
              </select>
            </fieldset>

            <fieldset className='mb-0 lg:mb-3'>
              <button className='rounded py-2 px-3 w-full lg:w-1/2 bg-gray-900 text-white' type='submit'>
                Add to Cart
              </button>
            </fieldset>
          </div>

          <fieldset>
            <div className='flex gap-4 mb-1'>
              {TABS.map((tab) => (
                <label
                  key={tab}
                  className={`capitalize ${activeTab === tab ? 'underline' : ''}`}
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
          </fieldset>
        </form>
        <p className='mt-3 text-xs text-gray-700'>
          * Due to limited stock, we can only allow adding one item per size per cart.
        </p>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const query = `
    query {
      sets {
        id
        name
        slug
        products {
          id
          name
          slug
        }
      }
    }
  `;

  const fetcher = await fetch(process.env.NEXT_PUBLIC_API as string, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  const json = await fetcher.json();

  return {
    paths: json.data.sets.flatMap((set: any) =>
      set.products.map((product: any) => ({ params: { collection: set.slug, product: product.slug } }))
    ),
    fallback: false,
  };
}

export async function getStaticProps(context: any) {
  const {
    params: { collection, product },
  } = context;

  const query = `
  query {
    sets(where:{
      slug: "${collection}"
    }) {
      id
      name
      products(where: {slug: "${product}"}) {
          id
          name
          is_sold_out
          price
          description
          fabric_and_care
          model_and_fit
          variants {
              id
              qty
              color { name }
              size { name }
          }
          images {
            url
            formats
          }
      }
    }
  }
`;

  const fetcher = await fetch(process.env.NEXT_PUBLIC_API as string, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  const json = await fetcher.json();

  return {
    props: {
      product: json.data.sets[0].products[0],
    },
  };
}
