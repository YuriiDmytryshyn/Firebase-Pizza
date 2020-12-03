import { Pipe, PipeTransform } from '@angular/core';
import { ICategory } from '../interfaces/category.interface';

@Pipe({
  name: 'searchCategory'
})
export class SearchCategoryPipe implements PipeTransform {

  transform(value: Array<ICategory>, field: string): Array<ICategory> {
    if (!field) {
      return value;
    };
    if (!value) {
      return [];
    };
    return value.filter(cat => cat.name.toLowerCase().includes(field.toLowerCase()));
  }

}
