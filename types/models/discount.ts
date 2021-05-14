import { StrapiCommon } from './_common';

import { Category } from 'types/models/category';
import { Product } from 'types/models/product';
import { Variant } from 'types/models/variant';
import { Set } from 'types/models/set';
export interface Discount extends StrapiCommon {
  amount: number;
  details: string;
  expiration_date: string;
  free_shipping_threshold: number;
  is_featured: boolean;
  is_free_shipping: boolean;
  name: string;
  percent_discount: number;
  amount_threshold: number;
  percent_discount_threshold: number;
  sets: Set[];
  products: Product[];
  categories: Category[];
  variants: Variant[];
}
