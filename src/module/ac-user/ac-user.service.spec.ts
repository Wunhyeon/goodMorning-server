import { Test, TestingModule } from '@nestjs/testing';
import { AcUserService } from './ac-user.service';

describe('AcUserService', () => {
  let service: AcUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AcUserService],
    }).compile();

    service = module.get<AcUserService>(AcUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
