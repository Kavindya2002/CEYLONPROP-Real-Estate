import { TestBed } from '@angular/core/testing';

import { Invoice } from './services/inv';

describe('Invoice', () => {
  let service: Invoice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Invoice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
