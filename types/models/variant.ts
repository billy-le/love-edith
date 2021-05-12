import { StrapiCommon } from './_common';
import { Color } from './color';
import { Size } from './size';

export interface Variant extends StrapiCommon {
  name: string;
  qty: number;
  color: Color;
  size: Size;
}
