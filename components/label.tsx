import React from 'react';

export function Label({
  children,
  ...props
}: Omit<React.PropsWithChildren<React.HTMLProps<HTMLLabelElement>>, 'className'>) {
  return (
    <label className='block mb-1 text-sm' {...props}>
      {children}
    </label>
  );
}
