import { Test, TestingModule } from '@nestjs/testing';
import { AcceleratorController } from './accelerator.controller';
import { AcceleratorService } from './accelerator.service';

describe('AcceleratorController', () => {
  let controller: AcceleratorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AcceleratorController],
      providers: [AcceleratorService],
    }).compile();

    controller = module.get<AcceleratorController>(AcceleratorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
