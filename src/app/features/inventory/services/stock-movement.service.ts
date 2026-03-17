import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { StockMovement } from '../models/stock-movement.model';
import { ApiResponse } from '../../../core/models';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StockMovementService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getStockMovements(): Observable<StockMovement[]> {
    return this.http.get<ApiResponse<StockMovement[]>>(`${this.API_URL}/stock-movements`)
      .pipe(map(response => response.data || []));
  }
}
