import React from 'react';
import Link from 'next/link';

import { useQuery, gql } from '@apollo/client';

const warmUpQuery = gql`
  query WarmUp {
    products {
      id
    }
  }
`;

export default function IndexPage({ cta_text, hero_media, hero_text }: any) {
  const warmUp = useQuery(warmUpQuery);

  return (
    <div className='flex-grow flex bg-cover bg-center' style={{ backgroundImage: `url("${hero_media.url}")` }}>
      <section className='flex-grow flex flex-col items-center justify-end'>
        <Link href='/products'>
          <button className='rounded-full text-lg sm:text-2xl bg-white py-2 px-6 mb-10 block uppercase'>
            {cta_text}
          </button>
        </Link>
        <p className='text-white text-2xl sm:text-4xl text-center mb-20 capitalize' style={{ fontFamily: 'Comorant' }}>
          {hero_text}
        </p>
      </section>
    </div>
  );
}

export async function getStaticProps() {
  const query = `
    query {
      homePage {
        hero_media {
          url
          formats
        }
        hero_text
        cta_text
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

  const res = await fetcher.json();

  return {
    props: res.data.homePage,
  };
}
