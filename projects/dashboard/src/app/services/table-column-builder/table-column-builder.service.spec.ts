import { TestBed } from '@angular/core/testing';

import { TableColumnBuilderService } from './table-column-builder.service';

describe('TableColumnBuilderService', () => {
  let service: TableColumnBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableColumnBuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
