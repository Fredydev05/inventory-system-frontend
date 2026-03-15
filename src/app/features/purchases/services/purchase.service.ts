import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Supplier, PurchaseOrder } from '../models/purchase.model';
import { ApiResponse } from '../../../core/models';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private readonly API_URL = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<ApiResponse<Supplier[]>>(`${this.API_URL}/suppliers`)
      .pipe(map(response => response.data || []));
  }

  getPurchaseOrders(): Observable<PurchaseOrder[]> {
    return this.http.get<ApiResponse<PurchaseOrder[]>>(`${this.API_URL}/purchase-orders`)
      .pipe(map(response => response.data || []));
  }
}
