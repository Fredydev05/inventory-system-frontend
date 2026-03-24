import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { Customer } from '../models/customer.model';
import { CustomerService } from '../services/customer.service';

@Component({
  selector: 'app-customers-list',
  standalone: true,
  host: { ngSkipHydration: 'true' },
  imports: [CommonModule, AgGridAngular, NzButtonModule, NzInputModule, NzIconModule, NzSkeletonModule],
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss']
})
export class CustomersListComponent implements OnInit {
  loading = signal(false);
  rowData = signal<Customer[]>([]);
  private gridApi?: GridApi<Customer>;

  colDefs: ColDef<Customer>[] = [
    { field: 'document_number', headerName: 'RUC/DNI', width: 130, pinned: 'left' },
    { field: 'name', headerName: 'Cliente', width: 250 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Teléfono', width: 150 },
    { field: 'credit_limit', headerName: 'Límite Crédito', width: 150, valueFormatter: params => '$' + (parseFloat(params.value) || 0).toFixed(2) },
    {
      field: 'is_active',
      headerName: 'Estado',
      width: 120,
      cellRenderer: (params: any) => params.value ?
        '<span style="color: #52c41a;">Activo</span>' :
        '<span style="color: #ff4d4f;">Inactivo</span>'
    }
  ];

  gridOptions: GridOptions = {
    theme: 'legacy',
    defaultColDef: { sortable: true, resizable: true, filter: true, minWidth: 100 },
    pagination: true,
    paginationPageSize: 20,
    animateRows: true,
    onGridSizeChanged: params => params.api.sizeColumnsToFit()
  };

  constructor(
    private customerService: CustomerService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loading.set(true);
    this.customerService.getCustomers().subscribe({
      next: (customers) => {
        this.rowData.set(customers);
        this.loading.set(false);
      },
      error: () => {
        this.message.error('Error al cargar clientes');
        this.loading.set(false);
      }
    });
  }

  onGridReady(params: GridReadyEvent<Customer>): void {
    this.gridApi = params.api;
    params.api.sizeColumnsToFit();
  }

  onQuickFilterChanged(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.gridApi?.setGridOption('quickFilterText', value);
  }
}
