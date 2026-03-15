import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridReadyEvent, GridOptions } from 'ag-grid-community';
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

  colDefs: ColDef<Product>[] = [
    {
      field: 'code',
      headerName: 'Código',
      width: 130,
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      pinned: 'left'
    },
    {
      field: 'name',
      headerName: 'Producto',
      width: 250,
      filter: 'agTextColumnFilter',
      floatingFilter: true
    },
    {
      field: 'category.name',
      headerName: 'Categoría',
      width: 180,
      filter: 'agTextColumnFilter',
      floatingFilter: true
    },
    {
      field: 'current_stock',
      headerName: 'Stock Actual',
      width: 140,
      type: 'numericColumn',
      cellRenderer: (params: any) => {
        const stock = params.value;
        const minStock = params.data.minimum_stock;
        const isLow = stock <= minStock;
        return `
          <span style="
            color: ${isLow ? '#ff4d4f' : '#52c41a'};
            font-weight: 600;
          ">
            ${stock}
          </span>
        `;
      }
    },
    {
      field: 'minimum_stock',
      headerName: 'Stock Mínimo',
      width: 150,
      type: 'numericColumn'
    },
    {
      field: 'purchase_price',
      headerName: 'Precio Compra',
      width: 150,
      type: 'numericColumn',
      valueFormatter: params => '$' + (parseFloat(params.value) || 0).toFixed(2)
    },
    {
      field: 'sale_price',
      headerName: 'Precio Venta',
      width: 150,
      type: 'numericColumn',
      valueFormatter: params => '$' + (parseFloat(params.value) || 0).toFixed(2)
    },
    {
      field: 'is_active',
      headerName: 'Estado',
      width: 120,
      cellRenderer: (params: any) => {
        const isActive = params.value;
        return `
          <span style="
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
            background: ${isActive ? '#f6ffed' : '#fff1f0'};
            color: ${isActive ? '#52c41a' : '#ff4d4f'};
            border: 1px solid ${isActive ? '#b7eb8f' : '#ffa39e'};
          ">
            ${isActive ? 'Activo' : 'Inactivo'}
          </span>
        `;
      }
    },
    {
      headerName: 'Acciones',
      width: 140,
      pinned: 'right',
      cellRenderer: () => {
        return `
          <button class="action-btn edit-btn">
            <span class="anticon anticon-edit"></span>
          </button>
          <button class="action-btn delete-btn">
            <span class="anticon anticon-delete"></span>
          </button>
        `;
      },
      sortable: false,
      filter: false
    }
  ];

  gridOptions: GridOptions = {
    theme: 'legacy',
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true
    },
    pagination: true,
    paginationPageSize: 20,
    paginationPageSizeSelector: [10, 20, 50, 100],
    animateRows: true,
    rowSelection: {
      mode: 'multiRow',
      enableClickSelection: false
    }
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
      next: (products) => {
        this.rowData.set(products);
        this.loading.set(false);
      },
      error: (error) => {
        this.message.error('Error al cargar productos');
        this.loading.set(false);
      }
    });
  }

  onGridReady(params: GridReadyEvent): void {
    params.api.sizeColumnsToFit();
  }

  exportToExcel(): void {
    this.message.info('Función de exportación en desarrollo');
  }

  addProduct(): void {
    this.message.info('Función de agregar producto en desarrollo');
  }

  onQuickFilterChanged(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    // Implement quick filter logic
  }
}
