import { Routes } from '@angular/router';

export const customersRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/customers-list.component').then(m => m.CustomersListComponent)
  }
];
