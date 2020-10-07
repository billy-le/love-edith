import Header from '../../components/header';
import Link from 'next/link';

const style = { height: 500 };
const imgStyle = { maxHeight: '100%' };

export default function Shop() {
  return (
    <div className='main flex flex-col'>
      <Header />
      <main className='p-10'>
        <section className='flex items-center justify-center'>
          <Link href='/collections/cotton-candy'>
            <div style={style} className='mr-20'>
              <img src='/assets/cotton-1.jpg' className='mb-8' style={imgStyle} />
              <h3 className='text-center'>The Cotton Set</h3>
              <p className='text-center'>P999</p>
            </div>
          </Link>
          <Link href='/collections/cotton-candy'>
            <div style={style}>
              <img src='/assets/candy-2.jpg' className='mb-8' style={imgStyle} />
              <h3 className='text-center'>The Candy Set</h3>
              <p className='text-center'>P999</p>
            </div>
          </Link>
        </section>
      </main>
    </div>
  );
}
