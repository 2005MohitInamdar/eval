import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationReport } from './evaluation-report';

describe('EvaluationReport', () => {
  let component: EvaluationReport;
  let fixture: ComponentFixture<EvaluationReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluationReport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluationReport);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
