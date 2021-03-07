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
    <div className='grid grid-cols-4 gap-4'>
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
            className='collection_product_item overflow-hidden'
            style={{
              transform: `translateX(${index}px)`,
            }}
          >
            <div className='collection_product_image cursor-pointer rounded'>
              <Link
                href={`/products/[id]`}
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
  );
}