import { gql, useQuery } from '@apollo/client';
import Image from 'next/image';
import Link from 'next/link';

const QUERY = gql`
  query collections {
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
          url
          height
          width
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
    <div>
      {sets.map((set: any) => (
        <section key={set.id} className='grid grid-cols-4'>
          <div>
            <Link href={`/collections/[collection]`} as={{ pathname: `/collections/${set.slug}` }}>
              <h2 className='mb-6'>{set.name}</h2>
            </Link>
            <div className=''>
              {set.products.map((product: any) => (
                <Link
                  key={product.id}
                  href={`/collections/[collection]/[${product.name}]`}
                  as={{ pathname: `/collections/${set.slug}/${product.slug}` }}
                >
                  <div>
                    {product.images.length > 0 && (
                      <Image
                        src={product.images[0].url}
                        height={product.images[0].height}
                        width={product.images[0].width}
                        layout='responsive'
                      />
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
