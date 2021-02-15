import { forwardRef } from 'react';

interface Props extends React.HTMLProps<HTMLSelectElement> {
  error: string;
}

export const Select = forwardRef((props: Props, ref: any) => {
  const { error, className, ...otherProps } = props;
  return (
    <select
      ref={ref}
      className={`py-1 px-2 ${
        error ? 'border-red-400' : 'border-black'
      } border-solid border-2 rounded-sm w-full ${className}`}
      {...otherProps}
    >
      {props.children}
    </select>
  );
});
