import { TestBed } from '@angular/core/testing';

import { CladeService } from './clade.service';

describe('CladeService', () => {
  let service: CladeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CladeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
