// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { InvoiceComponent } from './app/invoice/invoice.component';

bootstrapApplication(InvoiceComponent)
  .catch((err) => console.error(err));
