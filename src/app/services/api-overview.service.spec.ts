import { TestBed } from '@angular/core/testing';

import { ApiOverviewService } from './api-overview.service';

describe('ApiOverviewService', () => {
  let service: ApiOverviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiOverviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
