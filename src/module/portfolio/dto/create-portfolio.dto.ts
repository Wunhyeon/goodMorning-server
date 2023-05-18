import { PickType } from '@nestjs/swagger';
import { Portfolio } from 'src/model/entity/portfolio.entity';

export class CreatePortfolioDto extends PickType(Portfolio, ['companyName']) {}
