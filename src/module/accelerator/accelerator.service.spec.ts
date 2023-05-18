import { Test, TestingModule } from '@nestjs/testing';
import { AcceleratorService } from './accelerator.service';

describe('AcceleratorService', () => {
  let service: AcceleratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AcceleratorService],
    }).compile();

    service = module.get<AcceleratorService>(AcceleratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
