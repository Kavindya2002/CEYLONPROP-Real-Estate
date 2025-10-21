import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule] // Fixes *ngFor, ngModel, currency pipe
})
export class InvoiceComponent {
  customer = { name: '', phone: '' };
  customerId = '';
  products: any[] = [{ id: '', name: '', description: '', quantity: 0, discount: 0, total: 0 }];
  totalAmount = 0;
  balanceAmount = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.generateCustomerId();
  }

  generateCustomerId() {
    // You can call backend API or generate random ID
    this.customerId = 'CID-' + Math.floor(Math.random() * 10000);
  }

  addProduct() {
    this.products.push({ id: '', name: '', description: '', quantity: 0, discount: 0, total: 0 });
  }

  calculateTotals() {
    this.totalAmount = 0;
    this.products.forEach(item => {
      item.total = item.quantity * 1000 * (1 - item.discount / 100); // Example price=1000
      this.totalAmount += item.total;
    });
    this.balanceAmount = this.totalAmount; // Add payments logic if required
  }

  downloadInvoice() {
    const doc: any = new jsPDF(); // Use any type to avoid TypeScript error
    
    // Page border
    doc.setLineWidth(1.5);
    doc.rect(10, 10, 190, 277);

    // Company info
    doc.setFontSize(16);
    doc.text("MC Computers", 15, 25);
    doc.setFontSize(11);
    doc.text("No 32, Galle Road, Colombo 03, Sri Lanka", 15, 30);
    doc.text("📞 Voice - +94 11 2 333 111", 15, 35);
    doc.text("email - mccomputers@gmail.com", 15, 40);
    doc.text("Online - mccomputers.lk", 15, 45);

    // Customer info
    doc.text(`Bill To: ${this.customer.name}`, 15, 55);
    doc.text(`Phone: ${this.customer.phone}`, 15, 60);
    doc.text(`Customer ID: ${this.customerId}`, 15, 65);

    // Invoice heading
    doc.setFontSize(14);
    doc.text("INVOICE", 150, 25);
    doc.setFontSize(11);
    doc.text(`Invoice No: INV-${Math.floor(Math.random()*10000)}`, 150, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 35);

    // Products table
    autoTable(doc, {
      startY: 75,
      head: [['Qty', 'Product Name', 'Description', 'Discount', 'Total']],
      body: this.products.map(p => [
        p.quantity,
        p.name,
        p.description,
        p.discount + '%',
        p.total.toFixed(2)
      ]),
    });

    // Totals
    doc.text(`Total Amount: LKR ${this.totalAmount.toFixed(2)}`, 140, doc.lastAutoTable.finalY + 10);
    doc.text(`Balance Amount: LKR ${this.balanceAmount.toFixed(2)}`, 140, doc.lastAutoTable.finalY + 18);

    // Warranty lines
    const warrantyY = doc.lastAutoTable.finalY + 28;
    doc.text("*Submit this INVOICE for warranty claim. Defective parts will be repaired or replaced within 14 working days", 15, warrantyY);
    doc.text("*No warranty for items damaged due to power surge, physical impact, liquid, or misuse.", 15, warrantyY + 6);
    doc.text("*Warranty not applicable for software, cartridges, toners, or consumable items.", 15, warrantyY + 12);

    // Signatures
    doc.text("....................................                                                                                                              .............................", 15, warrantyY + 28);
    doc.text("Authorised Signature    | Check goods before accepting & sign | Customer name & signature", 15, warrantyY + 34);

    doc.save("invoice.pdf");
  }
}
