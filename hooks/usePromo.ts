import { useQuery, gql } from '@apollo/client';
import { format } from 'date-fns';
import { Discount } from 'types/models';

const QUERY = gql`
  query PromoQuery($currentDate: String!) {
    discounts(where: { expiration_date_gt: $currentDate, is_featured: true }) {
      id
      name
      amount
      amount_threshold
      details
      expiration_date
      free_shipping_threshold
      is_free_shipping
      percent_discount
      percent_discount_threshold
      categories {
        id
      }
      products {
        id
      }
      sets {
        id
      }
      variants {
        id
      }
    }
  }
`;

export function usePromo() {
  const now = new Date();
  const currentDate = format(now, 'yyyy-MM-dd');
  const { data, loading, error } = useQuery<{ discounts: Discount[] }>(QUERY, {
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
