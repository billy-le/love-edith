import React, { forwardRef } from 'react';

interface Props extends React.HTMLProps<HTMLTextAreaElement> {}

export const TextArea = forwardRef((props: Props, ref: any) => {
  const { className, ...otherProps } = props;
  return (
    <textarea
      ref={ref}
      className={`text-xs block py-1 px-2 border-black border-solid border rounded-sm w-full ${className}`}
      {...otherProps}
    />
  );
});
