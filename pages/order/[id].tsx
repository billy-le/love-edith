import { useRouter } from 'next/router';

import { useQuery, gql } from '@apollo/client';

import Spinner from '@components/spinner';

const QUERY = gql`
  query FindOrder($orderNumber: String!) {
    orders(where: { order_number: $orderNumber }) {
      order_number
      status
      items
    }
  }
`;

export default function Order(props: any) {
  const router = useRouter();
  const { id } = router.query;

  const { data, loading, error } = useQuery(QUERY, {
    variables: {
      orderNumber: id,
    },
  });

  if (loading) {
    return <Spinner />;
  }

  if (!data) {
    return <p>No such order number</p>;
  }

  const { orders } = data;

  return orders.map((order: any) => (
    <div key={order.order_number}>
      <p className='text-2xl font-bold'>STATUS: {order.status}</p>
      {order.items.map((item: any, index: number) => (
        <div className='flex space-x-4' key={index}>
          <p>Product: {item.name}</p>
          <p>Size: {item.size}</p>
          <p>Color: {item.color}</p>
          <p>Qty: {item.qty}</p>
        </div>
      ))}
    </div>
  ));
}
