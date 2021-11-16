
import { Field, InputType } from '@nestjs/graphql';
import {  MaxLength } from 'class-validator';

@InputType()
export class UpdateUserWithIdInput {
    @Field()
    userId: string;

    @Field()
    @MaxLength(30)
    firstName: string;

    @Field()
    @MaxLength(30)
    lastName: string;

    @Field({nullable:true})
    avatarUrl: string;

    @Field({nullable:true})
    isActive: boolean;
}