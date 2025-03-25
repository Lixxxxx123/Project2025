import { TestBed } from '@angular/core/testing';

import { StudentStatsService } from './student-stats.service';

describe('StudentStatsService', () => {
  let service: StudentStatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentStatsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
