import { MainLayout } from 'layouts/main';

export default function Order() {
  return (
    <MainLayout title='Thank you!'>
      <section className='flex-grow flex flex-col items-center justify-center'>
        <h1 className='text-6xl sm:text-8xl text-center'>Thank you for shopping at Love, Edith!</h1>
      </section>
    </MainLayout>
  );
}
