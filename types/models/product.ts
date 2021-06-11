import { Variant } from './variant';
import { ProductImage } from './product-image';
import { Category } from './category';
import { Discount } from './discount';

export interface Product {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  is_featured: boolean;
  is_sold_out: boolean;
  is_preorder: boolean;
  is_discontinued: boolean;
  price: number;
  slug: string;
  size_chart: string;
  description: string;
  fabric_and_care: string;
  published_at: string;
  variants: Variant[];
  product_images: ProductImage[];
  categories: Category[];
  discounts: Discount[];
}
