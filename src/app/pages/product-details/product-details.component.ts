import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { ProductsService } from 'src/app/shared/services/products.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  product: IProduct;

  constructor(
    private activatedRoute: ActivatedRoute,
    private prodService: ProductsService,
    public location: Location) { }

  ngOnInit(): void {
    this.getProd();
  }

  private getProd(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.prodService.getSingleProduct(id).subscribe(
      data => {
        this.product = data.data();
      })
  };

}
