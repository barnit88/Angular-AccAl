import { TestBed } from '@angular/core/testing';

import { UiUtilsServiceService } from './ui-service.service';

describe('UiServiceService', () => {
  let service: UiUtilsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UiUtilsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
