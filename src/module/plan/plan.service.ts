import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { constantString, errorString } from 'src/global/global.constants';
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
    private userRepository: Repository<User>,
    private readonly util: Util,
  ) {}

  // 단일 쿼리 //////////////

  /**
   * userId와 startTime, endTime으로 해당 기간 내에 작성한 계획들
   * @param userId
   * @param startTime
   * @param endTime
   * @returns
   */
  async selectPlanByUserAndCreationTime(
    userId: number,
    startTime: Date,
    endTime: Date,
  ) {
    return await this.planRepository
      .createQueryBuilder('plan')
      .innerJoin('plan.user', 'user', 'user.id = :userId', { userId })
      .select(['plan.id', 'plan.creationTime', 'plan.contents'])
      .where('plan.creationTime >= :startTime', { startTime })
      .andWhere('plan.creationTime < :endTime', { endTime })
      .orderBy('plan.id', 'DESC')
      .getMany();
  }

  // 쿼리를 사용하지 않는 헬퍼유틸들  /////////////////////////////
  /**
   * creationTime과 목표시간을 받아서 성공했는지(1), 반절 성공인지(2), 실패인지(3) 판단.
   * 현재는 7시~9시 성공, 9시~12시 반절성공, 12시~ 다음날 7시 실패. 이지만, 이걸 앞으로도 어떻게 할지는 회의필요.
   * 일시적인 메서드가 될 수 있을듯
   * @param creationTime
   * @param startTime 시작시간
   * @param endTime 성공 범위안의 끝시간. 이 시간안에 들어와야 성공
   * @param halfSuccessTime 성공시간은 지났지만, 이 시간안에 들어오면 절반성공
   */
  judgeSuccess(
    creationTime: Date,
    startTime: Date,
    endTime: Date,
    halfSuccessTime: Date,
  ) {
    //
    if (creationTime >= startTime && creationTime < endTime) {
      return 1;
    } else if (creationTime >= endTime && creationTime < halfSuccessTime) {
      return 2;
    } else {
      return 3;
    }
  }

  // 여러 쿼리 조합. 트랜잭션 필요 등.  ///////////////////////////////

  async insertPlan(user: User, plan: CreatePlanDto) {
    // 오늘 쓴 글(목표시간~다음목표시간)이 있는지
    const now = new Date();

    // 시작시간, 끝시간 받아오기 (오늘기준)
    const { startTime, endTime } =
      this.util.utcGetStartTimeAndEndTimeRangeDayTerm(
        1,
        now,
        constantString.UTC_PLAN_START_TIME_HOUR,
        constantString.UTC_PLAN_START_TIME_MINUTE,
        0,
      );

    const exist = await this.selectPlanByUserAndCreationTime(
      user.id,
      startTime,
      endTime,
    );

    if (exist && exist.length > 0) {
      throw new ForbiddenException(errorString.DUPLICATE_CREATION_TIME);
    }

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
    // const { startTime, endTime } = this.util.getStartTimeAndEndTimeRangeDayTerm(
    //   1,
    //   now,
    //   constantString.PLAN_START_TIME_HOUR,
    //   constantString.PLAN_START_TIME_MINUTE,
    // );

    const { startTime, endTime } =
      this.util.utcGetStartTimeAndEndTimeRangeDayTerm(
        1,
        now,
        constantString.UTC_PLAN_START_TIME_HOUR,
        constantString.UTC_PLAN_START_TIME_MINUTE,
        0,
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

    return this.userRepository
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
    const { startTime, endTime } =
      this.util.utcGetStartTimeAndEndTimeRangeDayTerm(
        1,
        new Date(),
        constantString.UTC_PLAN_START_TIME_HOUR,
        constantString.UTC_PLAN_START_TIME_MINUTE,
        0,
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

  /**
   * 오늘 계획만 수정가능. (당일 pm 11:59 이내에만 수정 가능)
   * @param userId
   * @param plan
   */
  updateTodayMyPlan(userId: number, plan: CreatePlanDto) {
    // 오늘 계획만 수정가능. (당일 pm 11:59까지 = 12시 전까지 (한국시간) => UTC 03:00  이내에만 수정 가능)
    const { creationTime, contents } = plan;
    const now = new Date();

    // 당일인지 확인하는 date (당일 pm 11:59까지 = 12시 전까지 (한국시간) => UTC 03:00  이내에만 수정 가능) => 이부분 확인필요. 이거 다 통과하는 거 아니야? 저장된 date를 기준으로 가져와야 할 듯.
    const today = this.util.utcGetStartTimeAndEndTimeRangeDayTerm(
      1,
      now,
      3,
      0,
      0,
    );

    if (creationTime > today.endTime || creationTime < today.startTime) {
      throw new ForbiddenException(errorString);
    }

    // 로그를 쌓자!
    // 로그 쌓을 부분

    // 저장된 date를 기준으로 가져오는 startTime, endTime
    const { startTime, endTime } =
      this.util.utcGetStartTimeAndEndTimeRangeDayTerm(
        1,
        new Date(),
        constantString.UTC_PLAN_START_TIME_HOUR,
        constantString.UTC_PLAN_START_TIME_MINUTE,
        0,
      );

    // contents 업데이트
    return this.planRepository
      .createQueryBuilder('plan')
      .innerJoin('plan.user', 'user')
      .update(Plan)
      .set({ contents })
      .where('user.id = :userId', { userId })
      .andWhere('creationTime > :startTime', { startTime })
      .andWhere('creationTime < :endTime', { endTime })
      .execute();
  }
}
