import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { NewUserInput } from './inputs/new-user.input';
import { UserArgs } from './user.args';
import { UpdateUserWithIdInput } from './inputs/update-user-with-id.input';
import { UpdateUserWithUsernameInput } from './inputs/update-user-with-username.input';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
      ) {}
    
      async updateWithId(id: string, data: UpdateUserWithIdInput): Promise<User> {
        return this.usersRepository.save({...data, id: id});
      }

      async updateWithUsername(id: string, data: UpdateUserWithUsernameInput): Promise<User> {
        return this.usersRepository.save({...data, id: id})
      }
    
      async findOneById(id: string): Promise<User> {
                // create a better quer
        
                let user = await this.usersRepository
                .createQueryBuilder("user") 
                .where("user.id=:id")
                .setParameter("id",id)
                .getOne();
                // user.admin.company = teamMember.admin.company;
                return user;
      }



      async findOneByUsername(usernameInput: string): Promise<User> {
        // create a better query

        let user = await this.usersRepository
        .createQueryBuilder("user")
        .where("user.username=:username")
        .setParameter("username",usernameInput)
        .getOne();
        // user.admin.company = teamMember.admin.company;
        return user;
      }

      async findAllUsers(userArgs: UserArgs): Promise<User[]> {
        return this.usersRepository.find({relations:["admin","teamMember"]});
      }

      async softRemoveUser(user:User): Promise<User> {
        user = await this.usersRepository.save({isActive:false,id:user.id});
        return user;
      }
    
      async removeUser(id: string): Promise<boolean> {
        await this.usersRepository.delete(id);
        return true;
      }
}
