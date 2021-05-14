import { StrapiCommon } from 'types/models/_common';
import { Discount } from 'types/models/discount';
import { Product } from 'types/models/product';

export interface Set extends StrapiCommon {
  name: string;
  description: string;
  slug: string;
  products: Product[];
  discounts: Discount[];
}
