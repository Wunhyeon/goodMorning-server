import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { constantString } from 'src/global/global.constants';
import { Job } from 'src/model/entity/job.entity';
import { User } from 'src/model/entity/user.entity';
import { Util } from 'src/util/util';
import { Repository } from 'typeorm';

@Injectable()
export class CommonService {
  constructor(
    @InjectRepository(Job, constantString.morningeeConnection)
    private jobRepository: Repository<Job>,

    @InjectRepository(User, constantString.morningeeConnection)
    private userRepository: Repository<User>,

    private readonly util: Util,
  ) {}

  // 단일쿼리 ////////////////////////
  async getAllJob() {
    const jobArr = await this.jobRepository
      .createQueryBuilder('job')
      .select(['job.id AS id', 'job.name AS name', 'job.parent as parentId'])
      .getRawMany();

    return jobArr;

    // // // 만약 Hierarchy화가 필요하다면
    // return this.util.buildHierarchy(jobArr, null);
  }

  ////////////////////////////////
}
