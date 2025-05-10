import { Test, TestingModule } from '@nestjs/testing';
import { CandidatService } from './candidat.service';

describe('CandidatService', () => {
  let service: CandidatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CandidatService],
    }).compile();

    service = module.get<CandidatService>(CandidatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
