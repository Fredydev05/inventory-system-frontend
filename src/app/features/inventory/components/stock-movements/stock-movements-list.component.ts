import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridOptions } from 'ag-grid-community';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { StockMovement } from '../../models/stock-movement.model';
import { StockMovementService } from '../../services/stock-movement.service';

@Component({
  selector: 'app-stock-movements-list',
  standalone: true,
  imports: [CommonModule, AgGridAngular, NzButtonModule, NzIconModule],
  template: `
    <div style="height: 100%; padding: 24px; display: flex; flex-direction: column;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
        <div><h1 style="font-size: 24px; font-weight: 600;">Movimientos de Inventario</h1></div>
        <button nz-button nzType="primary"><span nz-icon nzType="plus"></span>Registrar Movimiento</button>
      </div>
      <ag-grid-angular class="ag-theme-alpine" style="width: 100%; height: 600px;" [rowData]="rowData()" [columnDefs]="colDefs" [gridOptions]="gridOptions"/>
    </div>
  `,
  styles: [`/* AG-Grid styles loaded globally */`]
})
export class StockMovementsListComponent implements OnInit {
  rowData = signal<StockMovement[]>([]);

  colDefs: ColDef[] = [
    { field: 'date', headerName: 'Fecha', width: 130 },
    { field: 'product.name', headerName: 'Producto', width: 250 },
    { field: 'type', headerName: 'Tipo', width: 120 },
    { field: 'quantity', headerName: 'Cantidad', width: 120 },
    { field: 'reference', headerName: 'Referencia', width: 150 },
    { field: 'user.name', headerName: 'Usuario', width: 150 }
  ];

  gridOptions: GridOptions = {
    theme: 'legacy',
    defaultColDef: { sortable: true, resizable: true, filter: true },
    pagination: true,
    paginationPageSize: 20
  };

  constructor(private stockService: StockMovementService) {}

  ngOnInit(): void {
    this.stockService.getStockMovements().subscribe(movements => this.rowData.set(movements));
  }
}
