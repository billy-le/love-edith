import { forwardRef } from 'react';

interface Props extends React.HTMLProps<HTMLInputElement> {
  error: string;
}

export const Input = forwardRef((props: Props, ref: any) => {
  const { error, className, ...otherProps } = props;

  return (
    <input
      ref={ref}
      className={`block text-xs py-1 px-2 ${
        error ? 'border-red-400' : 'border-black'
      } border-solid border rounded-sm w-full ${className}`}
      {...otherProps}
    />
  );
});
