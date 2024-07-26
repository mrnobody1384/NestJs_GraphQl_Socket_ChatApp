
import { Resolver,Query, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginResponse, RegisterResponse } from './types';
import { Request, Response } from 'express';
import { LoginDto, RegisterDto } from './dto';
import { BadRequestException } from '@nestjs/common';
import { ServerResponse } from 'http';

@Resolver()
export class AuthResolver {
    constructor(
        private readonly authService: AuthService
     ){}
   

@Query(()=>String)
async hello(){
    return "Hello"
}
@Query(()=>String)
async bye(){
    return "Bye"
}

@Query(()=>String)
async mo(){
    return "mo"
}

@Mutation(()=> RegisterResponse)
async register(
    @Args('registerInput') registerdto: RegisterDto,
    @Context() context : {res:Response}
){

    const {user} = await this.authService.register(registerdto,context.res)
    return {user}
}


@Mutation(()=>LoginResponse)
async login(
    @Args('loginInput') logindto:LoginDto,
    @Context() context: {res:any,req:Request}
){
    console.log(context.res)
    return this.authService.login(logindto,context.res)
}

@Mutation(()=> String)
async logout(
    @Context() context: {res:Response}
){
    return this.authService.logout(context.res)
}


@Mutation(()=> String)
async refreshToken(

    @Context() context: {res:Response,req:Request}
){
    console.log("refresh token called");

    try {
        
        return this.authService.refreshToken(context.req, context.res);

    } catch (error) {
        throw new BadRequestException(error.message)
    }   

}
}
