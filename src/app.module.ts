import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { StripeModule } from 'nestjs-stripe';

@Module({
  imports: [
    StripeModule.forRoot({
      apiKey: process.env.STRIPE_SECRET,
      apiVersion:"2020-08-27"
    }),
    UserModule,
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: 'schema.gql',
      context: ({ req }) => ({ req })
    }),
    TypeOrmModule.forRoot({
    // @ts-ignore
   type: process.env.SQL_DB_TYPE || "mysql",
   host: process.env.SQL_DB_HOST || 'localhost',
    // @ts-ignore
   port: process.env.SQL_DB_PORT || 3306,
   username: process.env.SQL_DB_USERNAME || 'root',
   password: process.env.SQL_DB_PASSWORD || 'root',
   database: process.env.SQL_DB_DATABASE_NAME || 'test',
   autoLoadEntities: true,
   entities:  [
    User,
    ],
   migrations: ["dist/server-app/migration//*.js"],
   synchronize: true, // unsafe with data
  }),
  TypeOrmModule.forRoot({
     // @ts-ignore
    type: process.env.NOSQL_DB_TYPE || "mongodb",
    url: process.env.NOSQL_DB_URL || 'localhost',
     // @ts-ignore
    database: process.env.NOSQL_DB_DATABASE_NAME || 'test',
    name: 'audit',
    entities: [],
  }),
],
  controllers: [AppController],
  providers: [AppService,],
})
export class AppModule {}


