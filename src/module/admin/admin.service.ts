import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { pbkdf2Sync } from 'crypto';
import { AuthService } from 'src/auth/auth.service';
import { constantString } from 'src/global/global.constants';
import { MasterUser } from 'src/model/entity/masterUser.entity';
import { DataSource, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { CreateAcTechDto } from '../ac-tech/dto/create-acTech.dto';
import { AcTech } from 'src/model/entity/acTech.entity';
import { AcTechService } from '../ac-tech/ac-tech.service';
import { acTechRepository } from 'src/model/repository/acTech.repository';
import { acKeywordRepository } from 'src/model/repository/acKeyword.repository';
import { acTechKeywordRepository } from 'src/model/repository/acTechKeyword.repository';
import { masterUserRepository } from 'src/model/repository/masterUser.repository';
import { Accelerator } from 'src/model/entity/accelerator.entity';
import { AcKeyword } from 'src/model/entity/acKeyword.entity';

@Injectable()
export class AdminService {
  constructor(
    // @InjectRepository(MasterUser, constantString.latticeConnection)
    // private masterUserRepository: Repository<MasterUser>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    private configService: ConfigService,
    @InjectDataSource(constantString.latticeConnection)
    private dataSource: DataSource,
    // @InjectRepository(AcTech, constantString.latticeConnection)
    // private acTechRepository: Repository<AcTech>,
    private acTechService: AcTechService,
  ) {}

  // masterUser
  async fineOneByUserEmailMasterUser(email: string) {
    // return this.masterUserRepository.findOne({
    //   where: { email: email },
    //   relations: ['accelerator'],
    // });

    return await masterUserRepository.selectMasterUserByEmail(email);
  }

  // refreshToken 갱신
  async setCurrentRefreshToken(refreshToken: string, masterUser: MasterUser) {
    const currentHashedRefreshTokenBuffer = await pbkdf2Sync(
      refreshToken,
      this.configService.get('MASTER_CRYPTO_REFRESH_HASH_SALT_KEY'),
      10,
      64,
      'sha256',
    );

    await masterUserRepository.update(
      { id: masterUser.id },
      {
        currentHashedRefreshToken:
          currentHashedRefreshTokenBuffer.toString('base64'),
      },
    );
  }

  // masterUser의 refreshToken 비교
  async getUserIfRefreshTokenMatches(
    refreshToken: string,
    masterUser: MasterUser,
  ) {
    const masterUserInfo = await masterUserRepository.findOne({
      where: { id: masterUser.id },
      select: ['id', 'email', 'currentHashedRefreshToken'],
    });

    const requestRefreshTokenBuffer = await pbkdf2Sync(
      refreshToken,
      this.configService.get('MASTER_CRYPTO_REFRESH_HASH_SALT_KEY'),
      10,
      64,
      'sha256',
    );

    const requestRefreshToken = requestRefreshTokenBuffer.toString('base64');

    if (masterUserInfo.currentHashedRefreshToken !== requestRefreshToken) {
      throw new UnauthorizedException();
    }

    return masterUserInfo;
  }

  async createTech(createAcTechDto: CreateAcTechDto, accelerator: Accelerator) {
    this.dataSource.transaction(async (manager) => {
      const transAcTechRepository = manager.withRepository(acTechRepository);
      const transAcKeywordRepository =
        manager.withRepository(acKeywordRepository);
      const transAcTechKeywordRepository = manager.withRepository(
        acTechKeywordRepository,
      );

      // // 이번에 새로 넣어야 할 키워드 Name 배열
      // const newKeywordNameArr: { name: string }[] = [];
      // // 순서 맵
      // const orderMap = new Map<string, number>();
      // // 최종 결과 (처음 순서대로 id와 name이 들어간 acKeyword배열)
      // const result = [];

      const acTechInsertResult = await transAcTechRepository.insertTech(
        accelerator,
        createAcTechDto.name,
        createAcTechDto.description,
        createAcTechDto.isActive,
        createAcTechDto.order,
      );

      const acTech = new AcTech(acTechInsertResult.generatedMaps[0].id);

      for (let i = 0; i < createAcTechDto.acKeyword.length; i++) {
        if (!createAcTechDto.acKeyword[i].id) {
          // newKeywordNameArr.push({ name: createAcTechDto.acKeyword[i].name });
          const acKeywordInsertResult =
            await transAcKeywordRepository.insertName(
              createAcTechDto.acKeyword[i].name,
              accelerator,
            );
          await transAcTechKeywordRepository.insert({
            acTech,
            acKeyword: new AcKeyword(acKeywordInsertResult.generatedMaps[0].id),
          });
        } else {
          await transAcTechKeywordRepository.insert({
            acTech,
            acKeyword: new AcKeyword(createAcTechDto.acKeyword[i].id),
          });
        }
      }
    });
  }
}
