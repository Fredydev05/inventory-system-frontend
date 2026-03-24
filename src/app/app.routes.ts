import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: '',
    loadComponent: () => import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'products',
        loadChildren: () => import('./features/products/products.routes').then(m => m.productsRoutes)
      },
      {
        path: 'customers',
        loadChildren: () => import('./features/customers/customers.routes').then(m => m.customersRoutes)
      },
      {
        path: 'purchases',
        loadChildren: () => import('./features/purchases/purchases.routes').then(m => m.purchasesRoutes)
      },
      {
        path: 'sales',
        loadChildren: () => import('./features/sales/sales.routes').then(m => m.salesRoutes)
      },
      {
        path: 'inventory',
        loadChildren: () => import('./features/inventory/inventory.routes').then(m => m.inventoryRoutes)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
