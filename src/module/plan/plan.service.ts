import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { constantString } from 'src/global/global.constants';
import { User } from 'src/model/entity/user.entity';
import { Plan } from 'src/model/entity/plan.entity';
import { DataSource, Repository } from 'typeorm';
import { CreatePlanDto } from './dto/create-plan.dto';
import { Util } from 'src/util/util';

@Injectable()
export class PlanService {
  constructor(
    @InjectDataSource(constantString.morningeeConnection)
    private dataSource: DataSource,
    @InjectRepository(Plan, constantString.morningeeConnection)
    private planRepository: Repository<Plan>,
    @InjectRepository(User, constantString.morningeeConnection)
    private acUserRepository: Repository<User>,
    private readonly util: Util,
  ) {}

  async insertPlan(user: User, plan: CreatePlanDto) {
    return await this.planRepository.insert({
      user: user,
      creationTime: plan.creationTime,
      contents: plan.contents,
      isSuccess: 1,
    });
  }

  getAllUserThisTimePlan2() {
    const now = new Date();

    // 시작시간, 끝시간 받아오기 (오늘기준)
    const { startTime, endTime } = this.util.getStartTimeAndEndTimeRangeDayTerm(
      1,
      now,
      constantString.PLAN_START_TIME_HOUR,
      constantString.PLAN_START_TIME_MINUTE,
    );

    /*
    SELECT a1.id, plan.id AS plan_id, plan.contents, plan.creation_time
    FROM ac_user a1
    LEFT JOIN plan
    ON plan.id = (
          SELECT id
              FROM plan
              WHERE ac_user_id = a1.id
              AND creation_time >= "2023-05-23T22:00:00.000Z" AND creation_time < "2023-05-24T22:00:00.000Z"
              ORDER BY created_at DESC
              LIMIT 1
          );

    */

    return this.acUserRepository
      .createQueryBuilder('user')
      .leftJoin(
        'user.plan',
        'plan',
        `plan.id = (SELECT plan.id 
                FROM plan 
                WHERE  user_id = user.id AND (creation_time >= :startTime AND creation_time < :endTime) ORDER BY plan.created_at DESC LIMIT 1)`,
        { startTime, endTime },
      )
      .select([
        'user.id',
        'user.email',
        'user.name',
        'plan.id',
        'plan.contents',
        'plan.creationTime',
      ])
      .getMany();
  }

  /**
   * 오늘 내가 쓴 계획 조회.
   * @param userId
   */
  getTodayMyPlan(userId: number) {
    // 시작시간, 끝시간 받아오기 (오늘기준)
    const { startTime, endTime } = this.util.getStartTimeAndEndTimeRangeDayTerm(
      1,
      new Date(),
      constantString.PLAN_START_TIME_HOUR,
      constantString.PLAN_START_TIME_MINUTE,
    );

    return this.planRepository
      .createQueryBuilder('plan')
      .innerJoin('plan.user', 'user', 'user.id = :userId', { userId })
      .select(['plan.id', 'plan.contents', 'plan.creationTime'])
      .where('plan.creationTime >= :startTime', { startTime })
      .andWhere('plan.creationTime < :endTime', { endTime })
      .orderBy('plan.creationTime', 'DESC')
      .getOne();
  }
}
