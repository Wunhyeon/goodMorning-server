import { PickType } from '@nestjs/swagger';
import { User } from 'src/model/entity/user.entity';

export class UpdateUserPasswordDto extends PickType(User, ['password']) {}
