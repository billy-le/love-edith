import React from 'react';

import Image from 'next/image';

import { PHP } from '../../../../helpers/currency';

export default function Product(props: any) {
  const product = props.data.sets[0].products[0];
  console.log(product);
  return props.data.sets.map((set: any) => (
    <div key={set.id} className='grid grid-cols-2 gap-6'>
      {set.products.map((product: any) => (
        <div key={product.id}>
          <Image
            src={product.images[0].url}
            height={product.images[0].height}
            width={product.images[0].width}
            layout='responsive'
          />
          <div className='mt-3 flex items-center flex-col justify-center'>
            <div>{product.name}</div>
            <div>{PHP(product.price).format()}</div>
          </div>
        </div>
      ))}
      <form>
        <label>Size</label>
        <select>
          <option defaultValue='hi'>Sm</option>
        </select>
      </form>
    </div>
  ));
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

  const fetcher = await fetch('http://localhost:1337/graphql', {
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
          variants {
              qty
              color { name }
              size { name }
          }
          images {
            width
            height
            url
          }
      }
    }
  }
`;

  const fetcher = await fetch('http://localhost:1337/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  const json = await fetcher.json();

  return {
    props: {
      data: json.data,
    }, // will be passed to the page component as props
  };
}
