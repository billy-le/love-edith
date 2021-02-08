import React from 'react';
import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import Header from '../../components/header';
import { IKImage } from 'imagekitio-react';

const QUERY = gql`
  query {
    sets {
      id
      name
      description
      slug
      products {
        id
        name
        slug
        images {
          formats
          url
        }
        price
      }
    }
  }
`;

export default function Collections() {
  const { loading, error, data } = useQuery(QUERY);

  if (error) {
    return <div>Something went wrong</div>;
  }

  if (loading) {
    return <div className='flex items-center justify-center py-40'>LOADING</div>;
  }

  const { sets } = data;

  return (
    <>
      <Header />
      <main className='p-10'>
        {sets.map((set: any, index: number) => (
          <section key={set.id} className={index !== sets.length - 1 ? 'mb-10' : ''}>
            <div>
              <Link href={`/collections/[collection]`} as={{ pathname: `/collections/${set.slug}` }}>
                <h2 className='inline-block mb-6 text-2xl capitalize cursor-pointer'>{set.name} Collection</h2>
              </Link>
              <Carousel set={set} />
            </div>
          </section>
        ))}
      </main>
    </>
  );
}

function Carousel({ set }: any) {
  const mediaQueries = ['(max-width: 480px)', '(min-width: 481px)', '(min-width: 768px)'];
  const [index, setIndex] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const imageRef = React.useRef<{ [key: number]: HTMLDivElement }>({});
  const productsCount = set.products.length;

  React.useEffect(() => {
    if (containerRef.current) {
      const totalWidth = containerRef.current.offsetWidth;
    }
  }, []);

  function handleNext(e: React.MouseEvent) {
    e.preventDefault();
  }

  return (
    <>
      <div className='collection_products flex flex-no-wrap items-stretch gap-4 overflow-x-auto'>
        {set.products.map((product: any, index: number) => {
          const firstImage = product.images[0];
          const imageFormats = Object.values(product.images[0].formats).sort((a: any, b: any) => a.width - b.width);

          const [, ...formats] = imageFormats;

          return (
            <div
              key={product.id}
              className='collection_product_item overflow-hidden cursor-pointer'
              ref={containerRef}
              style={{
                transform: `translateX(${index}px)`,
              }}
            >
              <div
                className='collection_product_image'
                ref={(el) => {
                  if (el) {
                    imageRef.current[index] = el;
                  }
                }}
              >
                <Link
                  href={`/collections/[collection]/[${product.name}]`}
                  as={{ pathname: `/collections/${set.slug}/${product.slug}` }}
                >
                  <picture>
                    {formats.map((format: any, index) => (
                      <source
                        key={format.url}
                        srcSet={`${format.url} ${format.width}w`}
                        type={format.mime}
                        media={mediaQueries[index]}
                      />
                    ))}
                    <IKImage src={firstImage.url} lqip={{ active: true, quality: 20, blur: 6 }} loading='lazy' />
                  </picture>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
      {productsCount > 1 && (
        <div className='mt-4 flex items-center justify-end gap-4'>
          <button>prev</button>
          {set.products.map((_: any, index: number) => (
            <div key={index} className='flex items-center justify-between'>
              <div className='rounded-full h-4 w-4 bg-gray-700'></div>
            </div>
          ))}
          <button onClick={handleNext}>next</button>
        </div>
      )}
    </>
  );
}
