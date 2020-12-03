import { Component, OnInit, TemplateRef } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { Product } from 'src/app/shared/classes/product.model';
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { CategiriesService } from 'src/app/shared/services/categiries.service';
import { ProductsService } from 'src/app/shared/services/products.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss']
})
export class AdminProductsComponent implements OnInit {

  adminCategories: Array<ICategory> = [];
  currentCategory: ICategory;

  modalRef: BsModalRef;
  uploadPercent: Observable<number>;
  addModalHeight = 460;
  fileUploaded = false;
  dynamic: number = 0;
  Status: boolean;
  searchProduct: string;

  adminProducts: Array<IProduct> = [];
  productID: number | string;
  productCategory: string;
  productName: string;
  productDescription: string;
  productPrice: number;
  productImage: string;
  productCount = 1;

  constructor(
    private modalService: BsModalService,
    private categoryService: CategiriesService,
    private productService: ProductsService,
    private storage: AngularFireStorage
  ) { }

  ngOnInit(): void {
    this.getCategories();
    this.getProducts();
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

  setCategory(): void {
    this.currentCategory = this.adminCategories.filter(category =>
      category.name === this.productCategory)[0];
  };

  private getProducts(): void {
    this.productService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.adminProducts = data;
    });
  };

  addProduct(): void {
    this.Status = false;
    const newProd = new Product(
      1,
      this.currentCategory,
      this.productName,
      this.productDescription,
      this.productPrice,
      this.productImage,
      this.productCount,
    );
    delete newProd.id;
    this.productService.create(newProd);
    this.productName = '';
    this.productDescription = '';
    this.productPrice = null;
    this.productCategory = '';
    this.productImage = '';
  };
  
  selectProduct(prod: IProduct): void {
    this.productID = prod.id;
  };

  deleteProduct(): void {
    this.productService.delete(this.productID.toString())
      .then(() => {
        console.log('The product was updated successfully!');
      })
      .catch(err => console.log(err));
  };

  editProduct(prod: IProduct): void {
    this.Status = true;
    this.currentCategory = prod.category;
    this.productID = prod.id;
    this.productCategory = this.currentCategory.name;
    this.productName = prod.name;
    this.productDescription = prod.description;
    this.productPrice = prod.price;
    this.productImage = prod.image;
  };

  saveProduct(): void {
    const upProduct = {
      id: this.productID,
      category: this.currentCategory,
      name: this.productName,
      description: this.productDescription,
      price: this.productPrice,
      image: this.productImage,
    };
    this.productService.update(upProduct.id.toString(), upProduct)
      .then(() => console.log('The product was updated successfully!'))
      .catch(err => console.log(err));
    this.resetForm();
  };

  uploadFile(event): void {
    const file = event.target.files[0];
    const filePath = `images/${file.name}`;
    const ref = this.storage.ref(filePath);
    const task = ref.put(file);
    this.uploadPercent = task.percentageChanges();
    this.uploadPercent.subscribe(data => {
      if (data === 100) {
        this.dynamic = 100;
      }
    });
    task.then(image => {
      this.storage.ref(`images/${image.metadata.name}`).getDownloadURL().subscribe(url => {
        this.productImage = url;
        this.addModalHeight = 490;
        this.fileUploaded = true;
      });
    });
  };

  openModalAdd(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  };

  openModalDelete(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  };

  private resetForm(): void {
    this.Status = false;
    this.productName = '';
    this.productDescription = '';
    this.productPrice = null;
    this.productCategory = '';
    this.productImage = '';
    this.fileUploaded = false;
    this.dynamic = 0;
  }

}
