import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { StockMovement } from '../../models/stock-movement.model';
import { StockMovementService } from '../../services/stock-movement.service';

@Component({
  selector: 'app-stock-movements-list',
  standalone: true,
  host: { ngSkipHydration: 'true' },
  imports: [CommonModule, AgGridAngular, NzButtonModule, NzIconModule, NzInputModule],
  templateUrl: './stock-movements-list.component.html',
  styleUrl: './stock-movements-list.component.scss'
})
export class StockMovementsListComponent implements OnInit {
  rowData = signal<StockMovement[]>([]);
  private gridApi?: GridApi<StockMovement>;

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
    defaultColDef: { sortable: true, resizable: true, filter: true, minWidth: 255 },
    pagination: true,
    paginationPageSize: 20,
    animateRows: true
  };

  constructor(private stockService: StockMovementService) {}

  ngOnInit(): void {
    this.stockService.getStockMovements().subscribe(movements => this.rowData.set(movements));
  }

  onGridReady(params: GridReadyEvent<StockMovement>): void {
    this.gridApi = params.api;
  }

  onQuickFilterChanged(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.gridApi?.setGridOption('quickFilterText', value);
  }
}
