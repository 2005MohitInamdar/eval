import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRes } from './update-res';

describe('UpdateRes', () => {
  let component: UpdateRes;
  let fixture: ComponentFixture<UpdateRes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateRes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateRes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
