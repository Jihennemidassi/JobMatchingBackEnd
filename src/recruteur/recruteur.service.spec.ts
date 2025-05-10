import { Test, TestingModule } from '@nestjs/testing';
import { RecruteurService } from './recruteur.service';

describe('RecruteurService', () => {
  let service: RecruteurService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecruteurService],
    }).compile();

    service = module.get<RecruteurService>(RecruteurService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
