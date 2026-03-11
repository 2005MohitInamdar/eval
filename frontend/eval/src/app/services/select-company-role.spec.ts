import { TestBed } from '@angular/core/testing';

import { SelectCompanyRole } from './select-company-role';

describe('SelectCompanyRole', () => {
  let service: SelectCompanyRole;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectCompanyRole);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
