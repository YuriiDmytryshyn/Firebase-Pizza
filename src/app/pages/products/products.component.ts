import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Event, NavigationEnd, Router } from '@angular/router';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { OrderService } from 'src/app/shared/services/order.service';
import { ProductsService } from 'src/app/shared/services/products.service';



@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  products: Array<IProduct> = [];

  constructor(
    private prodService: ProductsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService
  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        const category = this.activatedRoute.snapshot.paramMap.get('category');
        this.getProducts(category);
      }
    })
  }


  ngOnInit(): void {
  }

  private getProducts(category: string): void {
    this.products = []
    this.prodService.getAllCategory(category).onSnapshot(
      snap => {
        snap.forEach(prod => {
          const product = {
            id: prod.id,
            ...prod.data() as IProduct
          };
          this.products.push(product);
        })
      }
    )
  }

  prodCount(prod: IProduct, status: boolean): void {
    if (status) {
      prod.count++;
    } else {
      if (prod.count > 1) {
        prod.count--;
      }
    }
  };

  addToBasket(prod: IProduct): void {
    this.orderService.addBasket(prod);
    prod.count = 1;
  };

}
