import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridOptions, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import { ProductActionsCellComponent } from './helper/product-actions-cell.component';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { Category, Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-products-list',
  standalone: true,
  host: { ngSkipHydration: 'true' },
  imports: [
    CommonModule,
    AgGridAngular,
    ProductActionsCellComponent,
    NzButtonModule,
    NzDropDownModule,
    NzInputModule,
    NzIconModule,
    NzTagModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzModalModule,
    NzInputNumberModule,
    NzSelectModule,
    NzCheckboxModule,
    NzSkeletonModule
  ],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
})
export class ProductsListComponent implements OnInit {
  loading = signal(false);
  rowData = signal<Product[]>([]);
  selectedProduct = signal<Product | null>(null);
  editingProduct = signal<Product | null>(null);
  isCreateModalOpen = signal(false);
  saving = signal(false);
  categories = signal<Category[]>([]);
  columnOptions = [
    { key: 'code', label: 'Codigo', visible: true },
    { key: 'name', label: 'Producto', visible: true },
    { key: 'category', label: 'Categoria', visible: true },
    { key: 'current_stock', label: 'Stock Actual', visible: true },
    { key: 'minimum_stock', label: 'Stock Min.', visible: true },
    { key: 'sale_price', label: 'Precio Venta', visible: true },
    { key: 'purchase_price', label: 'Costo', visible: true },
    { key: 'is_active', label: 'Estado', visible: true }
  ];

  private gridApi?: GridApi<Product>;
  private fb = inject(NonNullableFormBuilder);

  productForm = this.fb.group({
    code: ['', [Validators.required]],
    name: ['', [Validators.required]],
    category_id: [0, [Validators.required, Validators.min(1)]],
    purchase_price: [0, [Validators.required, Validators.min(0)]],
    sale_price: [0, [Validators.required, Validators.min(0)]],
    current_stock: [0, [Validators.required, Validators.min(0)]],
    minimum_stock: [0, [Validators.required, Validators.min(0)]],
    is_active: [true]
  });

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
      colId: 'category',
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
      width: 80,
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
    },
    {
      colId: 'actions',
      headerName: 'Acciones',
      maxWidth: 90,
      sortable: false,
      filter: false,
      pinned: 'right',
      cellRenderer: ProductActionsCellComponent
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
    context: {
      onEdit: (product: Product) => this.editProduct(product),
      onDelete: (product: Product) => this.deleteProduct(product)
    }
  };

  constructor(
    private productService: ProductService,
    private message: NzMessageService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.loading.set(true);
    forkJoin({
      products: this.productService.getProducts(),
      categories: this.productService.getCategories()
    }).subscribe({
      next: ({ products, categories }) => {
        this.rowData.set(products);
        this.selectedProduct.set(products[0] ?? null);
        this.categories.set(categories);
        this.loading.set(false);
      },
      error: () => {
        this.message.error('Error al cargar datos de productos');
        this.loading.set(false);
      }
    });
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

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: categories => this.categories.set(categories),
      error: () => this.message.error('Error al cargar categorias')
    });
  }

  onGridReady(params: GridReadyEvent<Product>): void {
    this.gridApi = params.api;
    this.columnOptions.forEach(column => {
      this.gridApi?.setColumnsVisible([column.key], column.visible);
    });
  }

  exportToExcel(): void {
    if (!this.gridApi) {
      this.message.warning('La tabla todavia no esta lista para exportar');
      return;
    }

    this.gridApi.exportDataAsCsv({
      fileName: 'productos.csv',
      allColumns: true
    });

    this.message.success('Exportacion CSV iniciada');
  }

  toggleColumnVisibility(option: { key: string; label: string; visible: boolean }): void {
    if (!this.gridApi) {
      this.message.warning('La tabla todavia no esta lista');
      return;
    }

    option.visible = !option.visible;
    this.gridApi.setColumnsVisible([option.key], option.visible);
  }

  resetColumns(): void {
    if (!this.gridApi) {
      this.message.warning('La tabla todavia no esta lista');
      return;
    }

    this.columnOptions.forEach(option => {
      option.visible = true;
      this.gridApi?.setColumnsVisible([option.key], true);
    });
  }

  addProduct(): void {
    this.editingProduct.set(null);
    this.resetProductForm();
    this.isCreateModalOpen.set(true);
  }

  editProduct(product: Product): void {
    this.editingProduct.set(product);
    this.productForm.reset({
      code: product.code,
      name: product.name,
      category_id: product.category_id,
      purchase_price: product.purchase_price,
      sale_price: product.sale_price,
      current_stock: product.current_stock,
      minimum_stock: product.minimum_stock,
      is_active: product.is_active
    });
    this.isCreateModalOpen.set(true);
  }

  deleteProduct(product: Product): void {
    this.modal.confirm({
      nzTitle: 'Eliminar producto',
      nzContent: `Estas seguro de que quieres eliminar el registro "${product.name}"? <br>Esta accion no se puede deshacer.`,
      nzOkText: 'Eliminar',
      nzOkDanger: true,
      nzCancelText: 'Cancelar',
      nzOnOk: () => {
        this.productService.deleteProduct(product.id).subscribe({
          next: () => {
            this.message.success('Producto eliminado correctamente');

            if (this.editingProduct()?.id === product.id) {
              this.isCreateModalOpen.set(false);
              this.editingProduct.set(null);
              this.resetProductForm();
            }

            if (this.selectedProduct()?.id === product.id) {
              this.selectedProduct.set(null);
            }

            this.loadProducts();
          },
          error: (error: HttpErrorResponse) => {
            const apiMessage = error.error?.message;
            this.message.error(apiMessage || 'Error al eliminar el producto');
          }
        });
      }
    });
  }

  handleCreateCancel(): void {
    this.isCreateModalOpen.set(false);
    this.editingProduct.set(null);
    this.resetProductForm();
  }

  submitProduct(): void {
    if (this.productForm.invalid) {
      Object.values(this.productForm.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });
      return;
    }

    this.saving.set(true);
    const payload = this.productForm.getRawValue();
    const editing = this.editingProduct();
    const request$ = editing
      ? this.productService.updateProduct(editing.id, payload)
      : this.productService.createProduct(payload);

    request$.subscribe({
      next: () => {
        this.message.success(editing ? 'Producto actualizado correctamente' : 'Producto creado correctamente');
        this.isCreateModalOpen.set(false);
        this.editingProduct.set(null);
        this.resetProductForm();
        this.loadProducts();
        this.saving.set(false);
      },
      error: (error: HttpErrorResponse) => {
        const apiMessage = error.error?.message;
        this.message.error(
          apiMessage || (editing ? 'Error al actualizar el producto' : 'Error al crear el producto')
        );
        this.saving.set(false);
      }
    });
  }

  private resetProductForm(): void {
    this.productForm.reset({
      code: '',
      name: '',
      category_id: 0,
      purchase_price: 0,
      sale_price: 0,
      current_stock: 0,
      minimum_stock: 0,
      is_active: true
    });
  }

  onQuickFilterChanged(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.gridApi?.setGridOption('quickFilterText', value);
  }

  closeDetails(): void {
    this.selectedProduct.set(null);
  }
}
