import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessReviewPageComponent } from './access-review-page.component';

describe('AccessReviewPageComponent', () => {
  let component: AccessReviewPageComponent;
  let fixture: ComponentFixture<AccessReviewPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccessReviewPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AccessReviewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
