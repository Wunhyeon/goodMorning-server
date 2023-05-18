import { Module } from '@nestjs/common';
import { AcceleratorService } from './accelerator.service';
import { AcceleratorController } from './accelerator.controller';

@Module({
  controllers: [AcceleratorController],
  providers: [AcceleratorService]
})
export class AcceleratorModule {}
