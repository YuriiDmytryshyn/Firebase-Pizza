import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { OrderService } from 'src/app/shared/services/order.service';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {

  basket: Array<IProduct> = [];
  totalPrice = 0;
  modalRef: BsModalRef;
  DeleteStatus: false;
  productIndex: number = null;

  constructor(
    private orderService: OrderService,
    private modalService: BsModalService,
  ) { }

  ngOnInit(): void {
    this.getLocalProducts();
  }

  private getLocalProducts(): void {
    if (localStorage.getItem('basket')) {
      this.basket = JSON.parse(localStorage.getItem('basket'));
      this.totalPrice = this.getTotal(this.basket);
    }
  };

  private getTotal(products: Array<IProduct>): number {
    return products.reduce((total, prod) => total + (prod.price * prod.count), 0);
  };

  prodCount(prod: IProduct, status: boolean): void {
    if (status) {
      prod.count++;
    } else {
      if (prod.count > 1) {
        prod.count--;
      }
    }
    this.totalPrice = this.getTotal(this.basket);
    this.orderService.basket.next(this.basket);
    localStorage.setItem('basket', JSON.stringify(this.basket));
  };

  indexProduct(product: IProduct): void {
    this.productIndex = this.basket.findIndex(prod => prod.id === product.id);
  };

  deleteProduct(): void {
    console.log(this.productIndex);
    this.basket.splice(this.productIndex, 1);
    this.productIndex = null;
    this.totalPrice = this.getTotal(this.basket);
    this.orderService.basket.next(this.basket);
    localStorage.setItem('basket', JSON.stringify(this.basket));
  };

  closeModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  };

}
