import { Pipe, PipeTransform } from '@angular/core';
import { IProduct } from '../interfaces/product.interface';

@Pipe({
  name: 'searchProduct'
})
export class SearchProductPipe implements PipeTransform {

  transform(value: Array<IProduct>, field: string): Array<IProduct> {
    if (!field) {
      return value;
    };
    if (!value) {
      return [];
    };
    return value.filter(cat => cat.name.toLowerCase().includes(field.toLowerCase()));
  }

}
