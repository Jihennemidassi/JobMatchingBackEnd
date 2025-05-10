import { Test, TestingModule } from '@nestjs/testing';
import { PosteService } from './poste.service';

describe('PosteService', () => {
  let service: PosteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PosteService],
    }).compile();

    service = module.get<PosteService>(PosteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
