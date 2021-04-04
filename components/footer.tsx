import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer>
      <div className='container mx-auto px-4 py-2 sm:py-4'>
        <div className='flex justify-end items-end space-x-4'>
          <p className='text-xs'>&copy; {year} - All Rights Reserved</p>
          <Link href='https://www.instagram.com/loveedith.ph'>
            <a>
              <FontAwesomeIcon className='cursor-pointer' icon={faInstagram} size='2x' />
            </a>
          </Link>
        </div>
      </div>
    </footer>
  );
}
