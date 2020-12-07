import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { IOrder } from '../interfaces/order.interface';
import { IProduct } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  basket: Subject<Array<IProduct>> = new Subject<Array<IProduct>>();
  private dbPath = '/orders';
  ordersRef: AngularFirestoreCollection<IOrder> = null;

  constructor(
    private db: AngularFirestore
  ) {
    this.ordersRef = this.db.collection(this.dbPath);
  }


  addBasket(product: IProduct): void {
    let localProducts: Array<IProduct> = [];
    if (localStorage.getItem('basket')) {
      localProducts = JSON.parse(localStorage.getItem('basket'));
      if (localProducts.some(prod => prod.id === product.id)) {
        const index = localProducts.findIndex(prod => prod.id === product.id);
        localProducts[index].count += product.count;
      } else {
        localProducts.push(product);
      }
    } else {
      localProducts.push(product);
    }
    localStorage.setItem('basket', JSON.stringify(localProducts));
    this.basket.next(localProducts);
  };

  getAll(): AngularFirestoreCollection<IOrder> {
    return this.ordersRef;
  }

  create(order: IOrder): Promise<DocumentReference<IOrder>>{
    return this.ordersRef.add({ ...order });
  }

}
