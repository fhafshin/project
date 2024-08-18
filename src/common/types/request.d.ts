import { UserEntity } from 'src/module/user/entity/user.entity';

declare global {
  namespace Express {
    interface Request {
      user: UserEntity;
    }
  }
}
