import React from 'react';

export function Label({
  children,
  className = '',
  ...props
}: React.PropsWithChildren<React.HTMLProps<HTMLLabelElement>>) {
  return (
    <label className={`block mb-1 ${className}`} {...props}>
      {children}
    </label>
  );
}
