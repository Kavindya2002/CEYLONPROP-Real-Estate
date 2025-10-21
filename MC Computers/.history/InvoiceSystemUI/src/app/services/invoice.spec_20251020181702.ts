import { TestBed } from '@angular/core/testing';

import { Invoice } from './i';

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
