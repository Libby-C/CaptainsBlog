import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';

export enum UserRole {
  SUPERADMIN = "superadmin", // can see all
  GUEST = "guest", // can only see demo data/ trial?
}

@Entity()
@ObjectType()
export class User {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  intercomUserId: string;

  @Field()
  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.GUEST
  })
  role: UserRole;

  @Field()
  @Column()
  username: string; // email whatever

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  avatarUrl: string;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field()
  @Column({ default: false })
  hasVerifiedEmail: boolean;

  @Field({ nullable: true })
  @Column()
  @CreateDateColumn()
  createdAt: Date;
  
  @Field({ nullable: true })
  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}