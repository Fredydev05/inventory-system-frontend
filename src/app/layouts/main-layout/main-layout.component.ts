import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
// import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { AuthService } from '../../core/services/auth.service';

interface MenuItem {
  icon: string;
  title: string;
  route: string;
}

interface Tab {
  title: string;
  route: string;
  closable: boolean;
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    NzDropDownModule,
    NzAvatarModule,
    NzBadgeModule
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  isCollapsed = signal(false);
  selectedIndex = signal(0);

  menuItems: MenuItem[] = [
    { icon: 'dashboard', title: 'Dashboard', route: '/dashboard' },
    { icon: 'shopping', title: 'Productos', route: '/products' },
    { icon: 'team', title: 'Clientes', route: '/customers' },
    { icon: 'shopping-cart', title: 'Compras', route: '/purchases' },
    { icon: 'file-text', title: 'Ventas', route: '/sales' },
    { icon: 'stock', title: 'Inventario', route: '/inventory' }
  ];

  openTabs = signal<Tab[]>([
    { title: 'Dashboard', route: '/dashboard', closable: false }
  ]);

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  onMenuClick(item: MenuItem): void {
    this.router.navigate([item.route]);
  }

  logout(): void {
    this.authService.logout();
  }
}
