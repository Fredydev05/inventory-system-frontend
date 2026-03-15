import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridOptions } from 'ag-grid-community';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Invoice } from '../../models/invoice.model';
import { InvoiceService } from '../../services/invoice.service';

@Component({
  selector: 'app-invoices-list',
  standalone: true,
  imports: [CommonModule, AgGridAngular, NzButtonModule, NzIconModule],
  template: `
    <div style="height: 100%; padding: 24px; display: flex; flex-direction: column;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
        <div><h1 style="font-size: 24px; font-weight: 600;">Facturas de Venta</h1></div>
        <button nz-button nzType="primary"><span nz-icon nzType="plus"></span>Nueva Factura</button>
      </div>
      <ag-grid-angular class="ag-theme-alpine" style="width: 100%; height: 600px;" [rowData]="rowData()" [columnDefs]="colDefs" [gridOptions]="gridOptions"/>
    </div>
  `,
  styles: [`/* AG-Grid styles loaded globally */`]
})
export class InvoicesListComponent implements OnInit {
  rowData = signal<Invoice[]>([]);

  colDefs: ColDef[] = [
    { field: 'invoice_number', headerName: 'Nº Factura', width: 130 },
    { field: 'customer.name', headerName: 'Cliente', width: 200 },
    { field: 'date', headerName: 'Fecha', width: 120 },
    { field: 'total_amount', headerName: 'Total', width: 130, valueFormatter: params => '$' + (parseFloat(params.value) || 0).toFixed(2) },
    { field: 'status', headerName: 'Estado', width: 120 }
  ];

  gridOptions: GridOptions = {
    theme: 'legacy',
    defaultColDef: { sortable: true, resizable: true, filter: true },
    pagination: true,
    paginationPageSize: 20
  };

  constructor(private invoiceService: InvoiceService) {}

  ngOnInit(): void {
    this.invoiceService.getInvoices().subscribe(invoices => this.rowData.set(invoices));
  }
}
