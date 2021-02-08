import React from 'react';
import Image from 'next/image';
import { PHP } from '../../../helpers/currency';

export default function Collection(props: any) {
  return props.data.sets.map((set: any) => (
    <div key={set.id} className='grid grid-cols-4 gap-6'>
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
    </div>
  ));
}

export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const query = `
    query {
      sets {
        id
        slug
      }
    }
  `;

  const fetcher = await fetch(process.env.NEXT_PUBLIC_API as string, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });
  const json = await fetcher.json();
  return {
    paths: json.data.sets.map((set: any) => ({ params: { collection: `${set.slug}`, id: set.id } })),
    fallback: false,
  };
}

export async function getStaticProps(context: any) {
  const {
    params: { collection },
  } = context;

  const query = `
  query {
    sets(where:{
      slug: "${collection}"
    }) {
      id
      name
      products {
          id
          name
          is_sold_out
          price
          images {
            width
            height
            url
          }
      }
    }
  }
`;

  const fetcher = await fetch(process.env.NEXT_PUBLIC_API as string, {
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
    },
  };
}
