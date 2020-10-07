import Link from 'next/link';
import { CSSProperties } from 'react';

const links = ['shop', 'about', 'faq'];

interface Props {
  className?: string;
  style?: CSSProperties;
}

export function Nav(props: Props) {
  const { className = '', style = {} } = props;
  return (
    <nav className={className} style={style}>
      <ul className='flex justify-between items-center'>
        {links.map((link, index) => {
          const isNotLast = index !== links.length - 1;
          return (
            <li key={link} className={isNotLast ? 'mr-8' : ''}>
              <Link href={'/' + link}>
                <a>{link}</a>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
