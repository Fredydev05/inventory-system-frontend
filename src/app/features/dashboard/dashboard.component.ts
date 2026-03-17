import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzProgressModule } from 'ng-zorro-antd/progress';

interface StatCard {
  title: string;
  value: number;
  prefix: string;
  note: string;
  icon: string;
  accent: boolean;
}

interface AnalyticsBar {
  day: string;
  value: number;
}

interface TeamMember {
  name: string;
  task: string;
  status: 'Completado' | 'En Progreso' | 'Pendiente';
  avatar: string;
  color: string;
}

interface RecentActivity {
  title: string;
  date: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzStatisticModule,
    NzGridModule,
    NzIconModule,
    NzButtonModule,
    NzAvatarModule,
    NzBadgeModule,
    NzTagModule,
    NzProgressModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  statistics = signal<StatCard[]>([]);
  analyticsData = signal<AnalyticsBar[]>([]);
  teamMembers = signal<TeamMember[]>([]);
  recentActivities = signal<RecentActivity[]>([]);
  currentTime = signal('00:00:00');
  inventoryProgress = signal(68);

  private timerInterval: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.loadStatistics();
    this.loadAnalytics();
    this.loadTeamMembers();
    this.loadRecentActivities();
    this.startClock();
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  private startClock(): void {
    this.updateTime();
    this.timerInterval = setInterval(() => this.updateTime(), 1000);
  }

  private updateTime(): void {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    const s = now.getSeconds().toString().padStart(2, '0');
    this.currentTime.set(`${h}:${m}:${s}`);
  }

  loadStatistics(): void {
    this.statistics.set([
      {
        title: 'Total Productos',
        value: 245,
        prefix: '',
        note: 'Incrementó desde el mes pasado',
        icon: 'rise',
        accent: true
      },
      {
        title: 'Ventas del Mes',
        value: 18500,
        prefix: '$',
        note: 'Incrementó desde el mes pasado',
        icon: 'rise',
        accent: false
      },
      {
        title: 'Compras del Mes',
        value: 12,
        prefix: '',
        note: 'Incrementó desde el mes pasado',
        icon: 'rise',
        accent: false
      },
      {
        title: 'Bajo Stock',
        value: 8,
        prefix: '',
        note: 'En revisión',
        icon: 'warning',
        accent: false
      }
    ]);
  }

  loadAnalytics(): void {
    this.analyticsData.set([
      { day: 'L', value: 45 },
      { day: 'M', value: 72 },
      { day: 'X', value: 58 },
      { day: 'J', value: 85 },
      { day: 'V', value: 40 },
      { day: 'S', value: 30 },
      { day: 'D', value: 20 }
    ]);
  }

  loadTeamMembers(): void {
    this.teamMembers.set([
      {
        name: 'Ana García',
        task: 'Registro de Productos Nuevos',
        status: 'Completado',
        avatar: 'A',
        color: '#2D6A4F'
      },
      {
        name: 'Carlos López',
        task: 'Auditoría de Inventario General',
        status: 'En Progreso',
        avatar: 'C',
        color: '#E76F51'
      },
      {
        name: 'María Rodríguez',
        task: 'Actualización de Precios',
        status: 'Pendiente',
        avatar: 'M',
        color: '#264653'
      },
      {
        name: 'David Fernández',
        task: 'Control de Calidad de Stock',
        status: 'En Progreso',
        avatar: 'D',
        color: '#F4A261'
      }
    ]);
  }

  loadRecentActivities(): void {
    this.recentActivities.set([
      {
        title: 'Actualizar Catálogo',
        date: '26 Nov, 2024',
        icon: 'sync',
        color: '#2D6A4F'
      },
      {
        title: 'Registrar Compra',
        date: '28 Nov, 2024',
        icon: 'shopping-cart',
        color: '#E76F51'
      },
      {
        title: 'Generar Reporte',
        date: '30 Nov, 2024',
        icon: 'file-text',
        color: '#264653'
      },
      {
        title: 'Optimizar Stock',
        date: '5 Dic, 2024',
        icon: 'thunderbolt',
        color: '#F4A261'
      },
      {
        title: 'Verificar Entregas',
        date: '6 Dic, 2024',
        icon: 'check-circle',
        color: '#E9C46A'
      }
    ]);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Completado': return '#2D6A4F';
      case 'En Progreso': return '#E76F51';
      case 'Pendiente': return '#F4A261';
      default: return '#9CA3AF';
    }
  }

  getMaxAnalyticsValue(): number {
    return Math.max(...this.analyticsData().map(d => d.value));
  }
}
