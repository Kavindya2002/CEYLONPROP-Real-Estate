import { Component, Injectable, OnInit } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';


// -------------------- Invoice Service --------------------
@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private baseUrl = 'https://localhost:7112/api/invoices'; // Replace with your backend URL

  constructor(private http: HttpClient) {}

  getInvoices(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  addInvoice(invoiceData: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, invoiceData);
  }

  deleteInvoice(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}

// -------------------- Main App Component --------------------
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  customer = { name: '', phone: '' };
  customerId = 'CUST001';
  products: any[] = [{ id: '', name: '', description: '', quantity: 0, discount: 0, total: 0 }];
  totalAmount = 0;
  balanceAmount = 0;
  invoices: any[] = [];

  constructor(private invoiceService: InvoiceService) {}

  ngOnInit() {
    this.loadInvoices();
  }

  addProduct() {
    this.products.push({ id: '', name: '', description: '', quantity: 0, discount: 0, total: 0 });
  }

  calculateTotals() {
    this.totalAmount = this.products.reduce((sum, item) => {
      const total = item.quantity * 1000; // Example price
      const discount = (total * (item.discount || 0)) / 100;
      item.total = total - discount;
      return sum + item.total;
    }, 0);
    this.balanceAmount = this.totalAmount;
  }

  downloadInvoice() {
    alert('Invoice downloaded (simulation)');
  }

  // -------------------- Backend Integration --------------------
  loadInvoices() {
    this.invoiceService.getInvoices().subscribe({
      next: data => this.invoices = data,
      error: err => console.error('Error loading invoices:', err)
    });
  }

  saveInvoice() {
    const invoiceData = {
      customer: this.customer,
      products: this.products,
      totalAmount: this.totalAmount,
      balanceAmount: this.balanceAmount
    };

    this.invoiceService.addInvoice(invoiceData).subscribe({
      next: res => {
        alert('Invoice saved successfully!');
        this.loadInvoices(); // Reload list
      },
      error: err => console.error('Error saving invoice:', err)
    });
  }

  deleteInvoice(id: number) {
    if (!confirm('Are you sure you want to delete this invoice?')) return;

    this.invoiceService.deleteInvoice(id).subscribe({
      next: res => {
        alert('Invoice deleted successfully!');
        this.loadInvoices(); // Reload list
      },
      error: err => console.error('Error deleting invoice:', err)
    });
  }
}

// -------------------- Bootstrap --------------------
bootstrapApplication(App);
