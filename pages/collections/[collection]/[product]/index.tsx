import React from 'react';
import Header from '@components/header';
import { IKImage } from 'imagekitio-react';
import { PHP } from '@helpers/currency';
import { useAppContext } from '@hooks/useAppContext';

const TABS = ['description', 'model & fit', 'fabric & care'];
const MEDIA_QUERIES = ['(max-width: 480px)', '(min-width: 481px)', '(min-width: 768px)'];

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
  const { dispatch } = useAppContext();
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

  const colors = React.useMemo(() => {
    const set = new Set<string>();
    variants.forEach((v: any) => v.qty > 0 && set.add(v.color.name));
    const colors = Array.from(set);
    const [firstColor] = colors;
    setSelectedColor(firstColor);
    return colors;
  }, []);

  const sizes = React.useMemo(() => {
    const set = new Set<string>();
    variants.forEach((v: any) => v.qty > 0 && set.add(v.size.name));
    const sizes = Array.from(set);
    const [firstSize] = sizes;
    setSelectedSize(firstSize);

    return sizes;
  }, []);

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

    dispatch({
      type: 'ADD_PRODUCT',
      payload: {
        description,
        id,
        image: images.get(selectedImageIndex),
        name,
        price,
        qty: 1,
        size: selectedSize as any,
      },
    });
  }

  return (
    <>
      <Header />
      <main className='p-10'>
        <div className='grid grid-cols-2 gap-6'>
          <div className='grid grid-cols-4 gap-2'>
            <div className='grid gap-2 col-span-1 items-stretch'>
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
            <picture className='col-span-3'>
              {formats.map((format: any, index: number) => (
                <source key={format.url} srcSet={`${format.url} ${format.width}w`} media={MEDIA_QUERIES[index]} />
              ))}
              <IKImage className='rounded' src={formats[2].url} loading='lazy' />
            </picture>
          </div>
          <form className='shadow-sm bg-gray-300 rounded p-10' onSubmit={handleSubmit}>
            <h2 className='text-2xl text-gray-800 mb-3'>{name}</h2>

            <p className='text-xl mb-3'>{PHP(price).format()}</p>

            <fieldset className='mb-3'>
              <label htmlFor='size' className='mb-1 flex items-center'>
                Size
                {size_chart && (
                  <>
                    |
                    <span
                      className='ml-1 cursor-pointer block relative text-gray-600 text-xs'
                      onClick={toggleSizeChart}
                    >
                      size chart
                      <div className='absolute top-0 right-0' dangerouslySetInnerHTML={{ __html: size_chart }} />
                    </span>
                  </>
                )}
              </label>
              <select
                id='size'
                name='size'
                className='rounded uppercase border-2 border-solid border-black w-1/4 py-1 px-2'
                onChange={handleSizeChange}
                value={selectedSize}
              >
                {sizes.map((size) => (
                  <option key={size} className='uppercase' value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </fieldset>

            <fieldset className='mb-3'>
              <label htmlFor='color' className='block mb-1'>
                Color
              </label>
              <select
                id='color'
                name='color'
                className='rounded border-2 border-solid border-black w-1/4 py-1 px-2'
                onChange={handleColorChange}
                value={selectedColor}
              >
                {colors.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </fieldset>

            <fieldset className='mb-3'>
              <button className='rounded py-2 px-3 w-1/4 bg-gray-900 text-white' type='submit'>
                Add to Cart
              </button>
            </fieldset>

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
              <p>
                {activeTab === 'description'
                  ? description
                  : activeTab === 'model & fit'
                  ? model_and_fit
                  : fabric_and_care}
              </p>
            </fieldset>
          </form>
        </div>
      </main>
    </>
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
