import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Order } from 'src/app/shared/classes/order.model';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { AuthService } from 'src/app/shared/services/auth.service';
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

  myFirstName: string;
  myLastName: string;
  myCity: string;
  myPhone: string;
  myStreet: string;
  myHouse: string;
  myComments: string;
  currentUser: any = null;

  ba = JSON.parse(localStorage.getItem('basket'));

  constructor(
    private orderService: OrderService,
    private modalService: BsModalService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getLocalProducts();
    this.userCredential();
    console.log(this.currentUser.orders);
    console.log(this.ba);
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

  private userCredential(): void {
    this.currentUser = JSON.parse(localStorage.getItem('user'));
    this.myFirstName = this.currentUser.firstName;
    this.myLastName = this.currentUser.lastName;
    this.myPhone = this.currentUser.phone;
    this.myCity = this.currentUser.city;
    this.myStreet = this.currentUser.street;
    this.myHouse = this.currentUser.house;
  }

  private addOrder(): void {
    const order = new Order(
      this.basket,
      this.myFirstName,
      this.myLastName,
      this.myPhone,
      this.myCity,
      this.myStreet,
      this.myHouse,
      this.totalPrice,
      this.myComments
    );
    this.authService.updateUserOrder(this.currentUser.id, order).then(
      () => {
        this.currentUser.orders.push(this.basket)
        this.updateLocalOrder(order);
        this.basket = [];
        localStorage.removeItem('basket');
        this.orderService.basket.next(this.basket);
        this.totalPrice = 0;
      }
    )
  }

  cheackLocalUser(): void {
    if (this.myFirstName && this.myLastName && this.myCity && this.myPhone && this.myStreet && this.myHouse) {
      if (localStorage.getItem('user')) {
        let user = JSON.parse(localStorage.getItem('user'))
        if (user.firstName != this.myFirstName || user.lastName != this.myLastName || user.phone != this.myPhone || user.city != this.myCity || user.street != this.myStreet || user.house != this.myHouse) {
          const data = {
            firtName: this.myFirstName,
            lastName: this.myLastName,
            city: this.myCity,
            phone: this.myPhone,
            street: this.myStreet,
            house: this.myHouse
          };
          console.log(user.id);
          this.authService.updateUserData(user.id, data).then(
            () => {
              this.updateLocal(data);
              this.addOrder();
            }
          )
        } else {
          this.addOrder();
        }
      } else {
        const order = new Order(
          this.basket,
          this.myFirstName,
          this.myLastName,
          this.myPhone,
          this.myCity,
          this.myStreet,
          this.myHouse,
          this.totalPrice,
          this.myComments
        );
        this.orderService.create(order).then(
          () => {
            this.basket = [];
            localStorage.removeItem('basket');
            this.orderService.basket.next(this.basket);
            this.totalPrice = 0;
          }
        )
      }
    } else {
      console.log('Заповніть усі поля');
    }
  }

  private updateLocal(data): void {
    const local = {
      ...this.currentUser,
      ...data
    };
    localStorage.setItem('user', JSON.stringify(local))
  }

  private updateLocalOrder(order): void {
    const local = {
      ...this.currentUser,
      ...order
    };
    localStorage.setItem('user', JSON.stringify(local))
  }
  
}
