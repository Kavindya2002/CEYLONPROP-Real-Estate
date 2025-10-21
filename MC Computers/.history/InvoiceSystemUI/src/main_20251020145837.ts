// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { provideHttpClient } from '@angular/common/http';

import { InvoiceComponent } from './app/invoice/invoice.component';

bootstrapApplication(InvoiceComponent, {
  providers: [
    appConfig.providers,
    provideHttpClient(),
    provideForms()
  ]
})
.catch(err => console.error(err));
