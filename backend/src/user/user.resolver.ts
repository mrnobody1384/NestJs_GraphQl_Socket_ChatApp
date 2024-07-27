import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.type';
import { UseGuards } from '@nestjs/common';
import { GraphqlAuthGuard } from 'src/auth/graphql.auth.guard';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js'
import { Request } from 'express';
import {v4 as uuid4} from 'uuid'
import { join } from 'path';
import { createWriteStream } from 'fs';
@Resolver()
export class UserResolver {

constructor(
    private readonly userService: UserService,
  ) {}

  @UseGuards(GraphqlAuthGuard)
  @Mutation(()=>User)
  async updateProfile(
    @Args('fullname') fullname: string,
    @Args('filen',{type:()=> GraphQLUpload,nullable:true}) file: GraphQLUpload.file,
    @Context() contex: {req:any}
  ){

    const imageUrl = file ? await this.storeImageAndGetUrl(file): null
    const userId = contex.req.user.sub;
    return this.userService.updateProfile({id:userId,fullname:fullname,avatarUrl:imageUrl})
  }

    private async storeImageAndGetUrl(file: GraphQLUpload){
        const {createReadStream,filename}= await file;
        const uniqeFileName = `${uuid4()}_${filename}`
        const imagePath = join(process.cwd(),'public',uniqeFileName)
        const imageUrl = `${process.env.APP_URL}/${uniqeFileName}`
        const readStream = createReadStream()
        readStream.pipe(createWriteStream(imagePath))
        return imageUrl;
    }


}
