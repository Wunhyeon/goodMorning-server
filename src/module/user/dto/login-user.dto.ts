import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { User } from 'src/model/entity/user.entity';

export class LoginUserDto extends PickType(User, ['email', 'password']) {
  @ApiProperty({
    example: true,
    description:
      '자동로그인 (로그인 정보 기억하기). true일 경우, refreshToken도 내려줌',
  })
  @IsOptional()
  @IsBoolean()
  autoLogin!: boolean;
}
