import { Routes } from '@angular/router';

export const salesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/invoices/invoices-list.component').then(m => m.InvoicesListComponent)
  }
];
