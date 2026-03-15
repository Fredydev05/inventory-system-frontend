import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';

interface Statistic {
  title: string;
  value: number;
  prefix: string;
  suffix?: string;
  valueStyle: any;
  icon: string;
  iconColor: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzStatisticModule,
    NzGridModule,
    NzIconModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  statistics = signal<Statistic[]>([]);

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.statistics.set([
      {
        title: 'Total Productos',
        value: 245,
        prefix: '',
        valueStyle: { color: '#3f8600' },
        icon: 'shopping',
        iconColor: '#52c41a'
      },
      {
        title: 'Ventas del Mes',
        value: 18500,
        prefix: '$',
        valueStyle: { color: '#cf1322' },
        icon: 'dollar-circle',
        iconColor: '#f5222d'
      },
      {
        title: 'Clientes Activos',
        value: 127,
        prefix: '',
        valueStyle: { color: '#1890ff' },
        icon: 'team',
        iconColor: '#1890ff'
      },
      {
        title: 'Productos Bajo Stock',
        value: 12,
        prefix: '',
        valueStyle: { color: '#faad14' },
        icon: 'warning',
        iconColor: '#fa8c16'
      }
    ]);
  }
}
