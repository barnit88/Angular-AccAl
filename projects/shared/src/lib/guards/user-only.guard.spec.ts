import { TestBed } from '@angular/core/testing';

import { UserOnlyGuard } from './user-only.guard';

describe('UserOnlyGuard', () => {
  let guard: UserOnlyGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UserOnlyGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
