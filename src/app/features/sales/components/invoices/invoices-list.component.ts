import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridOptions } from 'ag-grid-community';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Invoice } from '../../models/invoice.model';
import { InvoiceService } from '../../services/invoice.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzCardComponent } from 'ng-zorro-antd/card';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';


@Component({
  selector: 'app-invoices-list',
  standalone: true,
  imports: [
    CommonModule,
    AgGridAngular,
    NzButtonModule,
    NzIconModule,
    NzCardComponent,
    NzSkeletonModule
  ],
  template: `<h1>Invoices</h1>`,
  styles: [`/* AG-Grid styles loaded globally */`]
})
export class InvoicesListComponent implements OnInit {
  rowData = signal<Invoice[]>([]);

  constructor(
    private invoiceService: InvoiceService,
    private message: NzMessageService
  ) { }

  isLoading: boolean = true;

  colDefs: ColDef[] = [
    { field: 'invoice_number', headerName: 'Nº Factura', flex: 1 },
    { field: 'customer.name', headerName: 'Cliente', width: 200 },
    { field: 'date', headerName: 'Fecha', width: 120 },
    { field: 'total_amount', headerName: 'Total', width: 130, valueFormatter: params => '$' + (parseFloat(params.value) || 0).toFixed(2) },
    { field: 'status', headerName: 'Estado', width: 120 }
  ];

  gridOptions: GridOptions = {
    theme: 'legacy',
    defaultColDef: { sortable: true, resizable: true, filter: true },
    pagination: true,
    paginationPageSize: 20,
    suppressServerSideFullWidthLoadingRow: true,
    suppressMovableColumns: true
  };

  ngOnInit(): void {
    this.invoiceService.getInvoices().subscribe(invoices => this.rowData.set(invoices));
  }
}
