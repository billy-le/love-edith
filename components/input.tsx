import { useMemo, forwardRef } from 'react';
import { FieldError } from 'react-hook-form';

interface Props extends React.HTMLProps<HTMLInputElement> {
  error?: FieldError;
}

export const Input = forwardRef((props: Props, ref: any) => {
  const { error, className, ...otherProps } = props;

  const errorMessage = useMemo(() => {
    if (error?.message) {
      return error.message.slice(0, 1).toUpperCase().concat(error.message.slice(1));
    } else null;
  }, [error]);

  return (
    <div className='relative'>
      <input
        ref={ref}
        className={`block py-1 px-2 ${
          error ? 'border-red-400' : 'border-black'
        } border-solid border rounded-sm w-full ${className}`}
        {...otherProps}
      />
      {error?.message && (
        <p className='absolute text-xs tw-mt-1 text-red-400' style={{ bottom: -16 }}>
          {errorMessage}
        </p>
      )}
    </div>
  );
});
