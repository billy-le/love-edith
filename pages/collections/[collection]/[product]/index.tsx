import React from 'react';
import Header from '../../../../components/header';
import { IKImage } from 'imagekitio-react';

import { PHP } from '../../../../helpers/currency';

const TABS = ['description', 'model & fit', 'fabric & care'];

export default function Product({
  product: { images, variants, price, name, size_chart, description, model_and_fit, fabric_and_care },
}: any) {
  const mediaQueries = ['(max-width: 480px)', '(min-width: 481px)', '(min-width: 768px)'];
  const [selectedSize, setSelectedSize] = React.useState<string>('');
  const [selectedColor, setSelectedColor] = React.useState<string>('');
  const [isSizeChartOpen, setIsSizeChartOpen] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [activeTab, setActiveTab] = React.useState<string>('description');

  const [firstImage, ...otherImages] = images;
  const firstImageFormats = Object.values(firstImage.formats).sort((a: any, b: any) => a.width - b.width);
  const [, ...formats] = firstImageFormats;

  const otherImageFormats = otherImages
    .map((image: any) => Object.values(image.formats).sort((a: any, b: any) => a.width - b.width))
    .map((item: any) => {
      const [thumbnail, ...rest] = item;
      return thumbnail;
    });

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

  return (
    <>
      <Header />
      <main className='p-10'>
        <div className='grid grid-cols-2 gap-6'>
          <div>
            <picture>
              {formats.map((format: any, index) => (
                <source key={format.url} srcSet={`${format.url} ${format.width}w`} media={mediaQueries[index]} />
              ))}
              <IKImage src={firstImage.url} loading='lazy' />
            </picture>
          </div>
          <form>
            <h2 className='text-2xl text-gray-800'>{name}</h2>
            <p className='text-xl'>{PHP(price).format()}</p>
            <fieldset>
              <label className='block'>
                Size |{' '}
                <span className='relative text-gray-600 text-xs' onClick={toggleSizeChart}>
                  size chart
                  <div className='absolute top-0 right-0' dangerouslySetInnerHTML={{ __html: size_chart }} />
                </span>
              </label>
              <select className='uppercase' onChange={handleSizeChange} value={selectedSize}>
                {sizes.map((size) => (
                  <option key={size} className='uppercase' value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </fieldset>
            <fieldset>
              <label className='block'>Color</label>
              <select onChange={handleColorChange} value={selectedColor}>
                {colors.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </fieldset>
            <fieldset>
              <div className='flex gap-4'>
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
