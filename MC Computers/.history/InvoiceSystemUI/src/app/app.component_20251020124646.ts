import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // <-- fix typo styleUrl -> styleUrls
})
export class AppComponent {
  title = 'InvoiceSystemUI';

  invoice = {
    invoiceNumber: 'INV-001',
    invoiceDate: new Date(),
    customer: { name: 'John Doe', phone: '+94 11 234 5678' },
    items: [
      { quantity: 2, productName: 'Keyboard', description: 'Mechanical keyboard', discount: 0, totalAmount: 5000, balanceAmount: 5000 },
      { quantity: 1, productName: 'Mouse', description: 'Wireless mouse', discount: 100, totalAmount: 2000, balanceAmount: 1900 }
    ],
    totalAmount: 7000,
    paidAmount: 7000,
    balanceAmount: 0
  };
}
