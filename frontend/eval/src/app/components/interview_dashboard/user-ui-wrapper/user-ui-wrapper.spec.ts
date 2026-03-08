import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserUiWrapper } from './user-ui-wrapper';

describe('UserUiWrapper', () => {
  let component: UserUiWrapper;
  let fixture: ComponentFixture<UserUiWrapper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserUiWrapper]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserUiWrapper);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
