import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridOptions } from 'ag-grid-community';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Customer } from '../models/customer.model';
import { CustomerService } from '../services/customer.service';

@Component({
  selector: 'app-customers-list',
  standalone: true,
  imports: [CommonModule, AgGridAngular, NzButtonModule, NzInputModule, NzIconModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1>Gestión de Clientes</h1>
          <p>Administra los clientes del sistema</p>
        </div>
        <button nz-button nzType="primary">
          <span nz-icon nzType="plus"></span>
          Nuevo Cliente
        </button>
      </div>
      <div class="grid-wrapper">
        <ag-grid-angular
          class="ag-theme-alpine"
          style="width: 100%; height: 600px;"
          [rowData]="rowData()"
          [columnDefs]="colDefs"
          [gridOptions]="gridOptions"
        />
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      height: 100%;
      padding: 24px;
      display: flex;
      flex-direction: column;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 16px;
      h1 { font-size: 24px; font-weight: 600; margin-bottom: 4px; }
      p { color: #8c8c8c; margin: 0; }
    }
    .grid-wrapper { flex: 1; }
  `]
})
export class CustomersListComponent implements OnInit {
  loading = signal(false);
  rowData = signal<Customer[]>([]);

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
    defaultColDef: { sortable: true, resizable: true, filter: true },
    pagination: true,
    paginationPageSize: 20,
    animateRows: true
  };

  constructor(
    private customerService: CustomerService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.customerService.getCustomers().subscribe({
      next: (customers) => this.rowData.set(customers),
      error: () => this.message.error('Error al cargar clientes')
    });
  }
}
