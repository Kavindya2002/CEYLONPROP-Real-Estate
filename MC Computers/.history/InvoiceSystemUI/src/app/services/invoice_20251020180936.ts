import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InvoiceService } from './services/invoice';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  constructor(private invoiceService: InvoiceService) {}


  private baseUrl = 'https://localhost:7112/swagger/index.html'; // backend URL

  constructor(private http: HttpClient) { }

  getInvoices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  addInvoice(invoiceData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, invoiceData);
  }

  deleteInvoice(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
