import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridOptions, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-products-list',
  standalone: true,
  host: { ngSkipHydration: 'true' },
  imports: [
    CommonModule,
    AgGridAngular,
    NzButtonModule,
    NzInputModule,
    NzIconModule,
    NzTagModule
  ],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
})
export class ProductsListComponent implements OnInit {
  loading = signal(false);
  rowData = signal<Product[]>([]);
  selectedProduct = signal<Product | null>(null);

  private gridApi?: GridApi<Product>;

  colDefs: ColDef<Product>[] = [
    {
      field: 'code',
      headerName: 'Codigo',
      width: 130,
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      pinned: 'left',
      cellClass: 'cell-ellipsis'
    },
    {
      field: 'name',
      headerName: 'Producto',
      width: 220,
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      cellClass: 'cell-ellipsis',
      tooltipField: 'name'
    },
    {
      headerName: 'Categoria',
      width: 170,
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      valueGetter: params => params.data?.category?.name || '-',
      cellClass: 'cell-ellipsis'
    },
    {
      field: 'current_stock',
      headerName: 'Stock Actual',
      width: 140,
      type: 'numericColumn',
      cellRenderer: (params: ICellRendererParams<Product>) => {
        const stock = params.value;
        const minStock = params.data?.minimum_stock ?? 0;
        const isLow = Number(stock) <= Number(minStock);

        return `
          <span style="color: ${isLow ? '#ff4d4f' : '#52c41a'}; font-weight: 600;">
            ${stock ?? '-'}
          </span>
        `;
      }
    },
    {
      field: 'minimum_stock',
      headerName: 'Stock Min.',
      width: 120,
      type: 'numericColumn'
    },
    {
      field: 'sale_price',
      headerName: 'Precio Venta',
      width: 140,
      type: 'numericColumn',
      valueFormatter: params => '$' + (parseFloat(params.value) || 0).toFixed(2)
    },
    {
      field: 'purchase_price',
      headerName: 'Costo',
      width: 130,
      type: 'numericColumn',
      valueFormatter: params => '$' + (parseFloat(params.value) || 0).toFixed(2)
    },
    {
      field: 'is_active',
      headerName: 'Estado',
      width: 120,
      cellRenderer: (params: ICellRendererParams<Product>) => {
        const isActive = Boolean(params.value);
        return `
          <span style="
            padding: 4px 12px;
            border-radius: 999px;
            font-size: 12px;
            font-weight: 600;
            background: ${isActive ? '#f6ffed' : '#fff1f0'};
            color: ${isActive ? '#52c41a' : '#ff4d4f'};
            border: 1px solid ${isActive ? '#b7eb8f' : '#ffa39e'};
          ">
            ${isActive ? 'Activo' : 'Inactivo'}
          </span>
        `;
      }
    }
    
  ];

  gridOptions: GridOptions<Product> = {
    theme: 'legacy',
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      minWidth: 188
    },
    pagination: true,
    paginationPageSize: 20,
    paginationPageSizeSelector: [10, 20, 50, 100],
    animateRows: true,
    
  };

  constructor(
    private productService: ProductService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.productService.getProducts().subscribe({
      next: products => {
        this.rowData.set(products);
        this.selectedProduct.set(products[0] ?? null);
        this.loading.set(false);
      },
      error: () => {
        this.message.error('Error al cargar productos');
        this.loading.set(false);
      }
    });
  }

  onGridReady(params: GridReadyEvent<Product>): void {
    this.gridApi = params.api;
  }

  exportToExcel(): void {
    this.message.info('Funcion de exportacion en desarrollo');
  }

  addProduct(): void {
    this.message.info('Funcion de agregar producto en desarrollo');
  }

  onQuickFilterChanged(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.gridApi?.setGridOption('quickFilterText', value);
  }

  closeDetails(): void {
    this.selectedProduct.set(null);
  }
}
