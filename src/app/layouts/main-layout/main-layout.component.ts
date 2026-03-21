import { Component, signal, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzInputModule } from 'ng-zorro-antd/input';
import { AuthService } from '../../core/services/auth.service';

interface MenuItem {
  icon: string;
  title: string;
  route: string;
  badge?: number;
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
    NzBadgeModule,
    NzInputModule
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  isCollapsed = signal(false);

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  menuItems: MenuItem[] = [
    { icon: 'dashboard', title: 'Dashboard', route: '/dashboard' },
    { icon: 'shopping', title: 'Productos', route: '/products', badge: 124 },
    { icon: 'team', title: 'Clientes', route: '/customers' },
    { icon: 'shopping-cart', title: 'Compras', route: '/purchases' },
    { icon: 'file-text', title: 'Ventas', route: '/sales' },
    { icon: 'stock', title: 'Inventario', route: '/inventory' }
  ];

  generalItems: MenuItem[] = [
    { icon: 'setting', title: 'Configuración', route: '/settings' },
    { icon: 'question-circle', title: 'Ayuda', route: '/help' },
    { icon: 'logout', title: 'Cerrar Sesión', route: '/logout' }
  ];

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    if (event.ctrlKey && event.key === 'f') {
      event.preventDefault();
      this.searchInput?.nativeElement?.focus();
    }
    if (event.key === 'Escape') {
      this.searchInput?.nativeElement?.blur();
    }
  }

  isActiveRoute(route: string): boolean {
    return this.router.url === route || this.router.url.startsWith(route + '/');
  }

  onMenuClick(item: MenuItem): void {
    this.router.navigate([item.route]);
  }

  onGeneralClick(item: MenuItem): void {
    if (item.route === '/logout') {
      this.logout();
    } else {
      this.router.navigate([item.route]);
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
