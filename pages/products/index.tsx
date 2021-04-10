import { useQuery, gql } from '@apollo/client';

// components
import Spinner from '@components/spinner';
import Link from 'next/link';
import { IKImage } from 'imagekitio-react';
import { PHP } from '@helpers/currency';

const PRODUCTS_QUERY = gql`
  query Products {
    products {
      id
      name
      slug
      price
      product_images {
        images {
          url
          formats
        }
      }
    }
  }
`;

const mediaQueries = ['(max-width: 480px)', '(min-width: 481px)', '(min-width: 768px)'];

export default function Products() {
  const { loading, data, error } = useQuery(PRODUCTS_QUERY);

  if (error) {
    return null;
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
      {data.products.map((product: any, index: number) => {
        const productImages = product.product_images?.[0]?.images;
        let imageFormats: any[] = [];
        let firstImage: any;
        if (productImages) {
          firstImage = productImages[0];
          imageFormats = Object.values(firstImage.formats).sort((a: any, b: any) => a.width - b.width);
        }

        const [, ...formats] = imageFormats;

        if (!firstImage) {
          return null;
        }

        return (
          <div
            key={product.id}
            className='overflow-hidden '
            style={{
              transform: `translateX(${index}px)`,
            }}
          >
            <div className='cursor-pointer overflow-hidden rounded aspect-h-4 aspect-w-3'>
              <Link
                href={{ pathname: `/products/[id]`, query: { id: product.id } }}
                as={{
                  pathname: `/products/${product.id}`,
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
                  <IKImage
                    className='transition-transform duration-500 transform scale-100 hover:scale-110 mx-auto'
                    src={firstImage.url}
                    lqip={{ active: true, quality: 20, blur: 6 }}
                    loading='lazy'
                    style={{
                      height: 'inherit',
                    }}
                  />
                </picture>
              </Link>
            </div>
            <p className='mt-3 sm:text-xl font-medium text-center' style={{ fontFamily: 'Comorant' }}>
              {product.name}
            </p>
            <p className='text-center text-sm'>{PHP(product.price).format()}</p>
          </div>
        );
      })}
    </div>
  );
}
