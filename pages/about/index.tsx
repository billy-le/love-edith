import { MainLayout } from '@layouts/main';

export default function FaqPage() {
  return (
    <MainLayout title='FAQ'>
      <div className='mx-auto prose-sm prose text-black'>
        <h1 className='text-center'>About Us</h1>

        <p>Love, Edith was borne out of pure love to spread love.</p>

        <p>
          It was created to spread love through timeless loungewear pieces that you wear on heavy rotation, regardless
          of the situation, so you become empowered and loved.
        </p>

        <p>
          Spreading love means supporting our local seamstresses — who really are the core of our small business, so we
          can continuously provide a standard of livelihood.
        </p>

        <p>
          Spreading love means working our way in a slow fashion business model. We consciously produce in small batches
          based only on what you want. This ensures quality of products as well as quality of life of our dear
          seamstresses. Sustainability is our business proverb.
        </p>

        <p>
          Love, Edith is not just a brand, it is <span className='italic'>love.</span>
        </p>

        <p>We hope that as you dress with love from Edith, you love yourself a little bit more.</p>
      </div>
    </MainLayout>
  );
}
