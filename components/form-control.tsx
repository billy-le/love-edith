import React from 'react';

export function FormControl({ children, ...props }: React.PropsWithChildren<React.HTMLProps<HTMLDivElement>>) {
  return <div {...props}>{children}</div>;
}
