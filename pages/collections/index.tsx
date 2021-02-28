import React from 'react';
import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import { IKImage } from 'imagekitio-react';
import { PHP } from '@helpers/currency';

// components
import Spinner from '@components/spinner';
import NotFound from '@components/not-found';

const QUERY = gql`
  query {
    sets {
      name
      slug
      products {
        id
      }
    }
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
`;

export default function Collections() {
  const { loading, error, data } = useQuery(QUERY);

  const mediaQueries = ['(max-width: 480px)', '(min-width: 481px)', '(min-width: 768px)'];
  const containerRef = React.useRef<HTMLDivElement>(null);

  if (error) {
    return <NotFound />;
  }

  if (loading) {
    return <Spinner />;
  }

  const { products, sets } = data;

  return (
    <div className='grid grid-cols-12'>
      <div className='flex flex-col col-span-2'>
        {sets.map((set: any) => (
          <Link
            href={`/collections/[collection]`}
            as={{
              pathname: `/collections/${set.slug}`,
            }}
            key={set.slug}
          >
            <span className='hover:underline cursor-pointer lowercase'>{set.name}</span>
          </Link>
        ))}
      </div>
      <div className='collection_products col-span-10 flex flex-wrap gap-4'>
        {products.map((product: any, index: number) => {
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
                  as={{
                    pathname: `/collections/${
                      sets.find((set: any) => set.products.find((p: any) => p.id === product.id)).slug
                    }/${product.slug}`,
                  }}
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
    </div>
  );
}
