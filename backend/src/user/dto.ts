import { Field, InputType } from "@nestjs/graphql";
import { IsEmpty, IsNotEmpty, IsNumber, IsString } from "class-validator";

@InputType()
export class updateProfileDto {
    @Field()
    @IsNumber({allowNaN:false,allowInfinity:false,maxDecimalPlaces:10000})
    @IsNotEmpty({message:"Please Enter An id"})
    id :number


    @Field()
    @IsString({message:"FullName Must Be String.",})
    @IsEmpty()
    fullname :string

    @Field()
    @IsString({message:"FullName Must Be String.",})
    @IsEmpty()
    avatarUrl ?:string

}