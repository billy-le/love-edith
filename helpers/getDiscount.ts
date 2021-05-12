import { isBefore } from 'date-fns';

// interfaces
import { Discount } from 'types/models';

export function getDiscount(discount: Discount) {
  return isBefore(new Date(), new Date(discount.expiration_date));
}
