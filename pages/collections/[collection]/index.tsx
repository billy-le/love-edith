import React from 'react';

// helpers
import { PHP } from '@helpers/currency';
import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import Link from 'next/link';

// components
import { IKImage } from 'imagekitio-react';
import Spinner from '@components/spinner';
import NotFound from '@components/not-found';

export default function Collection(props: any) {
  const { query } = useRouter();

  const QUERY = gql`
    query Collection($slug: String) {
      sets(where: { slug: $slug }) {
        name
        id
        products {
          id
          name
          price
          images {
            height
            width
            formats
            url
          }
          slug
        }
      }
    }
  `;

  const { data, loading, error } = useQuery(QUERY, {
    variables: { slug: query.collection },
  });

  if (error) {
    return <NotFound />;
  }

  if (loading) {
    return <Spinner />;
  }

  return data.sets.map((set: any) => (
    <div key={set.id} className='grid grid-cols-4 gap-6'>
      {set.products.map((product: any) => {
        return (
          <div key={product.id}>
            <picture>
              <Link href={`[collection]/[product]`} as={{ pathname: `${query.collection}/${product.slug}` }}>
                <IKImage
                  src={product.images[0].url}
                  height={product.images[0].height}
                  width={product.images[0].width}
                />
              </Link>
            </picture>
            <div className='mt-3 flex items-center flex-col justify-center'>
              <div>{product.name}</div>
              <div>{PHP(product.price).format()}</div>
            </div>
          </div>
        );
      })}
    </div>
  ));
}
