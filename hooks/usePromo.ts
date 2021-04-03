import { useQuery, gql } from '@apollo/client';
import { format } from 'date-fns';

const QUERY = gql`
  query PromoQuery($currentDate: String!) {
    promos(where: { expire_gt: $currentDate }) {
      name
      percent_discount
      free_shipping
      free_shipping_threshold
      expire
      details
    }
  }
`;

export function usePromo() {
  const now = new Date();
  const currentDate = format(now, 'yyyy-MM-dd');
  const { data, loading, error } = useQuery(QUERY, {
    variables: {
      currentDate,
    },
  });

  return {
    data,
    loading,
    error,
  };
}
