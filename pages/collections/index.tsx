import React from 'react';
import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import { IKImage } from 'imagekitio-react';
import { PHP } from '@helpers/currency';

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
      {sets.map((set: any, index: number) => (
        <section key={set.id} className={index !== sets.length - 1 ? 'mb-10' : ''}>
          <h2 className='inline-block mb-6 text-2xl capitalize'>{set.name} Collection</h2>
          <Carousel set={set} />
        </section>
      ))}
    </>
  );
}

function Carousel({ set }: any) {
  const mediaQueries = ['(max-width: 480px)', '(min-width: 481px)', '(min-width: 768px)'];
  const containerRef = React.useRef<HTMLDivElement>(null);

  return (
    <>
      <div className='collection_products flex gap-4'>
        {set.products.map((product: any, index: number) => {
          const firstImage = product.images[0];
          const imageFormats = Object.values(product.images[0].formats).sort((a: any, b: any) => a.width - b.width);

          const [, ...formats] = imageFormats;

          return (
            <div
              key={product.id}
              className='collection_product_item overflow-hidden'
              ref={containerRef}
              style={{
                transform: `translateX(${index}px)`,
              }}
            >
              <div className='collection_product_image cursor-pointer'>
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
              <p className='mt-3 text-xl font-bold text-center'>{product.name}</p>
              <p className='text-center'>{PHP(product.price).format()}</p>
            </div>
          );
        })}
      </div>
    </>
  );
}
