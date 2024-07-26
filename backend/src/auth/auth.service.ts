import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/user/user.type';
import { LoginDto, RegisterDto } from './dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService

    ){}
    async refreshToken(req:Request, res:Response){
        const refreshToken = req.cookies['refresh_token'];
        if (!refreshToken) throw new UnauthorizedException("Refresh Token Not Found.")
        
        let payload;;

        try {
            payload = await this.jwtService.verifyAsync(refreshToken,{
                secret:this.configService.get(<string>('REFRESH_TOKEN_SECRET'))
            });
        } catch (error) {
            throw new UnauthorizedException("Invalid Or Expired Refresh Token")
        }

        const userExist = await this.prisma.user.findUnique({
            where :{
                id: payload.sub
            }
        })

        if (!userExist) throw new BadRequestException("User No Longer Exist.")

        const expiresIn = 15000;
        const expiration = Math.floor(Date.now()/1000) + expiresIn
        const accessToken = await this.jwtService.signAsync({
            ...payload,exp: expiration
        },{
            secret: this.configService.get<string>("ACCESS_TOKEN_SECRET")
        })

        res.cookie('access_token',accessToken,{
            httpOnly: true,sameSite:"lax"
        })
        return accessToken
    }


    private async  issueTokens(user: User, res:Response) {
        console.log(this.configService.getOrThrow<string>("REFRESH_TOKEN_SECRET"))
        console.log(this.configService.get("ACCESS_TOKEN_SECRET"))

        const payload = {username:user.fullname, sub:user.id}
        const access_token = await this.jwtService.signAsync(payload,{
            secret: this.configService.get<string>("ACCESS_TOKEN_SECRET"),
            expiresIn: '150sec'
        })
        console.log(this.configService.get("REFRESH_TOKEN_SECRET"))
        console.log(this.configService.get("ACCESS_TOKEN_SECRET"))
        const refresh_token = await this.jwtService.signAsync(payload,{
            secret: this.configService.get<string>("REFRESH_TOKEN_SECRET"),
            expiresIn :'7d'
        })
        res.cookie('access_token',access_token,{
            httpOnly:true,
            sameSite: true
        })
        res.cookie("refresh_token",refresh_token,{
            httpOnly:true,
            sameSite:true
        })

        return {user}
    }

    async comparePassword(sendedPass:string,savedPass): Promise<boolean> {
        return bcrypt.compare(sendedPass, savedPass);
    }

    async validateUser(logindto:LoginDto){
        const user = await this.prisma.user.findUnique({
            where:{
                    email: logindto.email
                }   
        });

        if (user && await this.comparePassword(logindto.password, user.password)){
            return user
        }
        return null;
}

    async register(registerdto:RegisterDto,res: Response){

        const existingUser = await this.prisma.user.findUnique({
            where:{
                email: registerdto.email
            }        })

        if (existingUser) throw new BadRequestException("Email is already taken.") 
        if (registerdto.password!== registerdto.confirmpassword) throw new BadRequestException("Passwords do not match. Please try again.  ")
        
        const hashedPassword = await bcrypt.hash(registerdto.password, 10);
        const user = await this.prisma.user.create({
            data:{
                fullname: registerdto.fullname,
                email: registerdto.email,
                password: hashedPassword
            }
        })


        return await this.issueTokens(user,res)
    }


    async login (logindto: LoginDto, res: Response){
        
        const user = await this.validateUser(logindto)
        if (!user) throw new UnauthorizedException("Invalid Credentials.")
        
        return this.issueTokens(user,res)
    }

    async logout(res:Response){
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        return {message: "Logged Out Successfully."}

    }


}
