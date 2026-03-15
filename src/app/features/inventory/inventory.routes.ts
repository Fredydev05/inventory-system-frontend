import { Routes } from '@angular/router';

export const inventoryRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/stock-movements/stock-movements-list.component').then(m => m.StockMovementsListComponent)
  }
];
