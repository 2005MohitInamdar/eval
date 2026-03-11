import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionPage } from './selection-page';

describe('SelectionPage', () => {
  let component: SelectionPage;
  let fixture: ComponentFixture<SelectionPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectionPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectionPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
