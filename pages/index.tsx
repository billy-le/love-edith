import React from 'react';
import Link from 'next/link';
import Header from '../components/header';

export default function IndexPage() {
  return (
    <div className='main flex flex-col'>
      <Header />
      <main className='hero flex-grow bg-cover bg-center flex flex-col items-center justify-center'>
        <section className='flex flex-col items-center justify-center pt-64'>
          <Link href='/shop'>
            <button className='rounded-full text-3xl bg-white py-2 mb-10 w-1/3 block'>shop now</button>
          </Link>
          <p className='cta-text text-white text-6xl text-center'>The Cotton Candy Collection</p>
        </section>
      </main>
    </div>
  );
}
