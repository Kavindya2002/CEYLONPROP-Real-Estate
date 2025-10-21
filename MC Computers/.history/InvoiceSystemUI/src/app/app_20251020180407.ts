import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { InvoiceService } from './services/invoic


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule, CurrencyPipe],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  customer = { name: '', phone: '' };
  customerId = 'CUST001';
  products: any[] = [{ id: '', name: '', description: '', quantity: 0, discount: 0, total: 0 }];
  totalAmount = 0;
  balanceAmount = 0;

  addProduct() {
    this.products.push({ id: '', name: '', description: '', quantity: 0, discount: 0, total: 0 });
  }

  calculateTotals() {
    this.totalAmount = this.products.reduce((sum, item) => {
      const total = item.quantity * 1000; // Example: assume price 1000 per unit
      const discount = (total * (item.discount || 0)) / 100;
      item.total = total - discount;
      return sum + item.total;
    }, 0);
    this.balanceAmount = this.totalAmount;
  }

  downloadInvoice() {
    alert('Invoice downloaded (simulation)');
  }
}

bootstrapApplication(App);
