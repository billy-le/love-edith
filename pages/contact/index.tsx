import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className='prose m-auto text-center'>
      <h2>Contact</h2>

      <p>Got a question? Send us a message and we’ll get back to you ASAP. We promise!</p>

      <div>
        Instagram:{' '}
        <Link href='https://www.instagram.com/loveedith.ph'>
          <a style={{ textDecoration: 'none' }}>@loveedith.ph</a>
        </Link>
      </div>
      <div>
        Email:{' '}
        <Link href='mailto:hello@love-edith.com?subject = Question&body = '>
          <a style={{ textDecoration: 'none' }}>hello@love-edith.com</a>
        </Link>
      </div>
    </div>
  );
}
