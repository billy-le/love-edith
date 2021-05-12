import { StrapiCommon } from './_common';
import { Discount } from './discount';

export interface Category extends StrapiCommon {
  name: string;
  discounts: Discount[];
}
