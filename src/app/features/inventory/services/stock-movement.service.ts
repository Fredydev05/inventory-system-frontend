import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { StockMovement } from '../models/stock-movement.model';
import { ApiResponse } from '../../../core/models';

@Injectable({
  providedIn: 'root'
})
export class StockMovementService {
  private readonly API_URL = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getStockMovements(): Observable<StockMovement[]> {
    return this.http.get<ApiResponse<StockMovement[]>>(`${this.API_URL}/stock-movements`)
      .pipe(map(response => response.data || []));
  }
}
