import { StrapiCommon } from './_common';
import { Image } from './image';

export interface ProductImage extends StrapiCommon {
  name: string;
  images: Image[];
}
