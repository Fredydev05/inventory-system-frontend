import { Routes } from '@angular/router';

export const purchasesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/purchases-list/purchases-list.component').then(m => m.PurchasesListComponent)
  }
];
