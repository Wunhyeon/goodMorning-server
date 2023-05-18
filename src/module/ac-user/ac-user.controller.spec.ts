import { Test, TestingModule } from '@nestjs/testing';
import { AcUserController } from './ac-user.controller';
import { AcUserService } from './ac-user.service';

describe('AcUserController', () => {
  let controller: AcUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AcUserController],
      providers: [AcUserService],
    }).compile();

    controller = module.get<AcUserController>(AcUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
