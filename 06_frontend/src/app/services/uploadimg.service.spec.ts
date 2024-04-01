import { TestBed } from '@angular/core/testing';

import { UploadimgService } from './uploadimg.service';

describe('UploadimgService', () => {
  let service: UploadimgService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadimgService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
