import { NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'apollo-server-express';
import { UserArgs } from './user.args'
import { User, UserRole } from './entities/user.entity';
import { UserService } from './user.service';
import { NewUserInput } from './inputs/new-user.input';
import { UpdateUserWithIdInput } from './inputs/update-user-with-id.input';
import { CurrentUser } from './user.decorator';




import { UpdateUserWithUsernameInput } from './inputs/update-user-with-username.input';

const pubSub = new PubSub();

@Resolver(of => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,

    ) {}


  @Query(returns => User)
  async whoAmI(@CurrentUser() userReq: any): Promise<User> {
    let user = await this.userService.findOneByUsername(userReq.email);
    if (!user) {
      throw new NotFoundException(userReq.email);
    }

  
    return user;
  }

  @Query(returns => User)
  async user(@Args('id') id: string): Promise<User> {
    const user = await this.userService.findOneById(id);
    if (!user) {
      throw new NotFoundException(id);
    }
    return user;
  }

  // @UseGuards(GqlAuthGuard)
  @Query(returns => User)
  async userByUsername(@Args('username') username: string): Promise<User> {
    const user = await this.userService.findOneByUsername(username);
    if (!user) {
      throw new NotFoundException(username);
    }
    return user;
  }

  @Mutation(returns => User)
  async removeUser(@Args('username') username: string, @CurrentUser() userReq: any): Promise<User> {
    let user = await this.userService.findOneByUsername(username);
    if (!user) {
      throw new NotFoundException(username);
    }
    user = await this.userService.softRemoveUser(user);
    const currentUser = await this.userService.findOneByUsername(userReq.email);
    if (!currentUser) {
      throw new NotFoundException(userReq.email);
    }


    return user;
  }
  @Mutation(() => User)
  async updateUserWithId(@Args('updateUserWithIdInput') updateUserWithId: UpdateUserWithIdInput) {
    const currentUser = await this.userService.findOneById(updateUserWithId.userId);
    if (!currentUser) {
      throw new NotFoundException(updateUserWithId.userId);
    }
    updateUserWithId.avatarUrl  = updateUserWithId.avatarUrl ? updateUserWithId.avatarUrl : currentUser.avatarUrl;
    let user: User = await this.userService.updateWithId(updateUserWithId.userId, updateUserWithId);
    user = {...currentUser,...user};
    return user;

  }


  @Mutation(() => User)
  async updateUserWithUsername(@Args('updateUserWithUsernameInput') updateUserWithUsernameInput: UpdateUserWithUsernameInput) {
    const currentUser = await this.userService.findOneByUsername(updateUserWithUsernameInput.username);
    if (!currentUser) {
      throw new NotFoundException(updateUserWithUsernameInput.username);
    }
    updateUserWithUsernameInput.avatarUrl  = updateUserWithUsernameInput.avatarUrl ? updateUserWithUsernameInput.avatarUrl : currentUser.avatarUrl;
    let user: User = await this.userService.updateWithUsername(currentUser.id, updateUserWithUsernameInput);
    user = {...currentUser,...user};
    return user;
  }

  @Mutation(returns => Boolean)
  async deleteUser(@Args('id') id: string) {
    return this.userService.removeUser(id);
  }

  
  @Subscription(returns => User)
  userAdded() {
    return pubSub.asyncIterator('userAdded');
  }
}