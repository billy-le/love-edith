import { useState } from 'react';
import Link from 'next/link';
import { CSSProperties } from 'react';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Icon } from 'components/icon';

const links = ['shop', 'faq', 'contact'];

interface Props {
  className?: string;
  style?: CSSProperties;
}

export function Nav(props: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { className = '', style = {} } = props;

  function handleMenuToggle() {
    setIsOpen(!isOpen);
  }
  return (
    <nav className={className} style={style}>
      <Icon className='inline-block h-8 w-8 sm:hidden' icon={faBars} onClick={handleMenuToggle} size='2x' />
      <ul
        className={`${
          isOpen ? 'absolute' : 'hidden'
        } shadow-lg flex-col sm:flex sm:flex-row justify-between items-center sm:space-x-8 sm:shadow-none`}
      >
        {links.map((link) => {
          return (
            <li key={link} className={` bg-white p-4 sm:bg-transparent sm:p-0`}>
              <Link href={link === 'shop' ? '/products' : '/' + link}>
                <a className='uppercase font-medium text-lg' onClick={() => setIsOpen(false)}>
                  <h2>{link}</h2>
                </a>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
