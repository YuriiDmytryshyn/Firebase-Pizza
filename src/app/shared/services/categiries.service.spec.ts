import { TestBed } from '@angular/core/testing';

import { CategiriesService } from './categiries.service';

describe('CategiriesService', () => {
  let service: CategiriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategiriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
