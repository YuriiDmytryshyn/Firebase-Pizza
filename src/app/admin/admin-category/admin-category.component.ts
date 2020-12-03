import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Category } from 'src/app/shared/classes/category.model';
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { CategiriesService } from 'src/app/shared/services/categiries.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.scss']
})
export class AdminCategoryComponent implements OnInit {

  adminCategories: Array<ICategory> = [];
  categoryID: number | string;
  modalRef: BsModalRef;
  inputCategory: string;
  disabledStatys = true;
  Status = false;
  searchCategory: string;

  constructor(
    private modalService: BsModalService,
    private categoryService: CategiriesService
  ) { }

  ngOnInit(): void {
    this.getCategories();
  }

  private getCategories(): void {
    this.categoryService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.adminCategories = data;
    });
  };

  addCategory(): void {
    const newCategory = new Category(1, this.inputCategory);
    delete newCategory.id;
    this.categoryService.create(newCategory).then(() => {
      console.log('Created new category successfully!');
    });
    this.resetForm();
  };

  deleteCategory(category: ICategory): void {
    this.categoryID = category.id;
  };

  delCategory(): void {
    this.categoryService.delete(this.categoryID.toString())
      .then(() => {
        console.log('The product was updated successfully!');
      })
      .catch(err => console.log(err));
  }

  editCategory(category: ICategory): void {
    this.Status = true;
    this.categoryID = category.id;
    this.inputCategory = category.name;
  };

  saveCategory(): void {
    const updateCategory = {
      id: this.categoryID,
      name: this.inputCategory
    };
    this.categoryService.update(updateCategory.id.toString(), updateCategory)
      .then(() => console.log('The product was updated successfully!'))
      .catch(err => console.log(err));
    this.resetForm();
  };

  changeInp(): void {
    if (this.inputCategory.length > 0) {
      this.disabledStatys = false;
    } else {
      this.disabledStatys = true;
    }
  };

  openModal(template: TemplateRef<any>) {
    this.Status = false;
    this.modalRef = this.modalService.show(template);
  };

  openModa(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  };

  private resetForm(): void {
    this.inputCategory = '';
    this.disabledStatys = true;
  };

}
