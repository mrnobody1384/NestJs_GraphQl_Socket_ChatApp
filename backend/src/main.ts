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


  app.use(graphqlUploadExpress({maxFileSize: 1000000000,maxFiles:1}))

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
dismissDefaultMessages: true,
    transform:true,
    exceptionFactory :(errors)=>{
      const formattedErrors = errors.reduce((accumulator,error)=>{
        console.log(error)
        accumulator[error.property]= Object.values(error.constraints).join(', ');
        return accumulator
      },{})
      console.log(formattedErrors)
      throw new BadRequestException(JSON.stringify(formattedErrors))
    }
  }))
  app.use(cookieParser())
  await app.listen(3000);
}
bootstrap();
