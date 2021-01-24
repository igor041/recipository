import { TestBed } from '@angular/core/testing';

import { RecipeDbService } from './recipe-db.service';

describe('RecipeDbService', () => {
  let service: RecipeDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
