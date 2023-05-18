# LATTICE V2.0

## NODE VERSION : v18.15.0

## CLI

- docker Image 생성 & 실행 : docker-compose up **실서버 배포용**
- 소스가 업데이트되서 이미지를 다시 만들어야 할 때 : docker-compose build lattice-api-server 로 이미지 다시 빌드해준 뒤, docker-compose up **실서버 배포용**
- docker chche, 안쓰는 image, container 등 삭제 : docker system prune. 자세한 옵션 : https://docs.docker.com/engine/reference/commandline/system_prune/
- **개발모드** 로 도커 실행 : docker-compose -f docker-compose.dev.yml up (저장하면 핫 리로드. 이때 아무이유없이 에러가 생기면 다시한번 저장하면 다시 잘 돌아가는 경우가 많습니다.)
- XX **개발모드** npm install 등의 업데이트가 있어야 할 경우 docker-compose -f docker-compose.dev.yml build 로 빌드 후, docker-compose -f docker-compose.dev.yml up 커맨드로 실행 XX 실험중
- schema synchronize **(사용주의)** : npm run atype:schema:sync
- migration : npm run atype:migration

docker port 설정은 docker-compose.yml파일에 들어가서

```
lattice-api-server:
    build:
      dockerfile: ./Dockerfile
    ports:
      - "5555:3000"     <= 이부분. 5555가 docker 포트, 3000번이 서버 포트. 외부에서 접속할 때 5555포트로 접속해야 함.
    volumes:
      - .:/app
```

## 구조

```
.
├── Dockerfile
├── Dockerfile.dev
├── README.md
├── docker-compose.dev.yml
├── docker-compose.yml
├── ecosystem.config.js
├── lattice.a-type.dataSource.ts
├── nest-cli.json
├── package-lock.json
├── package.json
├── src
│   ├── app.controller.spec.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── auth
│   │   ├── auth.module.ts
│   │   ├── auth.service.spec.ts
│   │   ├── auth.service.ts
│   │   ├── jwt-auth.guards.ts
│   │   ├── jwt-refresh-auth.guards.ts
│   │   ├── jwt-refresh.strategy.ts
│   │   ├── jwt.strategy.ts
│   │   ├── local-auth.guard.ts
│   │   ├── local.strategy.ts
│   │   ├── master-jwt-auth.guards.ts
│   │   ├── master-jwt-refresh-auth.guards.ts
│   │   ├── master-jwt-refresh.strategy.ts
│   │   ├── master-jwt.strategy.ts
│   │   ├── master-local-auth.guard.ts
│   │   └── master-local.strategy.ts
│   ├── global  -- 중요. 디비 커넥션 정보 등 글로벌로 쓰이는 것들
│   │   ├── customNamingStrategy.ts -- typeorm에서 사용. 서버에서는 카멜케이스 (acUser)로 테이블명을 정의하고, db에서는 스네이크케이스 (ac_user)로 정의하는데, 이런 것들을 연결시켜주고, constraint명을 정해주는 등
│   │   ├── global.constants.ts
│   │   ├── global.enum.ts
│   │   └── global.module.ts   -- 중요. 디비 커넥션 정보등
│   ├── interceptor
│   │   └── logging.interceptor.ts
│   ├── main.ts
│   ├── middleware
│   │   └── logger.middleware.ts
│   ├── migrations
│   │   └── 1673862090973-creatTest.ts
│   ├── model
│   │   ├── entity
│   │   │   ├── acUser.entity.ts
│   │   │   ├── accelerator.entity.ts
│   │   │   ├── authorityPolicy.entity.ts
│   │   │   ├── masterUser.entity.ts
│   │   │   └── portfolio.entity.ts
│   │   ├── repository
│   │   │   ├── acUser.repository.ts
│   │   │   ├── portfolio.repository.ts
│   │   │   └── repository.module.ts
│   │   └── subscriber
│   │       └── acTech.subscriber.ts
│   ├── module
│   │   ├── ac-user
│   │   │   ├── ac-user.controller.spec.ts
│   │   │   ├── ac-user.controller.ts
│   │   │   ├── ac-user.module.ts
│   │   │   ├── ac-user.service.spec.ts
│   │   │   └── ac-user.service.ts
│   │   ├── accelerator
│   │   │   ├── accelerator.controller.spec.ts
│   │   │   ├── accelerator.controller.ts
│   │   │   ├── accelerator.module.ts
│   │   │   ├── accelerator.service.spec.ts
│   │   │   └── accelerator.service.ts
│   │   ├── admin
│   │   │   ├── admin.controller.spec.ts
│   │   │   ├── admin.controller.ts
│   │   │   ├── admin.module.ts
│   │   │   ├── admin.service.spec.ts
│   │   │   ├── admin.service.ts
│   │   │   └── dto
│   │   │       ├── create-acKeyword.dto.ts
│   │   │       └── create-acTech.dto.ts
│   │   └── portfolio
│   │       ├── dto
│   │       │   └── create-portfolio.dto.ts
│   │       ├── portfolio.controller.spec.ts
│   │       ├── portfolio.controller.ts
│   │       ├── portfolio.module.ts
│   │       ├── portfolio.service.spec.ts
│   │       └── portfolio.service.ts
│   └── util
│       ├── dto
│       │   └── set-redis-test.dto.ts
│       ├── hash.util.ts
│       ├── redis.util.ts
│       ├── util.module.ts
│       └── winston.util.ts
├── test
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── tsconfig.build.json
├── tsconfig.json
└── webpack-hmr.config.js

```

## TypeORM 0.3.X 버전으로 업데이트에 따른 파일 역할 변화

TypeORM이 0.3 버전으로 업데이트 되었다. (db연결부가 기존의 ormConfig에서 dataSource로 변경되는 등의 많은 변화가 있었다)
하지만 가장 크게 체감하는 변화는 `@EntityRepository` 어노테이션이 depreceated 된 것이다.
그에 따라 기존 홈페이지와 1.7에서 사용하던 구조에서 큰 변화를 겪게 되었다.

공식문서에서 0.3에서도 레포지터리 패턴을 지원한다고 되어있지만 기존 사용하던 레포지터리 패턴과는 의미하는 바가 조금 달라진 듯 하다.

> Repository패턴이란? 리포지토리는 데이터 원본에 액세스하는 데 필요한 논리를 캡슐화하는 클래스 또는 구성 요소입니다. 리포지토리는 공통 데이터 액세스 기능에 집중해 더 나은 유지관리를 제공하고 도메인 모델 계층에서 데이터베이스에 액세스하는 데 사용되는 기술이나 인프라를 분리합니다. Entity Framework와 같은 ORM(개체 관계 매핑)을 사용하는 경우 LINQ 및 강력한 형식화 덕분에 구현해야 할 코드가 간소화됩니다. 이렇게 하면 데이터 액세스 내부 작업보다 데이터 지 속성 논리에 더 집중하게 합니다.

~~기존에는 repository라는 파일을 따로 만들어 그 안에서 쿼리들을 만들고, 서비스에서는 비즈니스 로직들만 작성했다면,
새로 업데이트 된 버전에서는 service 단에서 쿼리를 만드는 방식을 추천하는 느낌이다.~~

기존과 비슷한 방식으로 Repository 패턴을 사용하지만, 자동완성이 안된다...

[NestJs 공식문서](https://docs.nestjs.com/techniques/database)

```ts
// users.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
```

기존 repository 패턴에 익숙해지기도 했고, 꽤 합당한 방식이라고 생각했기에 기존 repository패턴을 그대로 사용하는 방법을 많이 찾아보았다.
인터넷에는 나와 같이 바뀐 패턴에 적응하지 못하고 기존 entityRepository와 같이 기능할 수 있는 방법들을 소개하는 글들이 여럿있었다.
가장 대표적인 방법으로는 CustomDecorator를 사용해 이번에 depreceated된 @EntityRepository를 만들어 사용하는 방법이었다.
또, provider와 같이 repository를 만들어 사용하는 방법도 있었다. [NestJS@9.x.x & TypeORM@0.3.x에서 customRepository 쉽게 사용하기](https://velog.io/@wonjun1995/NestJS9.x.x-TypeORM0.3.x%EC%97%90%EC%84%9C-customRepository-%EC%89%BD%EA%B2%8C-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0)

두 방법 모두 시도해 보았으나,
provider와 같이 repository를 만들어 사용하는 방법에서는 transaction 과 관련된 문제가 있었고,  
CustomDecorator를 사용한 방법에서는 대략 다음과 같은 에러가 발생하였다.

```
[Nest] 160316  - 2022. 10. 19. 오후 12:21:50   ERROR [ExceptionHandler] Nest can't resolve dependencies of the UserService (?). Please make sure that the argument UserRepository at index [0] is available in the UserModule context.
```

아마도 의존성 주입이 잘 안되고 있는 것 같다.

돌고 돌아 공식문서에서 사용하는 방식대로 사용하기로 했다.
불편하게 됬지만, 이렇게 개발한 나름의 이유가 있지 않을까 생각한다.....
즉, service를 기존 (1.7, 홈페이지)에서 사용하는 repository 처럼 사용하는 방법으로 사용하기로 했다.
그에 따라 컨트롤러와 서비스 파일들이 조금 많아질 것 같다.

```
│   ├── module
│   │   ├── ac-user
│   │   │   ├── ac-user.controller.spec.ts
│   │   │   ├── ac-user.controller.ts
│   │   │   ├── ac-user.module.ts
│   │   │   ├── ac-user.service.spec.ts
│   │   │   └── ac-user.service.ts
```

## JWT에 정보 넣고, Request에 넣어서 불러오는 방법

1. 우선 로그인 할 때, 넣을 정보들을 가져온다.
   Ex) master-local.strategy.ts의 validate => authService.validateMasterUser => adminService.fineOneByUserEmailMasterUser => masterUserRepository.selectMasterUserByEmail 에 더 가져올 정보들을 넣어준다.
2. 반환해줄 JWT에 추가해줄 정보를 넣는다.
   adminController.masterUserLogin => this.authService.masterGetCookieWithJwtAccessToken(req.user);

```ts
 masterGetCookieWithJwtAccessToken(masterUser: MasterUser) {
  const payload = {
    id: masterUser.id,
    email: masterUser.email,
    accelerator: masterUser.accelerator.id, // 새로추가
    // authorityPolicy: acUser.authorityPolicy,
  };
```

3. accessToken을 사용해 request 할 때, accessToken을 verify해주는 부분에서 위에서 추가한 부분을 추가해준다.

```ts
async validate(payload: MasterUser) {
  return {
    id: payload.id,
    email: payload.email,
    accelerator: payload.accelerator,
    // authorityPolicy: payload.authorityPolicy,
  };
```

4. 새로 추가된 정보를 사용할 부분에서 Request 객체를 가져와 사용한다.

```ts
createTech(@Body() createAcTechDto: CreateAcTechDto, @Req() req) {
  // this.adminService
  console.log('req.user : ', req.user);

  this.adminService.createTech(createAcTechDto);
}
```

## DB 연결정보

global.moduloe.ts

```ts
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Accelerator } from 'src/model/entity/accelerator.entity';
import { AcStructure } from 'src/model/entity/acStructure.entity';
import { AcUser } from 'src/model/entity/acUser.entity';
import { AuthorityPolicy } from 'src/model/entity/authorityPolicy.entity';
import { MasterUser } from 'src/model/entity/masterUser.entity';
import { Portfolio } from 'src/model/entity/portfolio.entity';
import { CustomNamingStrategy } from './customNamingStrategy';
import { constantString } from './global.constants';
import { AcTech } from 'src/model/entity/acTech.entity';
import { AcKeyword } from 'src/model/entity/acKeyword.entity';
import { AcTechKeyword } from 'src/model/entity/acTechKeyword.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      name: constantString.latticeConnection,
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST'),
        port: config.get('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_LATTICE_DATABASE'),
        logging: false,
        entities: [
          Portfolio,
          AcUser,
          AuthorityPolicy,
          MasterUser,
          AcStructure,
          Accelerator,
          AcTech,
          AcKeyword,
          AcTechKeyword,
        ], // entity metadata
        // entities: ['../model/entity/*.entity.ts'],
        namingStrategy: new CustomNamingStrategy(),
      }),
    }),
  ],
  exports: [],
})
export class GlobalModule {}
```

global.module.ts에서 TypeOrmModule을 imports해서 DB연결을 정의해주고, TypeOrmModule을 imports한 GlobalModule을 다시 export 해서 TypeOrmModule이 필요한 곳에서 쓸 수 있도록 하였다.

## 엔티티 추가 방법 및 사용방법 (레포지터리)

1. model - entity 에서 해당하는 디렉토리에 엔티티 파일을 만들어준다.

   ```ts
   import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

   @Entity({
     database: process.env.DB_HOMEPAGE_DATABASE,
     schema: process.env.DB_HOMEPAGE_DATABASE,
     name: 'hp_portfolio',
   })
   export class HpPortfolio {
     @PrimaryGeneratedColumn()
     portfolioId!: number;

     @Column()
     companyName!: string;
   }
   ```

2. `global.entity.ts` 파일의 entities 배열에 추가.

```ts
import { AcKeyword } from 'src/model/entity/acKeyword.entity';
import { AcStructure } from 'src/model/entity/acStructure.entity';
import { AcTech } from 'src/model/entity/acTech.entity';
import { AcTechKeyword } from 'src/model/entity/acTechKeyword.entity';
import { AcUser } from 'src/model/entity/acUser.entity';
import { Accelerator } from 'src/model/entity/accelerator.entity';
import { AuthorityPolicy } from 'src/model/entity/authorityPolicy.entity';
import { MasterUser } from 'src/model/entity/masterUser.entity';
import { Portfolio } from 'src/model/entity/portfolio.entity';

export const entities = [
  Portfolio,
  AcUser,
  AuthorityPolicy,
  MasterUser,
  AcStructure,
  Accelerator,
  AcTech,
  AcKeyword,
  AcTechKeyword,
];
```

아래 내용은 depreceated

<details>
<summary>접기/펼치기</summary>

2. GlobalModule 의 entity 배열에 1에서 만든 클래스를 추가해준다. (메타데이터)

3. repository - 해당 repository 디렉토리에 repository 파일을 만들어준다.

   ```ts
   import { Injectable } from '@nestjs/common';
   import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
   import { HpPortfolio } from 'src/model/entity/homepage-entity/hpPortflio.entity';
   import { DataSource, Repository } from 'typeorm';
   import { Portfolio } from '../../entity/lattice-entity/portfolio.entity';

   @Injectable()
   export class HpPortfolioRepository {
     constructor(
       @InjectDataSource('homepageConnection') private dataSource: DataSource,
     ) {}

     selectAll() {
       return this.dataSource
         .getRepository(HpPortfolio)
         .createQueryBuilder('hpPortfolio')
         .getMany();
     }
   }
   ```

4. repository - 해당 repository 디렉토리의 moudle 에 3에서 만든 파일을 추가해준다.

   ```ts
   import { Module } from '@nestjs/common';
   import { TypeOrmModule } from '@nestjs/typeorm';
   import { Portfolio } from 'src/model/entity/lattice-entity/portfolio.entity';
   import { GlobalModule } from 'src/module/global/global.module';
   import { HpPortfolioRepository } from './hpPortfolio.repository';

   @Module({
     imports: [GlobalModule], // 여기서 GlobalModule을 임포트해주고 있기 때문에, TypeOrmModule을 다시 정의해주지 않아도 된다.
     controllers: [],
     providers: [HpPortfolioRepository], // 3에서 만든 파일
     exports: [HpPortfolioRepository], // 3에서 만든 파일 export
   })
   export class HomepageRepositoryModule {}
   ```

5. 위에서 만든 엔티티와 레포지터리를 사용할 모듈에 추가해준다.

   ```ts
   // portfolioModule
   import { Module } from '@nestjs/common';
   import { PortfolioService } from './portfolio.service';
   import { PortfolioController } from './portfolio.controller';
   import { TypeOrmModule } from '@nestjs/typeorm';
   import { Portfolio } from '../../model/entity/lattice-entity/portfolio.entity';
   import { LatticeRepositoryModule } from 'src/model/repository/lattice-repository/lattice-repository.module';
   import { HomepageRepositoryModule } from 'src/model/repository/homepage-repository/homepage-repository.module';

   @Module({
     imports: [
       // TypeOrmModule.forFeature([Portfolio], 'latticeConnection'),  // 이렇게 TypeOrmModule을 임포트 안해줘도 되는 게, GlobalModule에서 TypeOrmModule을 임포트하고 GlobalModule을 export하고, 이걸 다시  HomepageRepositoryModule에서 import 하고 export해주고 있기 때문에. GlobalModule -> HomepageRepositoryModule -> PortfolioModule
       LatticeRepositoryModule,
       HomepageRepositoryModule,
     ],
     controllers: [PortfolioController],
     providers: [PortfolioService],
   })
   export class PortfolioModule {}
   ```

6. 서비스단에서 사용할 수 있도록, 생성자에 지정해준다.

   ```ts
   // portfolio.service.ts
   import { Inject, Injectable } from '@nestjs/common';
   import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
   import { Portfolio } from '../../model/entity/lattice-entity/portfolio.entity';
   import { DataSource, Repository } from 'typeorm';
   import { CreatePortfolioDto } from './dto/create-portfolio.dto';
   import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
   import { PortfolioRepository } from 'src/model/repository/lattice-repository/portfolio.repository';
   import { HpPortfolioRepository } from 'src/model/repository/homepage-repository/hpPortfolio.repository';

   @Injectable()
   export class PortfolioService {
   constructor(
       @InjectDataSource('latticeConnection')  // lattice 연결
       private latticeDataSource: DataSource,
       private readonly portfolioRepository: PortfolioRepository,
       @InjectDataSource('homepageConnection') // homepage 연결
       private homepageDataSource: DataSource,
       private readonly hpPortfolioRepository: HpPortfolioRepository,
   ) {}

   async getAll() {
       return await this.portfolioRepository.selectAll();
   }

   async getAllHpPortfolio() {
       return await this.hpPortfolioRepository.selectAll();
   }



   ```

</details>

## TypeORM 공식문서에 나와있는 createQueryBuilder를 사용하는 방법

portfolio.service.ts

```ts
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { constantString } from 'src/global/global.constants';
import { Portfolio } from 'src/model/entity/portfolio.entity';
import { AcUserRepository } from 'src/model/repository/acUser.repository';
import { PortfolioRepository } from 'src/model/repository/portfolio.repository';
import { Repository } from 'typeorm';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';

@Injectable()
export class PortfolioService {
  constructor(
    private readonly portfolioCustomRepository: PortfolioRepository, // custom으로 만들어본 repository
    @InjectRepository(Portfolio, constantString.latticeConnection)
    private portfolioRepository: Repository<Portfolio>, // nestjs 공식 문서에 나와있는 repository pattern
    private readonly acUserRepository: AcUserRepository,
  ) {}

  async getAll() {
    // throw new Error('testest');
    // throw new ForbiddenException();

    // customRepository 사용
    // return await this.portfolioCustomRepository.selectAll();

    // 공식문서에 나와있는 버젼으로 createQueryBuilder 사용
    // return await this.portfolioRepository
    //   .createQueryBuilder('portfolio')
    //   .getMany();

    // 찐 공식문서에 나와있는 내용
    return await this.portfolioRepository.find();
  }

  async createPortfolio(createPortfolioDto: CreatePortfolioDto) {
    // return await this.portfolioRepository.createOne();

    return await this.portfolioRepository.insert(createPortfolioDto);
  }
}
```

## 기타

src/auth/local.strategy.ts (로그인 auth관련)

```
validate 메서드가 로그인 api 실행 이전에 먼저 실행되어 해당 유저의 상태를 검사해주는 역할을 해줄 것이다.
주의할 점은 기본적으로 username 과 password 필드로 설정이 되어있기 때문에 username 이 아닌 email 필드로 검사하고 싶다면 contructor에 위와 같이 usernameField: 'email' 을 설정해줘야 한다
```

### 모듈끼리 순환참조가 일어날 경우 (서로를 임포트 할 때)

: https://docs.nestjs.com/fundamentals/circular-dependency

로그인 할 때 localAuthGuard를 통해 아이디와 비밀번호를 검증 후 JWT를 내려주고, 그 후부터는 Jwt-AuthGuard를 통해 토큰을 검사후 api를 실행한다.

### 다른 DTO를 property로 갖는 DTO를 만드는 방법

예를 들어 CreateAcKeywordDto를 property로 갖는 CreateAcTechDto를 만들려고 한다면

```ts
// createAcTechDto
export class CreateAcTechDto extends PickType(AcTech, [
  'name',
  'description',
  'isActive',
]) {
  @ApiProperty({ type: [CreateAcKeywordDto] }) // 여기서는 CreateAcKeywordDto를 배열로 받아주기 위해 배열로 감싸줬다. 배열로 감싸주지 않으면 그냥 object로 받음
  acKeyword: CreateAcKeywordDto[];
}
// createAcKeywordDto
import { ApiProperty, PickType } from '@nestjs/swagger';
import { AcKeyword } from 'src/model/entity/acKeyword.entity';

export class CreateAcKeywordDto extends PickType(AcKeyword, ['name']) {
  @ApiProperty({ example: 'aaa' })
  id!: string;
}
```

###
