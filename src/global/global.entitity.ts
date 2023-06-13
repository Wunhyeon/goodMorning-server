import { User } from '../model/entity/user.entity'; // 여기 주소에 주의
import { MasterUser } from '../model/entity/masterUser.entity';
import { Plan } from '../model/entity/plan.entity';
import { EntitySchema } from 'typeorm/entity-schema/EntitySchema';
import { Job } from '../model/entity/job.entity';
import { UserJob } from '../model/entity/userJob.entity';

export const entities = [MasterUser, User, Plan, Job, UserJob];
