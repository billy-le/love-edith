import React from 'react';
import Link from 'next/link';

export default function IndexPage({ cta_text, hero_media, hero_text }: any) {
  return (
    <div className='flex-grow flex hero' style={{ backgroundImage: `url("${hero_media.url}")` }}>
      <section className='flex-grow flex flex-col items-center justify-end pb-8 z-10'>
        <Link href='/products'>
          <button className='rounded-full text-lg sm:text-3xl bg-white py-2 px-6 mb-10 block uppercase'>
            {cta_text}
          </button>
        </Link>
        <p className='text-white text-3xl sm:text-6xl text-center'>{hero_text}</p>
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
