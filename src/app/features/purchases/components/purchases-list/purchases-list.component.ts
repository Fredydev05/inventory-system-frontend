import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridOptions, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { PurchaseOrder } from '../../models/purchase.model';
import { PurchaseService } from '../../services/purchase.service';

@Component({
  selector: 'app-purchases-list',
  standalone: true,
  host: { ngSkipHydration: 'true' },
  imports: [
    CommonModule,
    AgGridAngular,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzSkeletonModule
  ],
  templateUrl: './purchases-list.component.html',
  styleUrl: './purchases-list.component.scss'
})
export class PurchasesListComponent implements OnInit {
  loading = signal(false);
  rowData = signal<PurchaseOrder[]>([]);

  private gridApi?: GridApi<PurchaseOrder>;
  private purchaseService = inject(PurchaseService);
  private message = inject(NzMessageService);

  colDefs: ColDef<PurchaseOrder>[] = [
    {
      field: 'order_number',
      headerName: 'Nº Orden',
      width: 150,
      pinned: 'left',
      filter: 'agTextColumnFilter',
      floatingFilter: true
    },
    {
      headerName: 'Proveedor',
      width: 220,
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      valueGetter: params => params.data?.supplier?.name || '-',
      cellClass: 'cell-ellipsis'
    },
    {
      field: 'date',
      headerName: 'Fecha',
      width: 130,
      valueFormatter: params => params.value ? new Date(params.value).toLocaleDateString('es-ES') : '-'
    },
    {
      field: 'total_amount',
      headerName: 'Total',
      width: 130,
      type: 'numericColumn',
      valueFormatter: params => '$' + (parseFloat(params.value) || 0).toFixed(2)
    },
    {
      field: 'status',
      headerName: 'Estado',
      width: 160,
      cellRenderer: (params: ICellRendererParams<PurchaseOrder>) => {
        const statusMap: Record<string, { label: string; bg: string; color: string; border: string }> = {
          PENDING:         { label: 'Pendiente',        bg: '#fffbe6', color: '#ad6800', border: '#ffe58f' },
          PENDING_RECEIPT: { label: 'Pend. Recepción',  bg: '#e6f4ff', color: '#0958d9', border: '#91caff' },
          COMPLETED:       { label: 'Completada',       bg: '#f6ffed', color: '#52c41a', border: '#b7eb8f' },
          CANCELLED:       { label: 'Cancelada',        bg: '#fff1f0', color: '#ff4d4f', border: '#ffa39e' }
        };
        const s = statusMap[params.value] ?? { label: params.value, bg: '#f5f5f5', color: '#595959', border: '#d9d9d9' };
        return `<span style="padding:4px 12px;border-radius:999px;font-size:12px;font-weight:600;background:${s.bg};color:${s.color};border:1px solid ${s.border}">${s.label}</span>`;
      }
    }
  ];

  gridOptions: GridOptions<PurchaseOrder> = {
    theme: 'legacy',
    defaultColDef: { sortable: true, resizable: true, filter: true, minWidth: 100 },
    pagination: true,
    paginationPageSize: 20,
    paginationPageSizeSelector: [10, 20, 50, 100],
    animateRows: true,
    onGridSizeChanged: params => params.api.sizeColumnsToFit()
  };

  ngOnInit(): void {
    this.loading.set(true);
    this.purchaseService.getPurchaseOrders().subscribe({
      next: orders => {
        this.rowData.set(orders);
        this.loading.set(false);
      },
      error: () => {
        this.message.error('Error al cargar las compras');
        this.loading.set(false);
      }
    });
  }

  onGridReady(params: GridReadyEvent<PurchaseOrder>): void {
    this.gridApi = params.api;
    params.api.sizeColumnsToFit();
  }

  onQuickFilterChanged(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.gridApi?.setGridOption('quickFilterText', value);
  }
}
