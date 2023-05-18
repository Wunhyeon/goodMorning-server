import { Controller } from '@nestjs/common';
import { AcTechService } from './ac-tech.service';

@Controller('ac-tech')
export class AcTechController {
  constructor(private readonly acTechService: AcTechService) {}
}
