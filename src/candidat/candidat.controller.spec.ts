import { Test, TestingModule } from '@nestjs/testing';
import { CandidatController } from './candidat.controller';
import { CandidatService } from './candidat.service';

describe('CandidatController', () => {
  let controller: CandidatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CandidatController],
      providers: [CandidatService],
    }).compile();

    controller = module.get<CandidatController>(CandidatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
