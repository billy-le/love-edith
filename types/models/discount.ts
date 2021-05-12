import { StrapiCommon } from './_common';

export interface Discount extends StrapiCommon {
  name: string;
  expiration_date: string;
  discount_percent: number;
}
