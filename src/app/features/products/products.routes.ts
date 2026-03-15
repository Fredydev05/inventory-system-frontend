import { Routes } from '@angular/router';

export const productsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/products/products-list.component').then(m => m.ProductsListComponent)
  }
];
