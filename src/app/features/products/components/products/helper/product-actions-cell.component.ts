import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-product-actions-cell',
  standalone: true,
  imports: [NzButtonModule, NzIconModule],
  templateUrl: './product-actions-cell.component.html'
})
export class ProductActionsCellComponent implements ICellRendererAngularComp {
  private params!: ICellRendererParams<Product>;

  agInit(params: ICellRendererParams<Product>): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams<Product>): boolean {
    this.params = params;
    return true;
  }

  onEdit(): void {
    this.params.context.onEdit(this.params.data);
  }

  onDelete(): void {
    this.params.context.onDelete(this.params.data);
  }
}
