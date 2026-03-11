import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmResume } from './confirm-resume';

describe('ConfirmResume', () => {
  let component: ConfirmResume;
  let fixture: ComponentFixture<ConfirmResume>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmResume]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmResume);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
