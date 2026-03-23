import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product, Category } from '../models/product.model';
import { ApiResponse } from '../../../core/models';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<ApiResponse<Product[]>>(`${this.API_URL}/products`)
      .pipe(map(response => response.data || []));
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<ApiResponse<Category[]>>(`${this.API_URL}/categories`)
      .pipe(map(response => response.data || []));
  }

  createProduct(payload: Omit<Product, 'id' | 'category' | 'created_at' | 'updated_at'>): Observable<Product> {
    return this.http.post<ApiResponse<Product>>(`${this.API_URL}/products`, payload).pipe(
      map(response => {
        if (!response.data) {
          throw new Error('La respuesta no contiene el producto creado');
        }
        return response.data;
      })
    );
  }

  updateProduct(
    id: number,
    payload: Omit<Product, 'id' | 'category' | 'created_at' | 'updated_at'>
  ): Observable<ApiResponse<Product> | Product | null> {
    return this.http.put<ApiResponse<Product> | Product | null>(`${this.API_URL}/products/${id}`, payload);
  }

  deleteProduct(id: number): Observable<ApiResponse<null> | null> {
    return this.http.delete<ApiResponse<null> | null>(`${this.API_URL}/products/${id}`);
  }
}
