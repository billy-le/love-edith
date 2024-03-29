export default function Spinner() {
  return (
    <div className='flex-grow flex flex-col items-center justify-center'>
      <div className='animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-gray-900 mb-6' />
      <p>Loading... Please wait.</p>
    </div>
  );
}
