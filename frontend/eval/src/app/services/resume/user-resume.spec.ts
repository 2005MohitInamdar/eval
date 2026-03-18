import { TestBed } from '@angular/core/testing';

import { UserResume } from './user-resume';

describe('UserResume', () => {
  let service: UserResume;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserResume);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
