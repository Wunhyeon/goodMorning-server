import { Controller } from '@nestjs/common';
import { AcceleratorService } from './accelerator.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('ACCELERATOR')
@Controller('accelerator')
export class AcceleratorController {
  constructor(private readonly acceleratorService: AcceleratorService) {}
}
