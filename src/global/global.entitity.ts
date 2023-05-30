import { User } from '../model/entity/user.entity';
import { MasterUser } from '../model/entity/masterUser.entity';
import { Plan } from '../model/entity/plan.entity';
import { EntitySchema } from 'typeorm/entity-schema/EntitySchema';

export const entities = [MasterUser, User, Plan];
