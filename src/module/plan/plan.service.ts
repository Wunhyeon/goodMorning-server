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
    today.setHours(today.getHours() + 9);
    const yesterdayStartTime = new Date();
    yesterdayStartTime.setHours(yesterdayStartTime.getHours() + 9);
    yesterdayStartTime.setDate(yesterdayStartTime.getDate() - 1);
    yesterdayStartTime.setHours(constantString.PLAN_START_TIME_HOUR);
    const todayStartTime = new Date();
    todayStartTime.setHours(todayStartTime.getHours() + 9);
    todayStartTime.setHours(constantString.PLAN_START_TIME_HOUR);

    const nowHour = today.getHours();

    if (nowHour < constantString.PLAN_START_TIME_HOUR) {
      return (
        this.acUserRepository
          .createQueryBuilder('acUser')
          .leftJoin(
            'acUser.plan',
            'plan',
            `plan.creationTime >= :yesterdayStartTime AND plan.creationTime < :todayStartTime`,
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
      return (
        this.acUserRepository
          .createQueryBuilder('acUser')
          .leftJoin(
            'acUser.plan',
            'plan',
            `plan.creationTime >= :todayStartTime`,
            { todayStartTime },
          )
          .select([
            'acUser.id',
            'acUser.email',
            'acUser.name',
            'plan.id',
            'plan.contents',
            'plan.creationTime',
          ])
          // .where('plan.creationTime >= :todayStartTime', { todayStartTime })
          .getMany()
      );
    }
  }
}
