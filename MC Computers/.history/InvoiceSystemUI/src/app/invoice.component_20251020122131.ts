import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {

  invoice: any = {}; // This will hold invoice data

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // Fetch invoice from API (replace ID=1 with dynamic value later)
    this.http.get('https://localhost:7240/api/Invoice/1') // Your backend URL
      .subscribe(res => this.invoice = res);
  }

}
