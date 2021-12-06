import { TestBed } from '@angular/core/testing';

import { SmartdataService } from './smartdata.service';

describe('SmartdataService', () => {
  let service: SmartdataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmartdataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
