import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavTop } from './nav-top';

describe('NavTop', () => {
  let component: NavTop;
  let fixture: ComponentFixture<NavTop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavTop]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavTop);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
