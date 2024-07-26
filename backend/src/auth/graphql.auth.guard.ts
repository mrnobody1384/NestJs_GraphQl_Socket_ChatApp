import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class GraphqlAuthGuard implements CanActivate{
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ){}


    async canActivate(context:ExecutionContext):Promise<boolean>{
        const gqlCtx = context.getArgByIndex(2) 
        const request : Request = gqlCtx.req;
        const token = this.extractTokenFromCookie(request);
        if (!token){
            throw new UnauthorizedException("No token provided.")
        }

        try{
            const payload = await this.jwtService.verifyAsync(token,{secret:this.configService.get<string>("ACCESS_TOKEN_SECRET")})
            request['user'] = payload;

        }
        catch (err) {
            throw new UnauthorizedException("Invalid token.")
        }
        return true

    }   

     extractTokenFromCookie(req: Request): (string | undefined){
        return req.cookies?.access_token
    }
}