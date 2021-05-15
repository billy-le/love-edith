import { useQuery, gql } from '@apollo/client';

// helpers
import { PHP, roundUp } from '@helpers/currency';
import { getDiscount } from '@helpers/getDiscount';

// components
import Spinner from '@components/spinner';
import Link from 'next/link';
import { IKImage } from 'imagekitio-react';
import { MainLayout } from 'layouts/main';

// interfaces
import { Product, Image, ImageFormat } from 'types/models';

const PRODUCTS_QUERY = gql`
  query Products {
    products(sort: "published_at:DESC", where: { is_discontinued: false }) {
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
      is_sold_out
      discounts {
        id
        expiration_date
        percent_discount
        amount
        is_free_shipping
      }
      published_at
    }
  }
`;

const mediaQueries = ['(max-width: 480px)', '(min-width: 481px)', '(min-width: 768px)'];

export default function ProductsPage() {
  const { loading, data, error } = useQuery<{ products: Product[] }>(PRODUCTS_QUERY);

  if (error) {
    return null;
  }

  if (loading) {
    return <Spinner />;
  }

  if (!data) {
    return null;
  }

  const products = [...data.products]
    .sort((a, _b) => (a.is_sold_out ? 1 : -1))
    .sort((a, b) => (a.is_sold_out ? 1 : b.published_at.localeCompare(a.published_at)));

  return (
    <MainLayout title='Products'>
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
        {products.map((product, index) => {
          const discounts = product.discounts.filter((discount) => getDiscount(discount));
          const productImages = product.product_images?.[0]?.images;
          let imageFormats: ImageFormat[] = [];
          let firstImage: Image | null = null;

          if (productImages) {
            firstImage = productImages[0];
            imageFormats = Object.values(firstImage.formats).sort((a, b) => a.width - b.width);
          }

          const [, ...formats] = imageFormats;

          if (!firstImage) {
            return null;
          }

          const retailPrice = PHP(product.price);
          const discountPercent = discounts.reduce(
            (totalDiscount, discount) => PHP(totalDiscount).add(PHP(discount.percent_discount).divide(100)),
            PHP(0)
          );
          const amountOff = discounts.reduce(
            (totalDiscount, discount) => PHP(totalDiscount).add(discount.amount),
            PHP(0)
          );
          const isFreeShipping = !!discounts.find((discount) => discount.is_free_shipping);

          let adjustedPrice = amountOff.value ? retailPrice.subtract(amountOff.value) : retailPrice;
          adjustedPrice = discountPercent.value
            ? adjustedPrice.subtract(adjustedPrice.multiply(discountPercent))
            : retailPrice;

          return (
            <div
              key={product.id}
              className={`overflow-hidden ${product.is_sold_out ? 'opacity-50' : ''}`}
              style={{
                transform: `translateX(${index}px)`,
              }}
            >
              <div className='relative cursor-pointer overflow-hidden rounded aspect-h-4 aspect-w-3'>
                <Link href={{ pathname: `/products/[id]` }} as={`/products/${product.id}`}>
                  <picture>
                    {formats.map((format, index) => (
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
                    />
                  </picture>
                </Link>
              </div>
              <p className='mt-3 sm:text-lg font-medium text-center' style={{ fontFamily: 'Comorant' }}>
                {product.name}
              </p>
              {product.is_sold_out ? <p className='text-center text-xs'>(Sold Out)</p> : null}
              {isFreeShipping ? <p className='text-center text-sm'>*free shipping</p> : null}
              <p className='text-center text-sm'>
                {amountOff.value || discountPercent.value ? (
                  <>
                    <span className='line-through text-gray-400'>{retailPrice.format()}</span>{' '}
                    <span>{roundUp(adjustedPrice).format()}</span>
                  </>
                ) : (
                  retailPrice.format()
                )}
              </p>
            </div>
          );
        })}
      </div>
    </MainLayout>
  );
}
