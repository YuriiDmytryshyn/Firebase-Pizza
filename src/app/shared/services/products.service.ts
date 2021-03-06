
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { IProduct } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private dbPath = '/products';
  productsRef: AngularFirestoreCollection<IProduct> = null;

  constructor(
    private db: AngularFirestore
  ) {
    this.productsRef = this.db.collection(this.dbPath);
  }

  getAll(): AngularFirestoreCollection<IProduct> {
    return this.productsRef;
  }

  getAllCategory(categoryName: string): any {
    return this.productsRef.ref.where('category.name', '==', categoryName);
  }

  create(category: IProduct): any {
    return this.productsRef.add({ ...category });
  }

  update(id: string, data: any): Promise<void> {
    return this.productsRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.productsRef.doc(id).delete();
  }

  getSingleProduct(id: string): any {
    return this.productsRef.doc(id).get();
  }
}
