import Header from '../../components/header';
import Link, { LinkProps } from 'next/link';

import inventory from '../../inventory';
import { PHP } from '../../helpers/currency';

export default function Shop() {
  return (
    <div className='main flex flex-col'>
      <Header />
      <main className='p-10'>
        <section className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5'>
          {inventory.map((collection) => {
            const items = Object.keys(collection.colors) as (keyof typeof collection.colors)[];

            return items.map((item) => {
              const href = `/collections/[collection]?productId=${collection.productId}&item=${item}`;

              function getLinkProps(): LinkProps {
                return {
                  href,
                  as: {
                    pathname: `/collections/${collection.slug}`,
                  },
                };
              }

              return (
                <div key={item}>
                  <Link {...getLinkProps()}>
                    <div className='collection__image__container relative cursor-pointer overflow-hidden mb-4'>
                      <div
                        className='collection__image absolute top-0 left-0 bg-top bg-cover h-full w-full'
                        style={{
                          backgroundImage: `url("/assets/${collection.colors[item][0]}")`,
                        }}
                      />
                    </div>
                  </Link>
                  <h3 className='text-center'>
                    <Link {...getLinkProps()}>
                      <a className='cursor-pointer capitalize text-lg text-gray-800 hover:underline'>{item}</a>
                    </Link>
                  </h3>
                  <p className='text-center text-sm text-gray-700'>{collection.name}</p>
                  <p className='text-center text-xs text-gray-700'>{PHP(collection.price).format()}</p>
                </div>
              );
            });
          })}
        </section>
      </main>
    </div>
  );
}
