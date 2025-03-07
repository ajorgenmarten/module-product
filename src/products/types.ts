import { TMeasureAcronym } from '../measures';
import { Product } from './product';

export interface RawMaterial {
  product: Product;
  quantity: number;
  measure: TMeasureAcronym;
}
