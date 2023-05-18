import { Test, TestingModule } from '@nestjs/testing';
import { AcTechController } from './ac-tech.controller';
import { AcTechService } from './ac-tech.service';

describe('AcTechController', () => {
  let controller: AcTechController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AcTechController],
      providers: [AcTechService],
    }).compile();

    controller = module.get<AcTechController>(AcTechController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
