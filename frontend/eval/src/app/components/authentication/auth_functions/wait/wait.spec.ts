import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Wait } from './wait';

describe('Wait', () => {
  let component: Wait;
  let fixture: ComponentFixture<Wait>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Wait]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Wait);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
