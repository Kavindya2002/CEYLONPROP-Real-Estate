// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { provideHttpClient } from '@angular/common/http';
import { provideForms } from '@angular/forms';
import { InvoiceComponent } from './app/invoice/invoice.component';

bootstrapApplication(InvoiceComponent)
  .catch((err) => console.error(err));
