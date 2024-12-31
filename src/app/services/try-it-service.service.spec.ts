import { TestBed } from '@angular/core/testing';

import { TryItServiceService } from './try-it-service.service';

describe('TryItServiceService', () => {
  let service: TryItServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TryItServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
