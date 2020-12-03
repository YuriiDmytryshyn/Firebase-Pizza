import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CategiriesService } from 'src/app/shared/services/categiries.service';
import { OrderService } from 'src/app/shared/services/order.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  allCategory: Array<ICategory> = [];
  basket: Array<IProduct> = [];
  totalPrice = 0;
  modalRef: BsModalRef;
  userEmail: string;
  userPassword: string;
  profileImg = 'assets/images/profile-user.svg';
  isLogin = false;
  isAdmin = false;
  isProfile = false;

  constructor(
    private categoryService: CategiriesService,
    private orderService: OrderService,
    private modalService: BsModalService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getCategories();
    this.checkMyBasket();
    this.getLocalProducts();
    this.cheackLocalUser();
    this.checkIfUserLogin()
  }

  private cheackLocalUser(): void {
    if (localStorage.getItem('user')) {
      let currentUser = JSON.parse(localStorage.getItem('user'));
      if (currentUser.role === 'admin' && currentUser != null) {
        this.isLogin = true;
        this.isAdmin = true;
        this.isProfile = false;
      } else if (currentUser.role === 'user' && currentUser != null) {
        this.isLogin = true;
        this.isAdmin = false;
        this.isProfile = true;
      }
    } else {
      this.isLogin = false;
      this.isAdmin = false;
      this.isProfile = false;
    }
  };

  private checkIfUserLogin(): void {
    this.authService.cheackSignIn.subscribe(() => {
      this.cheackLocalUser();
    })
  };

  private checkMyBasket(): void {
    this.orderService.basket.subscribe(
      data => {
        this.basket = data;
        this.totalPrice = this.getTotal(this.basket);
      }
    )
  };

  private getLocalProducts(): void {
    if (localStorage.getItem('basket')) {
      this.basket = JSON.parse(localStorage.getItem('basket'));
      this.totalPrice = this.getTotal(this.basket);
    }
  };

  private getTotal(products: Array<IProduct>): number {
    return products.reduce((total, prod) => total + (prod.price * prod.count), 0);
  };

  private getCategories(): void {
    this.categoryService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.allCategory = data;
    });
  };

  signUpModal(template: TemplateRef<any>): void {
    this.userEmail = '';
    this.userPassword = '';
    this.modalRef = this.modalService.show(template);
  };

  signOutModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  };

  signUpUser(): void {
    if (this.userEmail && this.userPassword) {
      this.authService.signUp(this.userEmail, this.userPassword);
    }
  };

  singInUser(): void {
    if (this.userEmail && this.userPassword) {
      this.authService.signIn(this.userEmail, this.userPassword);
    }
  };

  signOutUser(): void {
    this.authService.signOut();
  };




}
