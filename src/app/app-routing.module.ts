import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin/admin.component';
import { AdminBlogsComponent } from './admin/admin-blogs/admin-blogs.component';
import { AdminCategoryComponent } from './admin/admin-category/admin-category.component';
import { AdminProductsComponent } from './admin/admin-products/admin-products.component';
import { AboutComponent } from './pages/about/about.component';
import { BlogComponent } from './pages/blog/blog.component';
import { BlogDetailsComponent } from './pages/blog-details/blog-details.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
import { BasketComponent } from './pages/basket/basket.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ProfileGuard } from './shared/guards/profile.guard';
import { AdminGuard } from './shared/guards/admin.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'menu/:category', component: ProductsComponent },
  { path: 'menu/:category/:id', component: ProductDetailsComponent},
  { path: 'products/:id', component: ProductDetailsComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'blog/:id', component: BlogDetailsComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [ProfileGuard] },
  { path: 'about', component: AboutComponent },
  {
    path: 'admin', component: AdminComponent, canActivate: [AdminGuard], children: [
      { path: '', pathMatch: 'full', redirectTo: 'admin-category' },
      { path: 'admin-category', component: AdminCategoryComponent },
      { path: 'admin-products', component: AdminProductsComponent },
      { path: 'admin-blogs', component: AdminBlogsComponent },

    ]
  },
  { path: 'basket', component: BasketComponent },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
