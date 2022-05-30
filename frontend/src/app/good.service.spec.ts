import { TestBed } from '@angular/core/testing';

import { GoodService } from './good.service';

describe('GoodService', () => {
  let service: GoodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
