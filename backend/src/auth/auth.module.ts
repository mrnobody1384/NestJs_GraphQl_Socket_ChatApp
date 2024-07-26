import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports:[
    JwtModule.register({
      global:true,
    })
    ,
    PrismaModule
  ],
  providers: [AuthResolver, AuthService]
})
export class AuthModule {}
