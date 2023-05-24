import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { constantString } from 'src/global/global.constants';
import { AcUser } from 'src/model/entity/acUser.entity';
import { Plan } from 'src/model/entity/plan.entity';
import { DataSource, Repository } from 'typeorm';
import { CreatePlanDto } from './dto/create-plan.dto';

@Injectable()
export class PlanService {
  constructor(
    @InjectDataSource(constantString.latticeConnection)
    private dataSource: DataSource,
    @InjectRepository(Plan, constantString.latticeConnection)
    private planRepository: Repository<Plan>,
    @InjectRepository(AcUser, constantString.latticeConnection)
    private acUserRepository: Repository<AcUser>,
  ) {}

  async insertPlan(user: AcUser, plan: CreatePlanDto) {
    return await this.planRepository.insert({
      acUser: user,
      creationTime: plan.creationTime,
      contents: plan.contents,
      isSuccess: 1,
    });
  }

  //   async getAllPlan() {
  //     // 시간 정하기 : 어제시작시간 ~ 오늘 시작시간 바로 직전까지
  //     // 오늘 시작시간
  //     // 어제 시작시간

  //     const today = new Date();
  //     const yesterdayStartTime = new Date();
  //     yesterdayStartTime.setDate(yesterdayStartTime.getDate() - 1);
  //     yesterdayStartTime.setHours(constantString.PLAN_START_TIME_HOUR);
  //     const todayStartTime = new Date();
  //     todayStartTime.setHours(constantString.PLAN_START_TIME_HOUR);

  //     this.planRepository
  //       .createQueryBuilder('plan')
  //       .innerJoin('acUser', 'acUser')
  //       .select(['plan.id', 'plan.contents', 'acUser.id', 'acUser.name'])
  //       .where('plan.creationTime >=');
  //   }

  getAllUserThisTimePlan() {
    // 시간정하기 : 어제시작시간 ~ 오늘 시작시간 바로 직전까지 X 오늘 시작시간 ~
    // 오늘 시작시간
    // 어제 시작시간

    // docker 의 경우 UTC로 켜지기 때문에, KST로 해주려면 +9시간 해주면된다.

    const today = new Date();
    const yesterdayStartTime = new Date();
    // yesterdayStartTime.setDate(yesterdayStartTime.getDate() - 1); ///////////////////
    yesterdayStartTime.setUTCHours(
      Math.abs((constantString.PLAN_START_TIME_HOUR - 9) % 24),
      0,
      0,
      0,
    ); //constantString.PLAN_START_TIME_HOUR에 KTC 기준 시간으로 되어있어서 UTC시간으로 해주기 위해 -9해줌
    const todayStartTime = new Date();
    console.log('todayStartTime1 : ', todayStartTime);
    todayStartTime.setDate(todayStartTime.getDate() + 1); /////////////////////////////
    // todayStartTime.setHours(constantString.PLAN_START_TIME_HOUR - 9); // constantString.PLAN_START_TIME_HOUR  KTC 기준 시간으로 되어있어서 UTC시간으로 해주기 위해 -9해줌
    todayStartTime.setUTCHours(
      Math.abs((constantString.PLAN_START_TIME_HOUR - 9) % 24),
      0,
      0,
      0,
    );
    console.log('todayStartTime2 : ', todayStartTime);

    const nowHour = (today.getUTCHours() + 9) % 24; // nowHour는 UTC Time이고, constantString.PLAN_START_TIME_HOUR 는 UTC 기준이므로, 비교를 위해서는 UTC Time에 +9시간을 해준다.
    console.log(
      'constantString.PLAN_START_TIME_HOUR : ',
      constantString.PLAN_START_TIME_HOUR,
    );

    console.log('nowHour : ', nowHour);

    console.log('today.toUTCString() : ', today.toUTCString());

    console.log('yesterdayStartTime : ', yesterdayStartTime);
    console.log('todayStartTime : ', todayStartTime);

    // 비교용 date
    const compareDate = new Date();
    // compareDate.setHours(compareDate.getHours() + 9);

    // 비교용 목표시간
    const compareGoalDate = new Date();
    compareGoalDate.setHours(
      compareDate.getHours() + constantString.PLAN_START_TIME_HOUR,
    );

    console.log('compareDate : ', compareDate);
    console.log('compareGoalDate : ', compareGoalDate);

    // if (nowHour < constantString.PLAN_START_TIME_HOUR) {
    if (compareDate < compareGoalDate) {
      // 전날 목표시간 이후 ~ 오늘 목표시간 전까지의 계획
      console.log('000');

      // return (
      //   this.acUserRepository
      //     .createQueryBuilder('acUser')
      //     .leftJoin(
      //       'acUser.plan',
      //       'plan',
      //       `plan.creationTime >= :yesterdayStartTime AND plan.creationTime < :todayStartTime`,
      //       { yesterdayStartTime, todayStartTime },
      //     )
      //     .select([
      //       'acUser.id',
      //       'acUser.email',
      //       'acUser.name',
      //       'plan.id',
      //       'plan.contents',
      //       'plan.creationTime',
      //     ])
      //     // .where('plan.creationTime >= :yesterdayStartTime', {
      //     //   yesterdayStartTime,
      //     // })
      //     // .andWhere('plan.creationTime < :todayStartTime', { todayStartTime })
      //     .getMany()
      // );
      return (
        this.acUserRepository
          .createQueryBuilder('acUser')
          .leftJoin(
            'acUser.plan',
            'plan',
            `plan.id = (SELECT id
          FROM plan 
          WHERE creation_time >= :yesterdayStartTime
          AND creation_time < :todayStartTime
          ORDER BY created_at DESC
          LIMIT 1)`,
            { yesterdayStartTime, todayStartTime },
          )
          .select([
            'acUser.id',
            'acUser.email',
            'acUser.name',
            'plan.id',
            'plan.contents',
            'plan.creationTime',
          ])
          // .where('plan.creationTime >= :yesterdayStartTime', {
          //   yesterdayStartTime,
          // })
          // .andWhere('plan.creationTime < :todayStartTime', { todayStartTime })

          .getMany()
      );
    } else {
      // 오늘 목표시간 이후~ (다음날 목표시간 이전)
      console.log('else!!!');

      // return (
      //   this.acUserRepository
      //     .createQueryBuilder('acUser')
      //     .leftJoin(
      //       'acUser.plan',
      //       'plan',
      //       `plan.creationTime >= :todayStartTime`,
      //       { todayStartTime },
      //     )
      //     .select([
      //       'acUser.id',
      //       'acUser.email',
      //       'acUser.name',
      //       'plan.id',
      //       'plan.contents',
      //       'plan.creationTime',
      //     ])
      //     // .where('plan.creationTime >= :todayStartTime', { todayStartTime })
      //     .getMany()
      // );

      return this.acUserRepository
        .createQueryBuilder('acUser')
        .select([
          'acUser.id',
          'acUser.name',
          'plan.id',
          'plan.contents',
          'plan.createdAt',
          'plan.creationTime',
        ])
        .leftJoin(
          'acUser.plan',
          'plan',
          'plan.id = (SELECT id FROM plan WHERE creation_time >= :creationTime ORDER BY created_at DESC LIMIT 1)',
          { creationTime: todayStartTime },
        )
        .getMany();
    }
  }

  getAllUserThisTimePlan2() {
    const now = new Date();

    // 목표시간은 KTC로 되어있으므로 UTC로 바꿔줌
    const goalTimeUtc =
      constantString.PLAN_START_TIME_HOUR - 9 < 0
        ? 24 + (constantString.PLAN_START_TIME_HOUR - 9)
        : constantString.PLAN_END_TIME_HOUR - 9;

    const yesterdayStartTime = new Date();
    yesterdayStartTime.setUTCDate(yesterdayStartTime.getUTCDate() - 1);

    const todayStartTime = new Date();

    // 시간 설정. UTC 타입으로 맞춰주기. 목표시간 - 9시간(KTC)가 -가 나오면, 하루를 빼주고, 시간은 24시 + (목표시간 - 9시간)(음수가 나오기 때문에, +를 해줬다.).
    if (constantString.PLAN_START_TIME_HOUR - 9 < 0) {
      // yesterdayStartTime
      yesterdayStartTime.setUTCDate(yesterdayStartTime.getUTCDate() - 1);
      yesterdayStartTime.setUTCHours(
        24 + (constantString.PLAN_START_TIME_HOUR - 9),
        constantString.PLAN_START_TIME_MINUTE,
        0,
        0,
      );

      // todayStartTime
      todayStartTime.setUTCDate(todayStartTime.getUTCDate() - 1);
      todayStartTime.setUTCHours(
        24 + (constantString.PLAN_START_TIME_HOUR - 9),
        constantString.PLAN_START_TIME_MINUTE,
        0,
        0,
      );
    } else {
      yesterdayStartTime.setUTCHours(
        constantString.PLAN_START_TIME_HOUR - 9,
        constantString.PLAN_START_TIME_MINUTE,
        0,
        0,
      );
      todayStartTime.setUTCHours(
        constantString.PLAN_START_TIME_HOUR - 9,
        constantString.PLAN_START_TIME_MINUTE,
        0,
        0,
      );
    }

    // 시간비교.
    if (now.getUTCHours() < goalTimeUtc) {
      yesterdayStartTime.setUTCDate(yesterdayStartTime.getUTCDate() + 1);
      todayStartTime.setUTCDate(todayStartTime.getUTCDate() + 1);
    }

    return this.acUserRepository
      .createQueryBuilder('acUser')
      .leftJoin(
        'acUser.plan',
        'plan',
        `plan.id = (SELECT id FROM plan WHERE creation_time >= :yesterdayStartTime AND creation_time < :todayStartTime ORDER BY created_at DESC LIMIT 1)`,
        { yesterdayStartTime, todayStartTime },
      )
      .select([
        'acUser.id',
        'acUser.email',
        'acUser.name',
        'plan.id',
        'plan.contents',
        'plan.creationTime',
      ])
      .getMany();
  }
}