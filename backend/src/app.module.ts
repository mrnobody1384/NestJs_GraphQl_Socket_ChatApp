import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';

import { GraphQLModule } from '@nestjs/graphql';
import {ApolloDriver } from '@nestjs/apollo'
import { join } from 'path';
import {ConfigModule,ConfigService} from '@nestjs/config'
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaModule } from './prisma/prisma.module';



@Module({
  imports: [AuthModule, UserModule,UserModule,
    GraphQLModule.forRootAsync({
      imports: [ConfigModule,AppModule],
      inject: [ConfigService],
      driver: ApolloDriver,
      useFactory: async (
        configService: ConfigService,
      ) => {

        return {
          playground:true,
          autoSchemaFile: join(process.cwd(),'src/schema.gql'),
          sortSchema: true,
          context:({ req, res }) => ({ req, res })

        }

      }
    }
    ),
    ConfigModule.forRoot(
      {
        isGlobal: true,
        envFilePath: `./../.env`,
      }
    )
, PrismaModule
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
