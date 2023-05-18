import { Test, TestingModule } from '@nestjs/testing';
import { AcTechService } from './ac-tech.service';

describe('AcTechService', () => {
  let service: AcTechService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AcTechService],
    }).compile();

    service = module.get<AcTechService>(AcTechService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
