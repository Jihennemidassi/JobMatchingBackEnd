import { Test, TestingModule } from '@nestjs/testing';
import { RecruteurController } from './recruteur.controller';
import { RecruteurService } from './recruteur.service';

describe('RecruteurController', () => {
  let controller: RecruteurController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecruteurController],
      providers: [RecruteurService],
    }).compile();

    controller = module.get<RecruteurController>(RecruteurController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
