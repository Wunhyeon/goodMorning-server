import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { constantString } from 'src/global/global.constants';
import { User } from 'src/model/entity/user.entity';
import { Plan } from 'src/model/entity/plan.entity';
import { DataSource, Repository } from 'typeorm';
import { CreatePlanDto } from './dto/create-plan.dto';

@Injectable()
export class PlanService {
  constructor(
    @InjectDataSource(constantString.morningeeConnection)
    private dataSource: DataSource,
    @InjectRepository(Plan, constantString.morningeeConnection)
    private planRepository: Repository<Plan>,
    @InjectRepository(User, constantString.morningeeConnection)
    private acUserRepository: Repository<User>,
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

    // 목표시간은 KTC로 되어있으므로 UTC로 바꿔줌
    const goalTimeUtc =
      constantString.PLAN_START_TIME_HOUR - 9 < 0
        ? 24 + (constantString.PLAN_START_TIME_HOUR - 9)
        : constantString.PLAN_END_TIME_HOUR - 9;

    const startTime = new Date();
    if (now.getHours() < goalTimeUtc) {
      startTime.setUTCDate(startTime.getUTCDate() - 1);
    }

    const endTime = new Date();
    endTime.setUTCDate(startTime.getUTCDate() + 1);

    // 시간 설정. UTC 타입으로 맞춰주기. 목표시간 - 9시간(KTC)가 -가 나오면, 하루를 빼주고, 시간은 24시 + (목표시간 - 9시간)(음수가 나오기 때문에, +를 해줬다.).
    if (constantString.PLAN_START_TIME_HOUR - 9 < 0) {
      // yesterdayStartTime
      startTime.setUTCHours(
        24 + (constantString.PLAN_START_TIME_HOUR - 9),
        constantString.PLAN_START_TIME_MINUTE,
        0,
        0,
      );

      // todayStartTime
      endTime.setUTCHours(
        24 + (constantString.PLAN_START_TIME_HOUR - 9),
        constantString.PLAN_START_TIME_MINUTE,
        0,
        0,
      );
    } else {
      startTime.setUTCHours(
        constantString.PLAN_START_TIME_HOUR - 9,
        constantString.PLAN_START_TIME_MINUTE,
        0,
        0,
      );
      endTime.setUTCHours(
        constantString.PLAN_START_TIME_HOUR - 9,
        constantString.PLAN_START_TIME_MINUTE,
        0,
        0,
      );
    }

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
}
