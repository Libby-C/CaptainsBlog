import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import {UserResolver} from './user.resolver'

@Global()
@Module({
    imports: [
    TypeOrmModule.forFeature([User]),

  ],
    providers: [
      UserService,
      UserResolver],
    controllers: [UserController],
  })
export class UserModule {}
