import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemainingInterviews } from './remaining-interviews';

describe('RemainingInterviews', () => {
  let component: RemainingInterviews;
  let fixture: ComponentFixture<RemainingInterviews>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemainingInterviews]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemainingInterviews);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
