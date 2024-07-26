import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

@InputType()
export class RegisterDto {
    @Field()
    @IsNotEmpty({message:"FullName Is Required"})
    @IsString({message:"FullName Must Be A String."})
    fullname:string

    @Field()
    @IsNotEmpty({message:"Password Is Required."})
    @IsString()
    @MinLength(8,{message: "Password Must Be At Least 8 Characters."})
    password:string

    @Field()
    @IsNotEmpty({message:"Confirm Password Is Required."})
    @IsString()
    confirmpassword:string

    @Field()
    @IsNotEmpty({message:"Email Is Required."})
    @IsString()
    @IsEmail({require_tld:true},{message: "Email Must Be A Valid Email Address.",always:true}) 
    email:string
    
}


@InputType()

export class LoginDto{


    @Field()
    @IsNotEmpty({message:"Email Is Required."})
    @IsString()
    @IsEmail({}, {message: "Email Must Be A Valid Email Address."})
    email: string

    @Field()
    @IsNotEmpty({message:"Password Is Required."})
    @IsString()
    password:string
}