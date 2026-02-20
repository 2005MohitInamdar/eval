import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthUiWrapper } from './auth-ui-wrapper';

describe('AuthUiWrapper', () => {
  let component: AuthUiWrapper;
  let fixture: ComponentFixture<AuthUiWrapper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthUiWrapper]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthUiWrapper);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
