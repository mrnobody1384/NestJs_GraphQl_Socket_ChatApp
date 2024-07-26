import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js'
import { BadRequestException, ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: "http://localhost:5173",
    credentials:true,
    allowedHeaders:[
      "Accept",
      "Authorization",
      "Content-Type",
      "X-Requested-With",
      "appolo-require-preflight"
    ],
    methods:[
      "GET","PUT","POST",
      "DELETE","OPTIONS"
    ]
  })

  app.use(cookieParser())
  app.use(graphqlUploadExpress({maxFileSize: 1000000000,maxFiles:1}))

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform:true,
    exceptionFactory :(error)=>{
      const formattedErrors = error.reduce((accumulator,error)=>{
        accumulator[error.property]= Object.values(error.constraints).join(', ');
        return accumulator
      },{})

      throw new BadRequestException(formattedErrors)
    }
  }))
  await app.listen(3000);
}
bootstrap();
